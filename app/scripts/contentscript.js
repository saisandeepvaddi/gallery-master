import React from "react";
import ReactDOM from "react-dom";
import Gallery from "./Components/Gallery";
import { injectContainer, getContainer } from "./shared/utilities";

const isBing =
  document.location.href.test(/(bing.com)/i) &&
  document.location.pathname.test(/images/i);

const getUrls = () => {
  const _imgs = document.getElementsByTagName("img");
  const _images = document.getElementsByTagName("image");

  const images = [..._imgs, _images];
  const srcs = images
    .map(x => {
      const { src, srcset } = x;
      if (!srcset || !srcset.length) {
        return src;
      }

      const urls = {};

      const baseLinks = srcset.split(",").map(x => x.trim());
      let currentDim = 0;
      let biggerImageUrl = src;

      baseLinks.forEach(link => {
        const [url, dim] = link.split(" ");
        const dimension = dim.replace(/[wx]$/g, "");
        if (Number(dimension) > currentDim) {
          currentDim = Number(dimension);
          biggerImageUrl = url;
        }
      });
      console.log("biggerImageUrl:", biggerImageUrl);
      console.log("src:", src);
      return biggerImageUrl || src;
    })
    .filter(x => !!x);
  return srcs || [];
};

const createModal = url => {
  injectContainer();

  const images = getUrls();

  ReactDOM.render(<Gallery images={images} />, getContainer());
};

getUrls();

browser.runtime.onMessage.addListener(message => {
  if (message.task && message.task === "collect") {
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }

  if (message.task && message.task === "show_gallery") {
    createModal();
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }
});
