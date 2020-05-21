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

import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
  ButtonGroup,
} from "reactstrap";
import Subsystems from "./subsystems/Subsystems";
import "./Health.scss";
import Infrastructure from "./infrastructure/Infrastructure";

const Health = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [lookback, setLookBack] = useState(60);

  const lookbackPresets = [
    { value: 60, display: "60m" },
    { value: 120, display: "2h" },
    { value: 240, display: "4h" },
    { value: 720, display: "12h" },
    { value: 1440, display: "24h" },
  ];

  return (
    <Container>
      <div className="health text-dark rounded p-4">
        <div className="clearfix">
          <div className="float-left">
            <h2>Health</h2>
          </div>
          <ButtonGroup className="float-right" size="sm">
            <Button color="primary">Last </Button>
            {lookbackPresets.map((preset) => (
              <Button
                outline
                color="primary"
                active={lookback === preset.value}
                onClick={() => setLookBack(preset.value)}
              >
                {preset.display}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <Nav tabs className="pt-2">
          <NavItem>
            <NavLink
              className={activeTab === "1" ? "active" : ""}
              onClick={() => {
                setActiveTab("1");
              }}
            >
              Subsystems
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "2" ? "active" : ""}
              onClick={() => {
                setActiveTab("2");
              }}
            >
              Infrastructure
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Subsystems lookback={lookback} />
          </TabPane>
          <TabPane tabId="2">
            <Infrastructure lookback={lookback} />
          </TabPane>
        </TabContent>
      </div>
    </Container>
  );
};

export default Health;
