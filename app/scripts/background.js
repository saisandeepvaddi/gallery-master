import { sendMessageToActiveTabContentScript } from "./shared/Messenger";
import { MESSAGE_TYPES } from "./shared/Constants";
import { downloadImagesFromURLs } from "./backgroundScripts/download";

browser.browserAction.onClicked.addListener(tab => {
  console.log("Browser Action clicked on Tab:", tab);
  sendMessageToActiveTabContentScript({
    task: MESSAGE_TYPES.SHOW_GALLERY,
  });
});

browser.runtime.onMessage.addListener(async message => {
  if (message.type === MESSAGE_TYPES.DOWNLOAD_IMAGES) {
    await downloadImagesFromURLs(message.images);
  }
});
