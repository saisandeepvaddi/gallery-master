import React from "react";
import ReactDOM from "react-dom";
import { getSlideshowContainer } from "../../contentScripts/page";
import SlideShow from "./SlideShow";

export const stopSlideShow = () => {
  ReactDOM.render(null, getSlideshowContainer());
};

export const startSlideShow = (images, currentIndex = 0) => {
  ReactDOM.render(
    <SlideShow
      images={images}
      stopSlideShow={stopSlideShow}
      currentIndex={currentIndex}
    />,
    getSlideshowContainer()
  );
};
