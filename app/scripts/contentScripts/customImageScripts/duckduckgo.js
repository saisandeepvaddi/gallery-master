export const duckduckgo = () => {
  try {
    const _links = document.querySelectorAll("img");
    const links = [..._links];
    const images = links
      .map(link => {
        const src = link.src;
        const dataSrc = link.dataset.src;
        const _temp = dataSrc ? dataSrc : src;
        let url = null;
        if (_temp.startsWith("/assets")) {
          url = "https://duckduckgo.com" + _temp;
        } else if (_temp.startsWith("//proxy")) {
          url = "https:" + _temp;
        }

        return url;
      })
      .filter(x => !!x);
    console.log("images:", images);
    return images;
  } catch (error) {
    console.log("duckduckgo error:", error);
    return [];
  }
};
