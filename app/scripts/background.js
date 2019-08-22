import { sendMessageToActiveTabContentScript } from "./shared/Messenger";
import { MESSAGE_TYPES } from "./shared/Constants";

browser.browserAction.onClicked.addListener(tab => {
  console.log("Browser Action clicked on Tab:", tab);
  sendMessageToActiveTabContentScript({
    task: MESSAGE_TYPES.SHOW_GALLERY,
  });
});
