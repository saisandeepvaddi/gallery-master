import { sendMessageToActiveTabContentScript } from "./shared/Messenger";

browser.browserAction.onClicked.addListener(tab => {
  console.log("Clicking");

  sendMessageToActiveTabContentScript({
    task: "show_gallery"
  });
});
