import { common } from "./customImageScripts/common";
import { bing } from "./customImageScripts/bing";
import { google } from "./customImageScripts/google";
import { duckduckgo } from "./customImageScripts/duckduckgo";

export const getUrls = (location = null) => {
  const { origin } = location;

  if (!origin) {
    return common();
  }

  if (/bing/i.test(origin)) {
    return bing();
  } else if (/google/i.test(origin)) {
    return google();
  } else if (/duckduckgo/i.test(origin)) {
    return duckduckgo();
  }

  return common();
};
