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
import { ListGroupItem, ListGroupItemHeading, CardGroup } from "reactstrap";
import { ReactComponent as Healthy } from "../../../images/success.svg";
import { ReactComponent as Unhealthy } from "../../../images/error.svg";
import "./SubsystemDetails.scss";
import SubsystemComponent from "./SubsystemComponent";
import Loader from "../../common/Loader";
import numeral from "numeral";
import useFetch from "../../utils/useFetch";

const SubsystemDetails = ({ name, lookback }) => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const iteratorAgeFormatter = (iteratorAge) => {
    if (iteratorAge === 0) {
      return "0";
    } else if (iteratorAge < 1000) {
      return `${iteratorAge.toFixed(2)} ms`;
    } else if (iteratorAge < 60000) {
      return `${(iteratorAge / 1000).toFixed(2)} s`;
    } else if (iteratorAge < 7200000) {
      return `${(iteratorAge / 60000).toFixed(2)} mins`;
    }
    return `${(iteratorAge / 3600000).toFixed(2)} hrs`;
  };

  const subsystemName = name;

  const subsystemDetailsRequest = useFetch(
    `api/health/subsystem/${subsystemName}?lookback=${lookback}`,
    []
  );
  const subsystemThroughputRequest = useFetch(
    `api/health/subsystem/${subsystemName}/throughput`,
    []
  );
  const subsystemHealthRequest = useFetch(
    `api/health/subsystem/${subsystemName}/status`,
    []
  );

  const isHealthy =
    subsystemHealthRequest.response &&
    subsystemHealthRequest.response.isHealthy;

  const health = isHealthy ? (
    <Healthy height="15px" width="15px" />
  ) : (
    <Unhealthy height="15px" width="15px" />
  );

  const runningStatus =
    subsystemHealthRequest.response &&
    subsystemHealthRequest.response.iteratorAge > 0
      ? `Running behind by ${iteratorAgeFormatter(
          subsystemHealthRequest.response.iteratorAge
        )}`
      : "Running normally";

  return (
    <ListGroupItem>
      <ListGroupItemHeading className="clearfix">
        <div className="subsystemDetails-title-container float-left">
          <div className="mr-1">{toTitleCase(subsystemName)}</div>
          <div className="mr-1">{health} </div>
          <div className="mr-1 subsystemDetails-title__consumption-status">
            {runningStatus}{" "}
          </div>
        </div>
        {subsystemThroughputRequest.response && (
          <div className="h6 float-right">
            <span className={`badge badge-${isHealthy ? "success" : "danger"}`}>
              Throughput :{" "}
              {subsystemThroughputRequest.response
                ? numeral(
                    parseFloat(
                      subsystemThroughputRequest.response.throughput
                    ).toFixed(2)
                  ).format("0.0 a")
                : 0}{" "}
              per min
            </span>
          </div>
        )}
      </ListGroupItemHeading>
      <CardGroup className="align-content-center">
        {subsystemDetailsRequest && subsystemDetailsRequest.response ? (
          subsystemDetailsRequest.response.map((subsystemDetails) => (
            <SubsystemComponent
              name={subsystemDetails.componentName}
              dashboardName={subsystemDetails.dashboardName}
              componentMetrics={subsystemDetails.metrics}
            />
          ))
        ) : (
          <Loader type="ellipsis" />
        )}
      </CardGroup>
    </ListGroupItem>
  );
};

export default SubsystemDetails;
