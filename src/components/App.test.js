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

import React from "react";
import App from "./App";
import { shallow } from "enzyme";

test("Correctly renders the entire app", () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find("Header")).toHaveLength(1);
  expect(wrapper.find("Stats")).toHaveLength(1);
  expect(wrapper.find("Navbar")).toHaveLength(1);
  expect(wrapper.find("Main")).toHaveLength(1);
});
