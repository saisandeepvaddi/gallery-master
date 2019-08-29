export const google = () => {
  try {
    const _links = document.querySelectorAll("a[href*=\"imgurl=\"] > img");
    const links = [..._links];
    const images = links
      .map(link => {
        const {
          parentNode: { href },
          alt,
        } = link;
        const urlIndex = href.indexOf("imgurl=");
        let _url = href.substring(urlIndex + 7, href.indexOf("&", urlIndex));
        let url = _url;

        try {
          url = decodeURIComponent(_url);
        } catch (error) {
          console.log("error:", error);
          url = _url;
        }

        return { src: url, alt };
      })
      .filter(x => !!x.src);
    return images;
  } catch (error) {
    console.log("google error:", error);
    return [];
  }
};
