import React from "react";
import ReactDOM from "react-dom";
import Gallery from "../Components/Gallery/Gallery";
import { getContainer } from "./page";
import ErrorBoundary from "../shared/ErrorBoundary";
import { ImageProvider } from "../shared/ImageStore";
import { OptionsProvider } from "../shared/OptionsStore";
import { ThemeProvider } from "@chakra-ui/core";

export const startGallery = (images = []) => {
  ReactDOM.render(
    <ThemeProvider>
      <ErrorBoundary>
        <OptionsProvider>
          <ImageProvider images={images}>
            <Gallery />
          </ImageProvider>
        </OptionsProvider>
      </ErrorBoundary>
    </ThemeProvider>,
    getContainer()
  );
};
