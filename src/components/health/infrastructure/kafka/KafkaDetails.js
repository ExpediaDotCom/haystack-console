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
import "./KafkaDetails.scss";
import KafkaMetricsWidgets from "./KafkaMetricsWidgets";
import { ReactComponent as Unhealthy } from "../../../../images/error.svg";
import Loader from "../../../common/Loader";
import numeral from "numeral";
import { ReactComponent as Healthy } from "../../../../images/success.svg";
import useFetch from "../../../utils/useFetch.js";

const KafkaDetails = ({ name, lookback, dashboardName }) => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getBrokersCount = (tagsList) => {
    const hostTagObjectIndex = tagsList.findIndex((tags) =>
      Object.keys(tags).includes("host")
    );
    const hosts = tagsList[hostTagObjectIndex].host;
    return hosts.length;
  };

  const kafkaDetailsRequest = useFetch(
    `api/health/infrastructure/kafka?lookback=${lookback}`
  );
  const kafkaThroughputRequest = useFetch(
    "api/health/infrastructure/kafka/throughput"
  );
  const kafkaHealthRequest = useFetch("api/health/infrastructure/kafka/status");

  const isHealthy =
    kafkaHealthRequest.response && kafkaHealthRequest.response.isHealthy;

  const health = isHealthy ? (
    <Healthy height="15px" width="15px" />
  ) : (
    <Unhealthy height="15px" width="15px" />
  );

  return (
    <ListGroupItem>
      <ListGroupItemHeading className="clearfix">
        <div className="kafkaDetails-title-container float-left">
          <div className="mr-1">{toTitleCase(name)}</div>
          <div className="mr-1">{health}</div>
        </div>
        {kafkaThroughputRequest && kafkaDetailsRequest && (
          <div className="float-right h6">
            <span
              className={`badge badge-${isHealthy ? "success" : "danger"} mr-2`}
            >
              Throughput :{" "}
              {kafkaThroughputRequest.response
                ? numeral(
                    parseFloat(
                      kafkaThroughputRequest.response.throughput
                    ).toFixed(2)
                  ).format("0.0 a")
                : 0}{" "}
              per min
            </span>
            <span className="badge badge-info mr-2">
              Brokers :{" "}
              {kafkaDetailsRequest.response
                ? getBrokersCount(
                    kafkaDetailsRequest.response.metrics[0].groupByTags
                  )
                : 0}
            </span>
          </div>
        )}
      </ListGroupItemHeading>
      <CardGroup className="align-content-center">
        {kafkaDetailsRequest && kafkaDetailsRequest.response ? (
          <KafkaMetricsWidgets
            name={kafkaDetailsRequest.response.infrastructureComponentName}
            metrics={kafkaDetailsRequest.response.metrics}
            dashboardName={dashboardName}
          />
        ) : (
          <Loader type="ellipsis" />
        )}
      </CardGroup>
    </ListGroupItem>
  );
};

export default KafkaDetails;
