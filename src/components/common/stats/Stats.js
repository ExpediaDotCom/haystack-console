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

import React, { useEffect, useState } from "react";
import StatsResults from "../stats/StatsResults";
import useFetch from "../../utils/useFetch";
import "./Stats.scss";

const Stats = () => {
  const span = 1000 * 60 * 5;

  const [timeRangeTo, setTimeRangeTo] = useState(Date.now() - span);
  const [timeRangeFrom, setTimeRangeFrom] = useState(
    Date.now() - span - 24 * 60 * 60 * 1000
  );

  useEffect(() => {
    const span = 1000 * 60 * 5;
    setTimeRangeTo(Date.now() - span);
    setTimeRangeFrom(Date.now() - span - 24 * 60 * 60 * 1000);
  }, []);

  const serviceCostStatsRequest = useFetch(
    `/api/attribution/cluster/overallMetrics?from=${timeRangeFrom}&to=${timeRangeTo}`
  );

  const throughputRequest = useFetch(
    `/api/attribution/cluster/throughput?from=${timeRangeFrom}&to=${timeRangeTo}`
  );

  const systemHealthRequest = useFetch("/api/health/system/status");

  return (
    <StatsResults
      serviceCostStats={serviceCostStatsRequest.response}
      throughput={throughputRequest.response}
      subsystemsHealthStatus={systemHealthRequest.response}
      subsystemsHealthStatusIsLoading={systemHealthRequest.isLoading}
    />
  );
};

export default Stats;
