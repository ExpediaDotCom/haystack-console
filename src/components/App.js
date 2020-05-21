/*
 * Copyright 2020 Expedia Group
 *
 *       Licensed under the Apache License, Version 2.0 (the 'License');
 *       you may not use this file except in compliance with the License.
 *       You may obtain a copy of the License at
 *
 *           http://www.apache.org/licenses/LICENSE-2.0
 *
 *       Unless required by applicable law or agreed to in writing, software
 *       distributed under the License is distributed on an 'AS IS' BASIS,
 *       WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *       See the License for the specific language governing permissions and
 *       limitations under the License.
 *
 */

import React, { Component } from "react";
import Header from "./common/Header";
import Main from "./Main";
import Stats from "./common/stats/Stats";
import Navbar from "./common/Navbar";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Stats />
        <Navbar />
        <Main />
      </React.Fragment>
    );
  }
}

export default App;
