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
  name: "kafka",
  metricsSourceDb: "graphite",
  metricNames: [
    "BrokerTopicMetrics.MessagesInPerSec.OneMinuteRate",
    "BrokerTopicMetrics.BytesInPerSec.OneMinuteRate",
    "BrokerTopicMetrics.BytesOutPerSec.OneMinuteRate",
  ],
  groupByTags: ["host"],
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

function getKafkaMetrics(metadata, lookback) {
  const metricDataReqPromise = metadata.metricNames.map((metricName) => {
    const queryParams = {
      db: metadata.metricsSourceDb,
      metricName,
      isInfrastructure: true,
      infrastructureName: metadata.name,
      groupByTags: metadata.groupByTags,
      lookback,
    };
    return metricsFetcher.getMetricData(queryParams);
  });
  return Promise.all(metricDataReqPromise)
    .then((metrics) => metrics.map((metricData) => extractSummary(metricData)))
    .then((metricsSeries) => ({
      infrastructureComponentName: metadata.name,
      metrics: metricsSeries,
    }));
}

connector.getMetrics = (lookback) => {
  return getKafkaMetrics(metadata, lookback);
};

connector.getThroughput = () => {
  const queryParams = {
    db: metadata.metricsSourceDb,
    metricName: "BrokerTopicMetrics.MessagesInPerSec.OneMinuteRate",
    isInfrastructure: true,
    infrastructureName: metadata.name,
    groupByTags: metadata.groupByTags,
  };
  return metricsFetcher
    .getMetricData(queryParams)
    .then((metrics) => calculateThroughput(metrics));
};

function getHealthStatus(metricData) {
  const latestCpuUsageMetricPoint = getLatestMetricPoint(
    metricData.metricPoints
  );
  const cpuUsageThreshold =
    config.healthCheckthresholds.infrastructure.kafka.cpuUsage;

  return {
    isHealthy:
      latestCpuUsageMetricPoint &&
      latestCpuUsageMetricPoint[1] < cpuUsageThreshold,
    latestCpuUsage: latestCpuUsageMetricPoint && latestCpuUsageMetricPoint[1],
  };
}

connector.getStatus = () => {
  const queryParams = {
    db: metadata.metricsSourceDb,
    metricName: "SystemCpuLoad",
    isInfrastructure: true,
    infrastructureName: metadata.name,
  };

  return metricsFetcher
    .getMetricData(queryParams)
    .then((metricData) => getHealthStatus(metricData));
};

module.exports = connector;
