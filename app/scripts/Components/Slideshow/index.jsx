import React from "react";
import ReactDOM from "react-dom";
import { getSlideshowContainer } from "../../contentScripts/page";
import SlideShow from "./SlideShow";
import { ThemeProvider } from "@chakra-ui/core";

export const stopSlideShow = () => {
  ReactDOM.render(null, getSlideshowContainer());
};

export const startSlideShow = (images, currentIndex = 0) => {
  ReactDOM.render(
    <ThemeProvider>
      <SlideShow
        images={images}
        stopSlideShow={stopSlideShow}
        currentIndex={currentIndex}
      />
    </ThemeProvider>,
    getSlideshowContainer()
  );
};
