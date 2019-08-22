export const bing = () => {
  try {
    const _links = document.querySelectorAll("a[m*='murl']");
    const links = [..._links];
    const images = links
      .map(link => {
        const m = link.getAttribute("m");
        // eslint-disable-next-line no-useless-escape
        const cleanedM = m.replace(/([{|,])([a-zA-Z0-9]+)\:/g, "$1\"$2\":");
        const json = JSON.parse(cleanedM);
        const url = json.murl;
        return url;
      })
      .filter(x => !!x);
    return images;
  } catch (error) {
    console.log("bing error:", error);
    return [];
  }
};
