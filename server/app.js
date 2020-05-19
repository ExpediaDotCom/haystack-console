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

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const compression = require("compression");
const app = express();
const axios = require("axios");
const config = require("../server/config/config");
const fs = require("fs");

axios.defaults.timeout = config.upstreamTimeout;
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../build"), { index: false }));
app.use(express.urlencoded({ extended: false }));

// API ROUTING
const attributionApi = require("./routes/attributionApi");
const monitoringApi = require("./routes/healthApi");

const apis = [attributionApi, monitoringApi];

app.use("/api", ...apis);

app.get("/*", (req, res) => {
  var indexHtml = fs.readFileSync(
    path.join(__dirname, "../build", "index.html")
  );

  //DO NOT STORE ANY SECRETS WITH HAYSTACK_CONSOLE_CONFIG
  res.send(
    indexHtml
      .toString()
      .replace("__HAYSTACK_CONSOLE_CONFIG__", JSON.stringify(config))
  );
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  next(err);
});

module.exports = app;
