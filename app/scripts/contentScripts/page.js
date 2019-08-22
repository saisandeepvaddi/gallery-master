const containerId = "imgextension-container";

export const isExtensionContainerAttached = () =>
  document.getElementById(containerId) !== null;

export const injectContainer = () => {
  if (isExtensionContainerAttached()) {
    return;
  }

  const el = document.createElement("div");
  el.id = containerId;

  document.body.appendChild(el);
};

export const getContainer = () => {
  if (!isExtensionContainerAttached()) {
    throw new Error("Extension container does not exist on page.");
  }

  return document.getElementById(containerId);
};
