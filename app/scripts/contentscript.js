import { getUrls } from "./contentScripts/images";
import { startGallery } from "./contentScripts/gallery";
import { MESSAGE_TYPES } from "./shared/Constants";
import { injectContainer, getPageDetails } from "./contentScripts/page";

/**
 * Entrypoint for Content Script
 *
 * @class ContentScript
 */
class ContentScript {
  imageUrls = [];

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
          return Promise.resolve({ srcs: this.getImageUrls() });
        }
        case MESSAGE_TYPES.SHOW_GALLERY: {
          this.showGallery();
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
   * Collects the image urls in the active page.
   *
   * @memberof ContentScript
   */
  getImageUrls = async () => {
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

    const imageUrls = await this.getImageUrls();

    // Attach container again if someone removed container again.
    startGallery(imageUrls);
  };
}

const contentScript = new ContentScript();
contentScript.initialize();
