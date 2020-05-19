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
import { Route, Switch } from "react-router-dom";
import Health from "./health/Health";
import Management from "./management/Management";
import Attribution from "./attribution/Attribution";
import "./Main.scss";

const Main = () => (
  <div className="main">
    <Route>
      <Switch>
        <Route path="/management" component={Management} />
        <Route path="/health" component={Health} />
        <Route path="/" component={Attribution} />
      </Switch>
    </Route>
  </div>
);

export default Main;
