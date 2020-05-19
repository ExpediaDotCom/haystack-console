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

const atrributorFetcher = require("../../../fetchers/attributorFetcher");
const collectorConnector = require("../../../connectors/health/subsystems/collector");
const dataCache = require("../../../utils/dataCache");

const connector = {};

function calculateAttributionOverallMetrics(attributionResults) {
  return {
    serviceCount: attributionResults.length,
    totalSpanCount: attributionResults.reduce(
      (sum, currentService) => sum + currentService.spanCount,
      0
    ),
    totalSpanSizeBytes: attributionResults.reduce(
      (sum, currentService) => sum + currentService.spanSizeBytes,
      0
    ),
  };
}

const attributionResultsCache = new dataCache(
  (params) => atrributorFetcher(params.from, params.to),
  12 * 60
);

connector.getAttributionResults = (from, to) => {
  return attributionResultsCache.getData({ from, to });
};

connector.getAttributionOverallMetrics = (from, to) => {
  return attributionResultsCache
    .getData({ from, to })
    .then((attributionResults) =>
      calculateAttributionOverallMetrics(attributionResults)
    );
};

connector.getThroughput = () => {
  return collectorConnector.getThroughput();
};

module.exports = connector;
