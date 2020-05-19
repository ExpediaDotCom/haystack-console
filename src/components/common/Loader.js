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
import "./Loader.scss";
import ContentLoader from "react-content-loader";

const Loader = ({ type, className }) => {
  if (type === "line-scale")
    return (
      <div className="loader__line-scale">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  else if (type === "ellipsis")
    return (
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  else if (type === "table")
    return (
      <ContentLoader
        speed={2}
        viewBox="0 0 1110 550"
        backgroundColor="#eaeced"
        foregroundColor="#ffffff"
        preserveAspectRatio="none"
      >
        <rect x="51" y="45" rx="3" ry="3" width="1000" height="17" />

        <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
        <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
        <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="155" rx="3" ry="3" width="991" height="2" />

        <rect x="104" y="113" rx="3" ry="3" width="141" height="15" />
        <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
        <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="155" rx="3" ry="3" width="991" height="2" />

        <rect x="104" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
        <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="114" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="155" rx="3" ry="3" width="991" height="2" />

        <rect x="105" y="175" rx="3" ry="3" width="141" height="15" />
        <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
        <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="175" rx="3" ry="3" width="141" height="15" />
        <rect x="56" y="216" rx="3" ry="3" width="991" height="2" />

        <rect x="106" y="233" rx="3" ry="3" width="141" height="15" />
        <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
        <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="233" rx="3" ry="3" width="141" height="15" />
        <rect x="57" y="274" rx="3" ry="3" width="991" height="2" />

        <rect x="107" y="294" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="294" rx="3" ry="3" width="141" height="15" />
        <rect x="58" y="335" rx="3" ry="3" width="991" height="2" />

        <rect x="106" y="354" rx="3" ry="3" width="141" height="15" />
        <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
        <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="354" rx="3" ry="3" width="141" height="15" />
        <rect x="57" y="395" rx="3" ry="3" width="991" height="2" />

        <rect x="107" y="415" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
        <rect x="882" y="415" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="453" rx="3" ry="3" width="991" height="2" />

        {/* vertical lines */}
        <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
        <rect x="1050" y="49" rx="3" ry="3" width="2" height="465" />

        <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
        <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
        <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
        <rect x="880" y="475" rx="3" ry="3" width="141" height="15" />
        <rect x="55" y="513" rx="3" ry="3" width="991" height="2" />

        <rect x="52" y="80" rx="3" ry="3" width="1000" height="17" />

        <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
        <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
        <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
        <rect x="782" y="56" rx="3" ry="3" width="120" height="33" />
        <rect x="990" y="54" rx="3" ry="3" width="60" height="33" />
      </ContentLoader>
    );
  return (
    <div className="loader">
      <div className="loader-inner loader-one" />
      <div className="loader-inner loader-two" />
      <div className="loader-inner loader-three" />
    </div>
  );
};

export default Loader;
