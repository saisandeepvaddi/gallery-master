import React from "react";
import ReactDOM from "react-dom";
import { getZoomContainer } from "../../contentScripts/page";
import ZoomHome from "./ZoomHome";

export const stopZoom = () => {
  ReactDOM.render(null, getZoomContainer());
};

export const startZoom = image => {
  ReactDOM.render(
    <ZoomHome image={image} stopZoom={stopZoom} />,
    getZoomContainer()
  );
};
