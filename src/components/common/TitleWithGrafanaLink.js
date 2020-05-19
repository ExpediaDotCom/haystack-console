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
import { FaExternalLinkAlt } from "react-icons/fa";
import "./TitleWithGrafanaLink.scss";

const TitleWithGrafanaLink = ({ title, dashboardName }) => {
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const grafanaHost =
    window.HAYSTACK_CONSOLE_CONFIG && window.HAYSTACK_CONSOLE_CONFIG.grafanaHost
      ? window.HAYSTACK_CONSOLE_CONFIG.grafanaHost
      : process.env.REACT_APP_CONFIG_GRAFANA_HOST;
  const grafanaLink = `${grafanaHost}/dashboard/db/${dashboardName}?refresh=1m&orgId=1`;

  return (
    <div className="p-1 title-container">
      <h5 className="text-center">
        <a
          href={grafanaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="effect-underline"
        >
          {title && toTitleCase(title)} <FaExternalLinkAlt size="0.5em" />
        </a>
      </h5>
    </div>
  );
};

export default TitleWithGrafanaLink;
