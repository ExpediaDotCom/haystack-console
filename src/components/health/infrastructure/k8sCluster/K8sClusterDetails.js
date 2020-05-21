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
import "./K8sClusterDetails.scss";
import K8sClusterWidgets from "./K8sClusterMetricsWidgets";
import { ReactComponent as Unhealthy } from "../../../../images/error.svg";
import Loader from "../../../common/Loader";
import { ReactComponent as Healthy } from "../../../../images/success.svg";
import useFetch from "../../../utils/useFetch.js";

const K8sClusterDetails = ({ name, lookback, dashboardName }) => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const getNodesCount = (tagsList) => {
    const nodesTagObjectIndex = tagsList.findIndex((tags) =>
      Object.keys(tags).includes("nodename")
    );
    const nodes = tagsList[nodesTagObjectIndex].nodename;
    return nodes.length;
  };

  const k8sClusterDetailsRequest = useFetch(
    `api/health/infrastructure/k8sCluster?lookback=${lookback}`
  );
  const k8sClusterHealthRequest = useFetch(
    "api/health/infrastructure/k8sCluster/status"
  );

  const isHealthy =
    k8sClusterHealthRequest.response &&
    k8sClusterHealthRequest.response.isHealthy;

  const health = isHealthy ? (
    <Healthy height="15px" width="15px" />
  ) : (
    <Unhealthy height="15px" width="15px" />
  );

  return (
    <ListGroupItem>
      <ListGroupItemHeading className="clearfix">
        <div className="k8sClusterDetails-title-container float-left">
          <div className="mr-1">{toTitleCase(name)}</div>
          <div className="mr-1">{health} </div>
        </div>
        {k8sClusterDetailsRequest ? (
          <div className="float-right h6">
            <span className="badge badge-info mr-2">
              Nodes :{" "}
              {k8sClusterDetailsRequest.response
                ? getNodesCount(
                    k8sClusterDetailsRequest.response.metrics[0].groupByTags
                  )
                : 0}
            </span>
          </div>
        ) : null}
      </ListGroupItemHeading>
      <CardGroup className="align-content-center">
        {k8sClusterDetailsRequest.response ? (
          <K8sClusterWidgets
            name={k8sClusterDetailsRequest.response.infrastructureComponentName}
            metrics={k8sClusterDetailsRequest.response.metrics}
            dashboardName={dashboardName}
          />
        ) : (
          <Loader type="ellipsis" />
        )}
      </CardGroup>
    </ListGroupItem>
  );
};

export default K8sClusterDetails;
