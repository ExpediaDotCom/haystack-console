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
const attributionConnector = require("../../../connectors/attribution/cluster/cluster");
const config = require("../../../config/config");

const metadata = {
  subsystemName: "trends",
  components: [
    {
      name: "span-transformer",
      dashboard_name: "span-transformer",
      container_name: "span-timeseries-transformer",
      metricsSourceDb: "graphite",
      metricNames: [
        "records-consumed.rate",
        "iterator.age.ms.50thPercentile",
        "records-lag.max",
      ],
    },
    {
      name: "timeseries-aggregator",
      dashboard_name: "timeseries-aggregator",
      container_name: "timeseries-aggregator",
      metricsSourceDb: "graphite",
      metricNames: [
        "records-consumed.rate",
        "iterator.age.ms.50thPercentile",
        "records-lag.max",
      ],
    },
  ],
};

const podsMetadata = {
  namespace_name: "haystack-apps",
  sourceDb: "k8s",
  metricNames: ["cpu/usage_rate", "cpu/limit", "memory/usage", "memory/limit"],
  groupByTags: ["pod_name"],
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
    latestMetricPoint:
      metricData.metricPoints && getLatestMetricPoint(metricData.metricPoints),
    trendChange:
      metricData.metricPoints && calculateTrendChange(metricData.metricPoints),
    aggregatedValue:
      metricData.metricPoints &&
      parseFloat(
        dataPointsSum(metricData.metricPoints) / metricData.metricPoints.length
      ).toFixed(2),
  };
}

function calculateThroughput(metricData) {
  const latestMetricPoint = getLatestMetricPoint(metricData.metricPoints);
  return {
    throughput: parseFloat(latestMetricPoint[1] * 60),
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

connector.getThroughput = () => {
  const queryParams = {
    db: "graphite",
    metricName: "records-consumed.rate",
    componentName: "span-transformer",
    subsystemName: metadata.subsystemName,
  };
  return metricsFetcher
    .getMetricData(queryParams)
    .then((metrics) => calculateThroughput(metrics));
};

function getHealthStatus(totalIncomingSpans, subsystemLagMetrics) {
  const currentLag = subsystemLagMetrics.latestMetricPoint[1];
  const iteratorAgeThreshold =
    config.healthCheckthresholds.subsystems.trends.iteratorAgeSeconds * 1000;
  const iteratorAge =
    parseFloat((currentLag / totalIncomingSpans).toFixed(2)) * 60 * 1000;
  return {
    totalIncomingSpans,
    iteratorAge,
    isHealthy: iteratorAge < iteratorAgeThreshold,
  };
}

connector.getStatus = () => {
  const span = 1000 * 60 * 5;
  const to = Date.now() - span;
  const from = to - span;

  const lagMetricQueryParams = {
    db: "graphite",
    metricName: "records-lag.max",
    componentName: "span-transformer",
    subsystemName: metadata.subsystemName,
  };

  return Promise.all([
    attributionConnector.getThroughput(from, to),
    metricsFetcher.getMetricData(lagMetricQueryParams),
  ])
    .then(
      (response) =>
        response && {
          totalIncomingSpans: response[0].throughput,
          subsystemLagMetrics: extractSummary(response[1]),
        }
    )
    .then(({ totalIncomingSpans, subsystemLagMetrics }) =>
      getHealthStatus(totalIncomingSpans, subsystemLagMetrics)
    );
};

module.exports = connector;
