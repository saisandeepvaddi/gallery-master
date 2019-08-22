import { common } from "./customImageScripts/common";
import { bing } from "./customImageScripts/bing";
import { google } from "./customImageScripts/google";

export const getUrls = (location = null) => {
  const { origin } = location;

  if (!origin) {
    return common();
  }

  if (/bing/i.test(origin)) {
    return bing();
  } else if (/google/i.test(origin)) {
    return google();
  }

  return common();
};
