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
const axios = require("axios");
const config = require("../config/config");
const fetcher = {};

function createQuery(queryParams) {
  const {
    metricName,
    subsystemName,
    componentName,
    isInfrastructure,
    infrastructureName,
    groupByTags,
    lookback,
  } = queryParams;
  const measurement = isInfrastructure
    ? `haystack.datastore.${infrastructureName}`
    : `haystack.${subsystemName}.${componentName}`;
  const groupByTagsStr =
    groupByTags && groupByTags.length > 0
      ? `,\"${groupByTags.join('","')}\"`
      : "";
  const lookbackMin = lookback ? parseInt(lookback) + 5 : "65";

  var query = [];

  // TODO - Metric Aggregation should be handled by Components Metrics

  if (
    metricName === "iterator.age.ms.50thPercentile" ||
    metricName === "SystemCpuLoad"
  ) {
    query = {
      traces: `SELECT MOVING_AVERAGE(mean(\"${metricName}\"), 5) FROM \"${measurement}\" WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      trends: `SELECT MOVING_AVERAGE(mean(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s  GROUP BY time(60s)`,
      collector: `SELECT MOVING_AVERAGE(mean(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      ["service-graph"]: `SELECT MOVING_AVERAGE(mean(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      kafka: `SELECT MOVING_AVERAGE(mean(\"${metricName}\"), 5) FROM \"${measurement}\" WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s) ${groupByTagsStr}`,
      k8sCluster: `SELECT mean("value") FROM \"${metricName}\" WHERE "type" = 'node' AND time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s) ${groupByTagsStr}`,
    };
  } else {
    query = {
      traces: `SELECT MOVING_AVERAGE(sum(\"${metricName}\"), 5) FROM \"${measurement}\" WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      trends: `SELECT MOVING_AVERAGE(sum(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s  GROUP BY time(60s)`,
      collector: `SELECT MOVING_AVERAGE(sum(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      ["service-graph"]: `SELECT MOVING_AVERAGE(sum(\"${metricName}\"), 5) FROM \"${measurement}\"  WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s)`,
      kafka: `SELECT MOVING_AVERAGE(sum(\"${metricName}\"), 5) FROM \"${measurement}\" WHERE time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s) ${groupByTagsStr}`,
      k8sCluster: `SELECT sum("value") FROM \"${metricName}\" WHERE "type" = 'node' AND time > now() - ${lookbackMin}m and time < now() - 300s GROUP BY time(60s) ${groupByTagsStr}`,
    };
  }

  return isInfrastructure ? query[infrastructureName] : query[subsystemName];
}

function mergeMetricSeries(metricSeries) {
  const metricDataPoints = _.flattenDepth(
    metricSeries.map((metricData) => metricData.values)
  );
  const timestamps = _.uniq(
    metricDataPoints.map((metricPoint) => metricPoint[0])
  );

  return _.compact(
    timestamps.map((timestamp) => {
      const metricPointValues = metricDataPoints
        .filter((metricPoint) => metricPoint[0] === timestamp)
        .map((metricPoints) => metricPoints[1]);
      const sumMetricPointValue = metricPointValues.reduce(
        (acc, metricPointValue) => acc + metricPointValue,
        0
      );

      return [timestamp, sumMetricPointValue];
    })
  );
}

function extractTagsValues(metricSeries) {
  const groupByTags = _.uniq(
    _.flattenDepth(
      metricSeries.map((metricData) => Object.keys(metricData.tags))
    )
  );
  return groupByTags.map((tag) => ({
    [tag]: metricSeries.map((metric) => metric.tags[tag]),
  }));
}

function parseInfluxdbResponse(queryResponse, queryParams) {
  if (queryResponse.series && queryResponse.series.length > 1) {
    return {
      ...queryParams,
      groupByTags: extractTagsValues(queryResponse.series),
      metricPoints: mergeMetricSeries(queryResponse.series),
    };
  }

  return {
    ...queryParams,
    metricPoints: queryResponse.series && queryResponse.series[0].values,
  };
}

fetcher.getMetricData = (queryParams) => {
  const q = createQuery(queryParams);
  const url = `${config.monitoringInfluxdbEndpoint}/query?db=${queryParams.db}&q=${q}&epoch="ms"`;

  return axios
    .get(url, { timeout: config.upstreamTimeout })
    .then((response) =>
      parseInfluxdbResponse(response.data.results[0], queryParams)
    );
};

module.exports = fetcher;
