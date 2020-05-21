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
import PropTypes from "prop-types";
import { ReactComponent as ErrorImg } from "../../images/error_img.svg";
import "./error.scss";

const Error = ({ errorMessage }) => (
  <section className="error-container text-center">
    <div className="error-message_text">
      <ErrorImg height="200px" width="350px" />
      <h5 className="mt-4">{"Oops! Something went wrong"}</h5>
      <p>{errorMessage}</p>
    </div>
  </section>
);

Error.defaultProps = {
  errorMessage: "Please try again later",
};

Error.propTypes = {
  errorMessage: PropTypes.string,
};

export default Error;
