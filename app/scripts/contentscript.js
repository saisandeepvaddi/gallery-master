import { getUrls } from "./contentScripts/images";
import { startGallery } from "./contentScripts/gallery";
import { MESSAGE_TYPES } from "./shared/Constants";
import { injectContainer, getPageDetails } from "./contentScripts/page";
import "./pinterest";

/**
 * Entrypoint for Content Script
 *
 * @class ContentScript
 */
class ContentScript {
  imageUrls = [];
  messagePort = null;
  listeners = [];

  /**
   * Initializes the tasks of content script.
   * This is the first function to run in content script.
   *
   * @memberof ContentScript
   */
  initialize = () => {
    this.initializeContentScriptListeners();
  };

  /**
   * Initializes ContentScript Message Listeners
   *
   * @memberof ContentScript
   */
  initializeContentScriptListeners = async () => {
    browser.runtime.onMessage.addListener(message => {
      if (!message.task) {
        return Promise.reject("Task not mentioned");
      }

      switch (message.task) {
        case MESSAGE_TYPES.COLLECT_IMAGES: {
          return Promise.resolve({ srcs: this.getImages() });
        }
        case MESSAGE_TYPES.SHOW_GALLERY: {
          this.showGallery();
          return Promise.resolve(true);
        }
        case MESSAGE_TYPES.DOWNLOAD_PROGRESS_UPDATE: {
          const { progress } = message;
          this.updateDownloadProgress(progress);
          return Promise.resolve(true);
        }

        default:
          return Promise.reject("Task did not match any options");
      }
    });
  };

  /**
   * Gets the page location details.
   * This is only origin, pathname, href of document.location
   *
   * @memberof ContentScript
   */
  getLocationDetails = () => {
    const location = getPageDetails();
    this.location = location;
    return location;
  };

  /**
   * Updates progress text on button.
   *
   * @memberof ContentScript
   */

  updateDownloadProgress = progress => {
    const btn = document.getElementById("ext-download-button");
    console.log("progress:", progress);
    if (!progress || Number(progress) >= 100) {
      btn.innerHTML = "Download";
    } else {
      btn.innerHTML = `<b>${progress}%</b>&nbsp;packing`;
    }
  };

  /**
   * Collects the image urls in the active page.
   *
   * @memberof ContentScript
   */
  getImages = async () => {
    try {
      const location = this.getLocationDetails();
      const urls = await getUrls(location);
      this.imageUrls = urls;
      return urls;
    } catch (error) {
      this.imageUrls = [];
      console.log("error:", error);
    }
  };

  /**
   * Starts the gallery with the collected images.
   *
   * @memberof ContentScript
   */
  showGallery = async () => {
    // Injects extension's DOM element into the page.
    // This element will the root element for extension's content script UI.
    injectContainer();

    const images = await this.getImages();

    // Attach container again if someone removed container again.
    startGallery(images);
  };
}

const contentScript = new ContentScript();
contentScript.initialize();
