import React from "react";

import "./Loading.css";

const Loading = () => {
  return (
    <div class="container">
      <div class="loading-wave">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>
  );
};

export default Loading;
