import { sendMessageToActiveTabContentScript } from "~messenger";

export {};

let images: Set<{ tabId; url }> = new Set();
chrome.runtime.onInstalled.addListener(() => {
  console.log("Runtime Installed");
  images = new Set();
});

console.clear();
console.log("In back BG: ", Math.round(0 + Math.random() * 100));

// chrome.webRequest.onCompleted.addListener(
//   function ({ tabId, url }) {
//     images.add({ tabId, url });
//   },
//   {
//     types: ["image", "media"],
//     urls: ["<all_urls>"],
//   }
// );

chrome.action.onClicked.addListener((tab) => {
  console.log("Tab details", tab);
  // const activeTabImages = Array.from(images)
  //   .filter((item) => item.tabId === tab.id)
  //   .map((item) => item.url);

  sendMessageToActiveTabContentScript({
    task: "show-gallery",
    data: [],
  });
});
