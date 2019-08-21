const modalHtml = `
  <button class="trigger">Click here to trigger the modal!</button>
    <div class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <div id="image-container">
            </div>
        </div>
    </div>
`;

const getUrls = () => {
  const _imgs = document.getElementsByTagName("img");
  const _images = document.getElementsByTagName("image");

  const images = [..._imgs, _images];
  const srcs = images
    .map(x => {
      const { src, srcset } = x;
      if (!srcset || !srcset.length) {
        return src;
      }

      const urls = {};

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
      console.log("biggerImageUrl:", biggerImageUrl);
      console.log("src:", src);
      return biggerImageUrl || src;
    })
    .filter(x => !!x);
  return srcs || [];
};

const createModal = url => {
  const modalEl = document.createElement("div");
  modalEl.id = "imageextensionid";
  modal.className = "modal";
};

getUrls();

browser.runtime.onMessage.addListener(message => {
  if (message.task && message.task === "collect") {
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }

  if (message.task && message.task === "zoom") {
    const { url } = message.data;
    createModal(url);
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }
});
