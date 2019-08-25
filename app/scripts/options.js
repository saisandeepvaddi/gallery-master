import React from "react";
import ReactDOM from "react-dom";
import OptionsPage from "./OptionsComponents";
import { OptionsProvider } from "./shared/OptionsStore";

ReactDOM.render(
  <OptionsProvider>
    <OptionsPage />
  </OptionsProvider>,

  document.getElementById("root")
);
