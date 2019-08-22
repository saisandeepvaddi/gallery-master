import React from "react";
import ReactDOM from "react-dom";
import Gallery from "../Components/Gallery/Gallery";
import { getContainer } from "./page";
import ErrorBoundary from "../shared/ErrorBoundary";

export const startGallery = (images = []) => {
  ReactDOM.render(
    <ErrorBoundary>
      <Gallery images={images} />
    </ErrorBoundary>,
    getContainer()
  );
};
