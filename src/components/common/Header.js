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
import { Link } from "react-router-dom";
import HaystackLogo from "../../images/logo-white.png";
import "./Header.scss";

const Header = () => (
  <nav className="navbar header navbar-dark bg-primary justify-content-center sticky-top">
    <img src={HaystackLogo} alt="Haystack" height="45" width="45" />
    <Link className="navbar-brand text-center" to="/">
      <div className="clearfix">
        <div className="h2 float-left mr-2">Haystack</div>
        <div className="h3 sub-title float-right mt-1">Console</div>
      </div>
    </Link>
  </nav>
);

export default Header;
