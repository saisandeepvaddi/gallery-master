import { sendMessageToActiveTabContentScript } from "~messenger";

export {};

let images: Set<string> = new Set();
chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed");
  images = new Set();
});

console.log("In back BG: ", Math.round(0 + Math.random() * 100));

chrome.webRequest.onCompleted.addListener(
  function (details) {
    images.add(details.url);
  },
  {
    types: ["image", "media"],
    urls: ["https://*/*"],
  }
);

chrome.action.onClicked.addListener(() => {
  console.log("Tab details");
  console.log(Array.from(images));
  sendMessageToActiveTabContentScript({
    task: "show-gallery",
    data: Array.from(images),
  });
});
