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
  name: "k8sCluster",
  metricsSourceDb: "k8s",
  metricNames: [
    "cpu/usage_rate",
    "cpu/node_capacity",
    "memory/usage",
    "memory/node_capacity",
  ],
  groupByTags: ["nodename"],
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

function extractSummary(metricsData) {
  const cpuUsageMetrics = metricsData.find(
    (metricData) => metricData.metricName === "cpu/usage_rate"
  );
  const cpuCapacityMetrics = metricsData.find(
    (metricData) => metricData.metricName === "cpu/node_capacity"
  );
  const memoryUsageMetrics = metricsData.find(
    (metricData) => metricData.metricName === "memory/usage"
  );
  const memoryCapacityMetrics = metricsData.find(
    (metricData) => metricData.metricName === "memory/node_capacity"
  );

  const cpuCapacityLimit = getLatestMetricPoint(
    cpuCapacityMetrics.metricPoints
  )[1];
  const cpuUsagePercentageMetricPoints = cpuUsageMetrics.metricPoints.map(
    (metricPoint) => [metricPoint[0], metricPoint[1] / cpuCapacityLimit]
  );

  const memoryCapacity = getLatestMetricPoint(
    memoryCapacityMetrics.metricPoints
  )[1];
  const memoryUsagePercentageMetricPoints = memoryUsageMetrics.metricPoints.map(
    (metricPoint) => [metricPoint[0], metricPoint[1] / memoryCapacity]
  );

  return [
    {
      metricName: cpuUsageMetrics.metricName,
      latestMetricPoint: metricsData
        ? getLatestMetricPoint(cpuUsagePercentageMetricPoints)
        : [],
      metricPoints: cpuUsagePercentageMetricPoints,
      trendChange: calculateTrendChange(cpuUsagePercentageMetricPoints),
      groupByTags: cpuUsageMetrics.groupByTags,
    },
    {
      metricName: memoryUsageMetrics.metricName,
      latestMetricPoint: getLatestMetricPoint(
        memoryUsagePercentageMetricPoints
      ),
      metricPoints: memoryUsagePercentageMetricPoints,
      trendChange: calculateTrendChange(memoryUsagePercentageMetricPoints),
      groupByTags: cpuUsageMetrics.groupByTags,
    },
  ];
}

function getK8sClusterMetrics(metadata, lookback) {
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
    .then((metricsData) => extractSummary(metricsData))
    .then((metricsSeries) => ({
      infrastructureComponentName: metadata.name,
      metrics: metricsSeries,
    }));
}

function getHealthStatus(k8sClusterMetrics) {
  const metricsWithLatestValues = {};
  const cpuUsageThreshold =
    config.healthCheckthresholds.infrastructure.k8sCluster.cpuUsage;
  const memoryUsageThreshold =
    config.healthCheckthresholds.infrastructure.k8sCluster.memoryUsage;

  k8sClusterMetrics.forEach(
    (metric) =>
      (metricsWithLatestValues[metric.metricName] = metric.latestMetricPoint[1])
  );

  return {
    isHealthy:
      metricsWithLatestValues["cpu/usage_rate"] > cpuUsageThreshold &&
      metricsWithLatestValues["memory/usage"] > memoryUsageThreshold,
    ...metricsWithLatestValues,
  };
}

connector.getMetrics = (lookback) => {
  return getK8sClusterMetrics(metadata, lookback);
};

connector.getStatus = () => {
  return getK8sClusterMetrics(metadata).then((k8sClusterMetricsResponse) =>
    getHealthStatus(k8sClusterMetricsResponse.metrics)
  );
};

module.exports = connector;
