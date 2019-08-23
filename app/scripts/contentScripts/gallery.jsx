import React from "react";
import ReactDOM from "react-dom";
import Gallery from "../Components/Gallery/Gallery";
import { getContainer } from "./page";
import ErrorBoundary from "../shared/ErrorBoundary";
import { ImageProvider } from "../shared/ImageStore";

export const startGallery = (images = []) => {
  ReactDOM.render(
    <ErrorBoundary>
      <ImageProvider images={images}>
        <Gallery />
      </ImageProvider>
    </ErrorBoundary>,
    getContainer()
  );
};
