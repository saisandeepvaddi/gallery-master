import { common } from "./customImageScripts/common";
import { bing } from "./customImageScripts/bing";

export const getUrls = (location = null) => {
  const { origin } = location;

  if (!origin) {
    return common();
  }

  if (/bing/i.test(origin)) {
    console.log("Bing");

    return bing();
  }

  return common();
};
