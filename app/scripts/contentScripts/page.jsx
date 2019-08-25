const containerId = "imgextension-container";
const zoomContainerId = "imgextension-zoom-container";

export const isExtensionContainerAttached = () =>
  document.getElementById(containerId) !== null;

export const isZoomContainerAttached = () =>
  document.getElementById(zoomContainerId) !== null;

export const injectContainer = () => {
  if (isExtensionContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = containerId;

  document.body.appendChild(el);
};

export const injectZoomContainer = () => {
  if (isZoomContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = zoomContainerId;

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