/*
 * Copyright 2020 Expedia Group
 *
 *         Licensed under the Apache License, Version 2.0 (the "License");
 *         you may not use this file except in compliance with the License.
 *         You may obtain a copy of the License at
 *
 *             http://www.apache.org/licenses/LICENSE-2.0
 *
 *         Unless required by applicable law or agreed to in writing, software
 *         distributed under the License is distributed on an "AS IS" BASIS,
 *         WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *         See the License for the specific language governing permissions and
 *         limitations under the License.
 */

const _ = require("lodash");
const metricsFetcher = require("../../../fetchers/influxdbFetcher");
const config = require("../../../config/config");

const metadata = {
  subsystemName: "collector",
  components: [
    {
      name: "kinesis",
      dashboard_name: "kinesis-span-collector",
      container_name: "kinesis-span-collector",
      metricsSourceDb: "graphite",
      metricNames: ["record-send.rate", "processing.lag.99thPercentile"],
    },
  ],
};

const connector = {};

function dataPointsSum(dataPoints) {
  return dataPoints.reduce(
    (accumulator, dataPoint) => accumulator + dataPoint[1],
    0
  );
}

function calculateTrendChange(metricPoints) {
  const sortedMetricPoints = _.sortBy(
    metricPoints,
    (metricPoint) => metricPoint[0]
  );
  const partitionedMetricPoints = _.partition(
    sortedMetricPoints,
    (metricPoint) =>
      metricPoint[0] <
      sortedMetricPoints[Math.round(sortedMetricPoints.length / 2)][0]
  );
  const maxByPartition = partitionedMetricPoints.map((metricPoints) =>
    _.meanBy(metricPoints, (metricPoint) => metricPoint[1])
  );
  return parseFloat(maxByPartition[0] - maxByPartition[1]).toFixed(2);
}

function getLatestMetricPoint(metricPoints) {
  return _.findLast(
    metricPoints,
    (metricPoint) => ({
      timestamp: metricPoint[0],
      value: metricPoint[1],
    }),
    metricPoints.length - 2
  );
}

function extractSummary(metricData) {
  return {
    ...metricData,
    latestMetricPoint: getLatestMetricPoint(metricData.metricPoints),
    trendChange: calculateTrendChange(metricData.metricPoints),
    aggregatedValue: parseFloat(
      dataPointsSum(metricData.metricPoints) / metricData.metricPoints.length
    ).toFixed(2),
  };
}

function getComponentMetrics(componentMetadata, lookback) {
  const metricDataReqPromise = componentMetadata.metricNames.map(
    (metricName) => {
      const queryParams = {
        db: componentMetadata.metricsSourceDb,
        metricName,
        componentName: componentMetadata.name,
        subsystemName: metadata.subsystemName,
        lookback,
      };
      return metricsFetcher.getMetricData(queryParams);
    }
  );
  return Promise.all(metricDataReqPromise)
    .then((metrics) => metrics.map((metricData) => extractSummary(metricData)))
    .then((componentMetrics) => ({
      componentName: componentMetadata.name,
      dashboardName: componentMetadata.dashboard_name,
      metrics: componentMetrics,
    }));
}

connector.getMetrics = (lookback) => {
  return Promise.all(
    metadata.components.map((component) =>
      getComponentMetrics(component, lookback)
    )
  );
};

function calculateThroughput(metricData) {
  const latestMetricPoint = getLatestMetricPoint(metricData.metricPoints);
  return {
    throughput: parseFloat(latestMetricPoint[1]) * 60,
  };
}

connector.getThroughput = () => {
  const queryParams = {
    db: "graphite",
    metricName: "ingestion-success.OneMinuteRate",
    componentName: "kinesis",
    subsystemName: metadata.subsystemName,
  };
  return metricsFetcher
    .getMetricData(queryParams)
    .then((metrics) => calculateThroughput(metrics));
};

function getHealthStatus(lagMetric) {
  const iteratorAge = lagMetric.latestMetricPoint[1];
  const iteratorAgeThreshold =
    config.healthCheckthresholds.subsystems.collector.iteratorAgeSeconds * 1000;

  return {
    iteratorAge,
    isHealthy: iteratorAge < iteratorAgeThreshold,
  };
}

connector.getStatus = () => {
  const lagMetricQueryParams = {
    db: "graphite",
    metricName: "processing.lag.99thPercentile",
    componentName: "kinesis",
    subsystemName: metadata.subsystemName,
  };

  return metricsFetcher
    .getMetricData(lagMetricQueryParams)
    .then((lagMetric) => extractSummary(lagMetric))
    .then((lagMetricSummary) => getHealthStatus(lagMetricSummary));
};

module.exports = connector;
