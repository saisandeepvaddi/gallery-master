import React from "react";
import { Pane, TextInput, Button } from "evergreen-ui";
import { useImages } from "../../shared/ImageStore";
import { downloadImages } from "../../shared/utilities";
import { useOptions } from "../../shared/OptionsStore";
// import { startSlideShow } from "../Slideshow";

function OptionsBar({
  minWidth,
  minHeight,
  cols,
  setMinWidth,
  setMinHeight,
  updateImagesWithMinDimensions,
  setCols,
  loading,
  loadingTime,
  setLoadingTime,
  imagesMeta,
}) {
  const { selectedImages, setSelectedImages } = useImages();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [disableDownload, setDisableDownload] = React.useState(false);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const { options } = useOptions();

  // React.useEffect(() => {
  //   const { cols: optionsCols } = options;

  //   if (optionsCols && optionsCols !== cols) {
  //     setCols(optionsCols);
  //   }

  //   console.log("options: ", options);
  // }, [options]);

  React.useEffect(() => {
    if (!options) {
      return;
    }

    setMinWidth(options.minWidth);
    setMinHeight(options.minHeight);
    setCols(options.cols);
  }, [options]);

  const disableDownloadButton = () => {
    const isDownloadDisabled =
      !selectedImages || selectedImages.length === 0 || isDownloading;
    setDisableDownload(isDownloadDisabled);
  };

  React.useEffect(() => {
    disableDownloadButton();
  }, [selectedImages, isDownloading]);

  React.useEffect(() => {
    if (imagesMeta.length === selectedImages.length && imagesMeta.length > 0) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedImages]);

  const downloadSelectedImages = async () => {
    try {
      setIsDownloading(true);
      await downloadImages(selectedImages);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.log("error:", error);
    }
  };

  const selectAllImages = () => {
    setSelectedImages(imagesMeta);
  };

  const unselectAllImages = () => {
    setSelectedImages([]);
  };

  const handleSelectAllButton = e => {
    e.preventDefault();
    if (isAllSelected) {
      unselectAllImages();
    } else {
      selectAllImages();
    }
  };

  const updateImages = e => {
    e.preventDefault();
    updateImagesWithMinDimensions();
  };
  return (
    <>
      <Pane display="flex" padding={10} background="tint2">
        <Pane alignItems="center" display="flex">
          <span>Columns: </span>
          <input
            type="range"
            placeholder="Columns in Grid"
            min="1"
            max="10"
            value={cols}
            onChange={e => {
              setCols(e.target.value || 4);
            }}
            style={{ maxWidth: 200 }}
          />
          <span style={{ padding: 10 }}></span>
          <span style={{ width: 100 }}>
            {imagesMeta.length || 0} images found
          </span>
          {/* <Button
            className="truncate"
            disabled={imagesMeta.length === 0}
            onClick={e => {
              e.preventDefault();
              startSlideShow(imagesMeta);
            }}
          >
            Slideshow
          </Button> */}
        </Pane>
        <Pane
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          display="flex"
        >
          <form onSubmit={updateImages}>
            <span>Max Time: </span>
            <TextInput
              type="number"
              placeholder="loading time"
              min="1"
              step="1"
              value={loadingTime || 1}
              onChange={e => setLoadingTime(Number(e.target.value) || 1)}
              width={100}
            />
            <span style={{ padding: 10 }}></span>
            <span title="Minimum Width of Images to show">W: </span>
            <TextInput
              type="number"
              placeholder="width"
              min="1"
              step="10"
              value={minWidth}
              onChange={e => setMinWidth(Number(e.target.value) || 5)}
              width={80}
            />
            <span style={{ padding: 10 }}></span>
            <span title="Minimum Height of Images to show">H: </span>
            <TextInput
              type="number"
              placeholder="height"
              min="1"
              step="10"
              value={minHeight}
              onChange={e => setMinHeight(Number(e.target.value) || 5)}
              width={80}
            />
            <span style={{ padding: 10 }}></span>

            <Button
              className="truncate"
              type="submit"
              onClick={updateImages}
              disabled={loading}
            >
              Update
            </Button>
          </form>
          <span style={{ padding: 10 }}></span>
          <Button
            className="truncate"
            appearance={"minimal"}
            iconBefore="small-tick"
            onClick={handleSelectAllButton}
            disabled={loading || !imagesMeta || imagesMeta.length === 0}
          >
            {isAllSelected ? "Unselect All" : "Select All"}
          </Button>
          <span style={{ padding: 10 }}></span>
          <span title="Ctrl + click to select image">
            <Button
              className="truncate"
              appearance={disableDownload ? "default" : "primary"}
              iconBefore="download"
              onClick={downloadSelectedImages}
              disabled={disableDownload}
              id="ext-download-button"
            >
              {disableDownload ? "Select images to download" : "Download"}
            </Button>
          </span>
        </Pane>
      </Pane>
    </>
  );
}

export default OptionsBar;
