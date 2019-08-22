import React from "react";
import ReactDOM from "react-dom";
import Gallery from "../Components/Gallery/Gallery";
import { getContainer } from "./page";

export const startGallery = (images = []) => {
  ReactDOM.render(<Gallery images={images} />, getContainer());
};
