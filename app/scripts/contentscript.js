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
  const srcs = images.map(x => x.src).filter(x => !!x);
  return srcs || [];
};

const createModal = url => {
  const modalEl = document.createElement("div");
  modalEl.id = "imageextensionid";
  modal.className = "modal";
};

getUrls();

browser.runtime.onMessage.addListener(message => {
  console.log("imageextensionmessage:", message);
  if (message.task && message.task === "collect") {
    console.log("imageextensionmessage.task:", message.task);
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }

  if (message.task && message.task === "zoom") {
    console.log("imageextensionmessage.task:", message.task);
    const { url } = message.data;
    console.log("url:", url);
    createModal(url);
    return Promise.resolve({
      srcs: getUrls() || []
    });
  }
});
