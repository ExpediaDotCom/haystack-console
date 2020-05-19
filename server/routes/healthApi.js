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

const subsystemsConnectors = {
  traces: require("../connectors/health/subsystems/traces"),
  trends: require("../connectors/health/subsystems/trends"),
  collector: require("../connectors/health/subsystems/collector"),
  ["service-graph"]: require("../connectors/health/subsystems/service-graph"),
};

const infrastructureConnectors = {
  kafka: require("../connectors/health/infrastructure/kafka"),
  k8sCluster: require("../connectors/health/infrastructure/k8sCluster"),
};

const systemConnector = require("../connectors/health/system/system");

const getSubsystemConnector = (name) => subsystemsConnectors[name];
const getInfrastructureConnector = (name) => infrastructureConnectors[name];

router.get("/health/subsystem/:name", function (req, res, next) {
  const { name } = req.params;
  const { lookback } = req.query;

  const connector = getSubsystemConnector(name);

  connector
    .getMetrics(lookback)
    .then((subsystemMetrics) => res.send(subsystemMetrics))
    .catch(next);
});

router.get("/health/subsystem/:name/throughput", function (req, res, next) {
  const { name } = req.params;

  const connector = getSubsystemConnector(name);

  connector
    .getThroughput()
    .then((subsystemMetrics) => res.send(subsystemMetrics))
    .catch(next);
});

router.get("/health/subsystem/:name/status", function (req, res, next) {
  const { name } = req.params;

  const connector = getSubsystemConnector(name);

  connector
    .getStatus()
    .then((status) => res.send(status))
    .catch(next);
});

router.get("/health/infrastructure/:name", function (req, res, next) {
  const { name } = req.params;
  const { lookback } = req.query;

  const connector = getInfrastructureConnector(name);

  connector
    .getMetrics(lookback)
    .then((infrastructureMetrics) => res.send(infrastructureMetrics))
    .catch(next);
});

router.get("/health/infrastructure/:name/status", function (req, res, next) {
  const { name } = req.params;

  const connector = getInfrastructureConnector(name);

  connector
    .getStatus()
    .then((infrastructureMetrics) => res.send(infrastructureMetrics))
    .catch(next);
});

router.get("/health/infrastructure/:name/throughput", function (
  req,
  res,
  next
) {
  const { name } = req.params;

  const connector = getInfrastructureConnector(name);

  connector
    .getThroughput()
    .then((infrastructureMetrics) => res.send(infrastructureMetrics))
    .catch(next);
});

router.get("/health/system/status", function (req, res, next) {
  systemConnector
    .getStatus({ ...subsystemsConnectors, ...infrastructureConnectors })
    .then((status) => res.send(status))
    .catch(next);
});

module.exports = router;
