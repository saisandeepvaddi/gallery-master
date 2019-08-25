import React from "react";
import ReactDOM from "react-dom";
import Gallery from "../Components/Gallery/Gallery";
import { getContainer } from "./page";
import ErrorBoundary from "../shared/ErrorBoundary";
import { ImageProvider } from "../shared/ImageStore";
import { OptionsProvider } from "../shared/OptionsStore";

export const startGallery = (images = []) => {
  ReactDOM.render(
    <ErrorBoundary>
      <OptionsProvider>
        <ImageProvider images={images}>
          <Gallery />
        </ImageProvider>
      </OptionsProvider>
    </ErrorBoundary>,
    getContainer()
  );
};
