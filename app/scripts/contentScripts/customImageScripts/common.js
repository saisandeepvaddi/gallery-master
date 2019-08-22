export const common = () => {
  const _imgs = document.getElementsByTagName("img");
  const _images = document.getElementsByTagName("image");

  const images = [..._imgs, _images];
  const srcs = images
    .map(x => {
      const { src, srcset } = x;
      if (!srcset || !srcset.length) {
        return src;
      }

      const baseLinks = srcset.split(",").map(x => x.trim());
      let currentDim = 0;
      let biggerImageUrl = src;

      baseLinks.forEach(link => {
        const [url, dim] = link.split(" ");
        const dimension = dim.replace(/[wx]$/g, "");
        if (Number(dimension) > currentDim) {
          currentDim = Number(dimension);
          biggerImageUrl = url;
        }
      });
      return biggerImageUrl || src;
    })
    .filter(x => !!x);
  return srcs || [];
};
