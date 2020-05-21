/*
 * Copyright 2020 Expedia Group
 *
 *       Licensed under the Apache License, Version 2.0 (the "License");
 *       you may not use this file except in compliance with the License.
 *       You may obtain a copy of the License at
 *
 *           http://www.apache.org/licenses/LICENSE-2.0
 *
 *       Unless required by applicable law or agreed to in writing, software
 *       distributed under the License is distributed on an "AS IS" BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *       See the License for the specific language governing permissions and
 *       limitations under the License.
 *
 */

const express = require("express");
const router = express.Router();
const attributionConnector = require("../connectors/attribution/cluster/cluster");

router.get("/attribution/cluster", function (req, res, next) {
  const { from, to } = req.query;
  attributionConnector
    .getAttributionResults(from, to)
    .then((attributionResults) => res.send(attributionResults))
    .catch(next);
});

router.get("/attribution/cluster/overallMetrics", function (req, res, next) {
  const { from, to } = req.query;

  attributionConnector
    .getAttributionOverallMetrics(from, to)
    .then((attributionStats) => res.send(attributionStats))
    .catch(next);
});

router.get("/attribution/cluster/throughput", function (req, res, next) {
  const { from, to } = req.query;

  attributionConnector
    .getThroughput(from, to)
    .then((clusterThroughput) => res.send(clusterThroughput))
    .catch(next);
});

module.exports = router;
