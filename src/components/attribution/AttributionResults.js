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

import React, { Component, Fragment } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { FaDownload } from "react-icons/fa";
import numeral from "numeral";
import "./AttributionResults.scss";

export default class AttributionResults extends Component {
  static enrichAttributionData(attributionData) {
    const summary = {
      totalSpanCount: attributionData.reduce(
        (accumulator, service) => accumulator + service.spanCount,
        0
      ),
      totalOperationCount: attributionData.reduce(
        (accumulator, service) => accumulator + service.operationCount,
        0
      ),
      totalSpanSizeBytes: attributionData.reduce(
        (accumulator, service) => accumulator + service.spanSizeBytes,
        0
      ),
    };
    return attributionData.map((attributionDetail) => ({
      ...attributionDetail,
      spanCountPercentage:
        (attributionDetail.spanCount / summary.totalSpanCount) * 100,
      operationCountPercentage:
        (attributionDetail.operationCount / summary.totalOperationCount) * 100,
      spanSizePercentage:
        (attributionDetail.spanSizeBytes / summary.totalSpanSizeBytes) * 100,
    }));
  }

  static serviceNameHeaderFormatter(
    column,
    colIndex,
    { sortElement, filterElement }
  ) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {column.text}
        {sortElement}
        {filterElement}
      </div>
    );
  }

  static generateAdditionalColumns(additionalTags) {
    const additionalColumns = [];

    const tagDefaultFormatString = {
      COUNT: "0.0 a",
      BYTES: "0.0 b",
    };

    if (Object.keys(additionalTags).length > 0) {
      Object.keys(additionalTags).forEach((tagName) => {
        const tag = additionalTags[tagName];
        const tagValueType = tag.valueType;

        additionalColumns.push({
          dataField: `attributedTags.${tagName}`,
          text: tag.tagDisplayName,
          sort: true,
          formatter: (tagName) =>
            tagValueType === "NONE"
              ? tagName
              : numeral(tagName).format(tagDefaultFormatString[tagValueType]),
        });
      });
    }

    return additionalColumns;
  }

  render() {
    const { attributionData } = this.props;
    const attibutorAdditionalTags =
      window.HAYSTACK_CONSOLE_CONFIG &&
      window.HAYSTACK_CONSOLE_CONFIG.attributorAdditionalTags
        ? window.HAYSTACK_CONSOLE_CONFIG.attributorAdditionalTags
        : JSON.parse(process.env.REACT_APP_CONFIG_ATTRIBUTOR_ADDITIONAL_TAGS);

    const additionalColumns =
      attibutorAdditionalTags &&
      AttributionResults.generateAdditionalColumns(attibutorAdditionalTags);

    const CSVExportComponent = (props) => {
      const handleClick = () => {
        props.onExport();
      };
      return (
        <a
          className="csvexport_icon float-right"
          href="#"
          onClick={handleClick}
        >
          <FaDownload size="1.7em" />
        </a>
      );
    };

    const defaultSorted = [
      {
        dataField: "spanCount",
        order: "desc",
      },
    ];

    const columns = [
      {
        dataField: "serviceName",
        text: "Service Name",
        sort: true,
        headerFormatter: AttributionResults.serviceNameHeaderFormatter,
        filter: textFilter(),
      },
      {
        dataField: "operationCount",
        text: "Operation Count",
        sort: true,
        formatter: (operationCount) => numeral(operationCount).format("0.0 a"),
      },
      {
        dataField: "spanCount",
        text: "Span Count",
        sort: true,
        formatter: (spanCount, row) => {
          return (
            <div>{`${numeral(spanCount).format(
              "0.0 a"
            )} ( ${row.spanCountPercentage.toFixed(2)} % )`}</div>
          );
        },
      },
      {
        dataField: "spanSizeBytes",
        text: "Span Size",
        sort: true,
        formatter: (spanSizeBytes, row) => {
          return (
            <div>{`${numeral(spanSizeBytes).format(
              "0.0 b"
            )} ( ${row.spanSizePercentage.toFixed(2)} % )`}</div>
          );
        },
      },
      ...additionalColumns,
    ];

    return (
      <Fragment>
        <ToolkitProvider
          keyField="serviceName"
          data={AttributionResults.enrichAttributionData(attributionData)}
          columns={columns}
          bootstrap4
          exportCSV
        >
          {(props) => (
            <div>
              <CSVExportComponent {...props.csvProps} />
              <BootstrapTable
                {...props.baseProps}
                classes="attributionresults-table"
                headerClasses="attributionresults-table_header"
                bordered={false}
                hover
                defaultSorted={defaultSorted}
                pagination={paginationFactory()}
                filter={filterFactory()}
                noDataIndication="No Services Found"
                ignoreSinglePage
              />
            </div>
          )}
        </ToolkitProvider>
      </Fragment>
    );
  }
}
