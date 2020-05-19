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

import React from "react";
import { Card, UncontrolledTooltip, Spinner } from "reactstrap";
import { ReactComponent as HealthIconCheck } from "../../../images/systemHealthIconCheck.svg";
import { ReactComponent as HealthcIconCross } from "../../../images/systemHealthIconCross.svg";
import { FaInfoCircle } from "react-icons/fa";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import numeral from "numeral";
import _ from "lodash";
import "./StatsResults.scss";

const StatsResults = ({
  serviceCostStats,
  throughput,
  subsystemsHealthStatus,
  subsystemsHealthStatusIsLoading,
}) => {
  const unhealthySubsystems = _.filter(
    subsystemsHealthStatus,
    (subsystemsHealthStatus) => subsystemsHealthStatus.isHealthy === false
  );

  const isHealthy = !(unhealthySubsystems.length > 0);

  return (
    <div className="stats">
      <div className="stats-widgets container">
        <div className="row text-center justify-content-center mb-3">
          <Card className="border-0 bg-transparent mr-2">
            <div className="stats_single-value">
              <div className="stats_single-value-text justify-content-center">
                {serviceCostStats && serviceCostStats.serviceCount
                  ? serviceCostStats.serviceCount
                  : 0}
              </div>
            </div>
            <small>Total Services</small>
          </Card>
          <Card className="border-0 bg-transparent ml-5 mr-2">
            <div className="stats_single-value">
              <div className="stats_single-value-text mr-3 justify-content-center">
                {serviceCostStats && serviceCostStats.totalSpanCount
                  ? numeral(serviceCostStats.totalSpanCount).format("0.0 a")
                  : 0}
              </div>
            </div>
            <small>Total Span Count</small>
          </Card>
          <Card className="border-0 bg-transparent ml-5 mr-2">
            <div className="stats_single-value">
              <div className="stats_single-value-text mr-3 justify-content-center">
                {serviceCostStats && serviceCostStats.totalSpanSizeBytes
                  ? numeral(serviceCostStats.totalSpanSizeBytes).format("0.0 b")
                  : 0}
              </div>
            </div>
            <small>Total Spans Size</small>
          </Card>
          <Card className="border-0 bg-transparent ml-5 mr-2">
            <div className="stats_single-value">
              <div className="stats_single-value-text mr-3 justify-content-center">
                {throughput
                  ? numeral(throughput.throughput).format("0.0 a")
                  : 0}
              </div>
            </div>
            <small>Incoming Spans (per min)</small>
          </Card>
          <Card className="border-0 bg-transparent ml-5 mr-2">
            <div className="stats_single-value">
              {isHealthy ? <HealthIconCheck /> : <HealthcIconCross />}
            </div>
            <small href="#" id="HealthSummary">
              Overall System Health <FaInfoCircle />
            </small>
            <UncontrolledTooltip
              placement="right"
              target="HealthSummary"
              className="healthsummary-tooltip"
            >
              {subsystemsHealthStatusIsLoading && (
                <Spinner type="grow" color="secondary" />
              )}
              {subsystemsHealthStatus &&
                Object.keys(subsystemsHealthStatus).map((subsystem) => (
                  <div>
                    {subsystem} :{" "}
                    {subsystemsHealthStatus[subsystem].isHealthy ? (
                      <IoIosCheckmarkCircleOutline color="#73AF55" />
                    ) : (
                      <IoIosCloseCircleOutline color="#D06079" />
                    )}
                  </div>
                ))}
            </UncontrolledTooltip>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StatsResults;
