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
import { Container } from "reactstrap";
import "./Attribution.scss";
import AttributionResults from "./AttributionResults";
import Loader from "../common/Loader";
import useFetch from "../utils/useFetch";
import Error from "../common/error";

const Attribution = () => {
  const span = 1000 * 60 * 5;
  const date = new Date(); //or use any other date
  const to =
    new Date(Math.round(date.getTime() / span) * span).getTime() - span;
  const from = to - 24 * 60 * 60 * 1000;

  const attributionDataRequest = useFetch(
    `/api/attribution/cluster?from=${from}&to=${to}`,
    []
  );
  const { error, isLoading, response } = attributionDataRequest;

  return (
    <Container>
      <div className="attribution text-dark rounded p-4">
        <h2>Attribution</h2>
        {error && (
          <Error
            errorMessage={`Satus Code : ${error.response.status}, Please try again later `}
          />
        )}
        {isLoading && <Loader type="table" />}
        {response && (
          <AttributionResults
            attributionData={attributionDataRequest.response}
          />
        )}
      </div>
    </Container>
  );
};

export default Attribution;
