const containerId = "gallery-master-container";
const zoomContainerId = "gallery-master-zoom-container";
const slideshowContainerId = "gallery-master-slideshow-container";

export const isExtensionContainerAttached = () =>
  document.getElementById(containerId) !== null;

export const isZoomContainerAttached = () =>
  document.getElementById(zoomContainerId) !== null;

export const isSlideshowContainerAttached = () =>
  document.getElementById(slideshowContainerId) !== null;

export const injectContainer = () => {
  if (isExtensionContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = containerId;
  el.className = "gallery-master";

  document.body.appendChild(el);
};

export const injectZoomContainer = () => {
  if (isZoomContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = zoomContainerId;
  el.className = "gallery-master";

  document.body.appendChild(el);
};

export const injectSlideshowContainer = () => {
  if (isSlideshowContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = slideshowContainerId;
  el.className = "gallery-master";

  document.body.appendChild(el);
};

export const getContainer = () => {
  if (!isExtensionContainerAttached()) {
    throw new Error("Extension container does not exist on page.");
  }

  return document.getElementById(containerId);
};

export const getPageDetails = () => {
  const { origin, pathname, href } = document.location;
  return { origin, pathname, href };
};

export const getZoomContainer = () => {
  if (!isZoomContainerAttached()) {
    injectZoomContainer();
  }
  return document.getElementById(zoomContainerId);
};

export const getSlideshowContainer = () => {
  if (!isSlideshowContainerAttached()) {
    injectSlideshowContainer();
  }
  return document.getElementById(slideshowContainerId);
};
