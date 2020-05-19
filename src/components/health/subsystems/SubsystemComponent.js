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
import { Card } from "reactstrap";
import numeral from "numeral";
import Trend from "react-trend";
import _ from "lodash";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import TitleWithGrafanaLink from "../../common/TitleWithGrafanaLink";
import "./SubsystemComponent.scss";

const SubsystemComponent = ({ componentMetrics, name, dashboardName }) => {
  const extractSparklineData = (metricPoints) => {
    return metricPoints.map((metricPoint) =>
      metricPoint[1] === null ? 0 : metricPoint[1]
    );
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

  const formatMetricPoint = (metricName, metricPoint) => {
    if (metricName === "iterator.age.ms.50thPercentile") {
      return iteratorAgeFormatter(metricPoint);
    }
    return numeral(metricPoint).format("0.00a");
  };

  return (
    <Card body>
      <div className="d-flex flex-row align-content-center flex-wrap mx-auto">
        {componentMetrics &&
          _.size(componentMetrics) &&
          componentMetrics.map((metricDetails) => (
            <div className="metric-widget p-2 mt-3 mb-3 text-center">
              <div className="d-flex flex-row justify-content-center">
                <div className="metricvalue__single-digit mr-1 align-self-center">
                  {metricDetails.latestMetricPoint
                    ? formatMetricPoint(
                        metricDetails.metricName,
                        metricDetails.latestMetricPoint[1].toFixed(2)
                      )
                    : "NA"}
                </div>
                {metricDetails.trendChange < 0 ? (
                  <MdTrendingUp
                    color="green"
                    size="20px"
                    className="trend-icon align-self-center"
                  />
                ) : (
                  <MdTrendingDown
                    color="green"
                    size="20px"
                    className="trend-icon align-self-center"
                  />
                )}
              </div>
              {metricDetails.metricPoints && (
                <Trend
                  data={extractSparklineData(metricDetails.metricPoints)}
                  smooth
                  autoDraw
                  autoDrawDuration={500}
                  autoDrawEasing="ease-out"
                  stroke={"#17a2b8"}
                  radius={2}
                  strokeWidth={2.2}
                  strokeLinecap={"butt"}
                  width={120}
                  height={35}
                  className="mx-auto"
                />
              )}
              <div>
                <span className="metricname">{metricDetails.metricName}</span>
              </div>
            </div>
          ))}
      </div>
      <TitleWithGrafanaLink title={name} dashboardName={dashboardName} />
    </Card>
  );
};

export default SubsystemComponent;
