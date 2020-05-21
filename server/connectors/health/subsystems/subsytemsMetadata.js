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

module.exports = [
  {
    name: "traces",
    components: [
      {
        name: "indexer",
        type: "span-consumer",
        container_name: "trace-indexer",
        metrics: {
          source: "graphite",
          metricNamesList: ["records-consumed.rate", "records-lag.max"],
          groupByTags: ["host"],
        },
      },
      {
        name: "reader",
        container_name: "trace-reader",
        metrics: {
          source: "graphite",
          metricNamesList: [
            "read.time.OneMinuteRate",
            "read.failures.OneMinuteRate",
          ],
          groupByTags: ["host"],
        },
      },
    ],
  },
  {
    name: "trends",
    components: [
      {
        name: "span-transformer",
        type: "span-consumer",
        container_name: "span-timeseries-transformer",
        metrics: {
          source: "graphite",
          metricNamesList: ["records-consumed.rate", "records-lag.max"],
          groupByTags: ["host"],
        },
      },
      {
        name: "timeseries-aggregator",
        type: "span-consumer",
        container_name: "timeseries-aggregator",
        metrics: {
          source: "graphite",
          metricNamesList: ["records-consumed.rate", "records-lag.max"],
          groupByTags: ["host"],
        },
      },
    ],
  },
  {
    name: "service-graph",
    components: [
      {
        name: "node_finder",
        type: "span-consumer",
        container_name: "node_finder",
        metrics: {
          source: "graphite",
          metricNamesList: ["records-consumed.rate", "records-lag.max"],
          groupByTags: ["host"],
        },
      },
      {
        name: "graph-builder",
        container_name: "graph-builder",
        metrics: {
          source: "graphite",
          metricNamesList: ["records-consumed.rate", "records-lag.max"],
          groupByTags: ["host"],
        },
      },
    ],
  },
  {
    name: "collector",
    components: [
      {
        name: "kinesis",
        type: "span-consumer",
        container_name: "kinesis-span-collector",
        metrics: {
          source: "graphite",
          metricNamesList: [
            "ingestion-success.OneMinuteRate",
            "processing.lag.99thPercentile",
          ],
          groupByTags: ["host"],
        },
      },
    ],
  },
];
