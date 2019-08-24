import JSZip from "jszip";

export const downloadImagesFromURLs = async images => {
  try {
    if (!images) {
      throw new Error("Did not receive any image urls");
    }
    const zip = new JSZip();
    const imgFolder = zip.folder("images");
    await Promise.all(
      images.map(async imgMeta => {
        const { src } = imgMeta;
        const filename = src.replace(/.*\//g, "");
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          // sometimes image file links do not end with img format extensions.
          // use jpeg for them.
          const _fixedFileName = /.*\.(jpg|jpeg|png|gif|svg|tiff|raw|exif|bmp|webp)$/gi.test(
            filename
          )
            ? filename
            : `${filename}.jpg`;
          imgFolder.file(_fixedFileName, blob, { binary: true });
        } catch (error) {
          console.log(`Failed to fetch: ${src}`);
          console.log("promiseError:", error);
        }
      })
    );

    imgFolder
      .generateAsync({ type: "blob" }, function updateCallback(metadata) {
        const percent = metadata.percent.toFixed(2);
        console.log("Download: " + percent + "%");
      })
      .then(
        blob => {
          console.log("blob:", blob);
          const urlOfBlob = URL.createObjectURL(blob);
          function handleDownloadFinish(delta) {
            if (delta.state && delta.state.current === "complete") {
              console.log(`Download ${delta.id} has completed.`);
              URL.revokeObjectURL(urlOfBlob);
            }
          }
          browser.downloads.download({
            url: urlOfBlob,
            filename: "images.zip",
            conflictAction: "uniquify",
          });
          browser.downloads.onChanged.addListener(handleDownloadFinish);
        },
        function(e) {
          console.log("Failed to zip images file: ", e);
        }
      );
  } catch (error) {
    console.log("download error:", error);
  }
};
