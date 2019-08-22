import React from "react";
import ReactDOM from "react-dom";
// import { getDimensions, getPartialResults } from "../../shared/utilities";
import { Dialog } from "evergreen-ui";
import { getContainer } from "../../contentScripts/page";
import Image from "./Image";
import Grid from "./Grid";
import OptionsBar from "./OptionsBar";

// const getImagesAbove = async ({ urls, minHeight, minWidth }) => {
//   try {
//     const imgDimensions = urls.map(getDimensions);
//     const imgMeta = await getPartialResults(imgDimensions, {
//       time: 5000,
//       filter: true,
//     });
//     const filteredImageUrls = imgMeta
//       .filter(meta => {
//         const { height, width } = meta;
//         if (!height || !width) {
//           return false;
//         }
//         return height >= minHeight && width >= minWidth;
//       })
//       .map(x => x.url);

//     return filteredImageUrls;
//   } catch (error) {
//     console.log("getImagesAbove error: ", error);
//   }
// };

function Gallery({ images }) {
  const [srcs, setSrcs] = React.useState([]);
  const [cols, setCols] = React.useState(4);
  const [minWidth, setMinWidth] = React.useState(100);
  // const [maxWidth, setMaxWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(100);
  // const [maxHeight, setMaxHeight] = React.useState<OptionsBa

  const [loading, setLoading] = React.useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = React.useState(false);

  const hideContainer = () => {
    setShowGalleryDialog(false);
    ReactDOM.render(<React.Fragment />, getContainer());
  };

  const updateImages = async (urls = []) => {
    console.log("urls:", urls);
    if (!urls || urls.length === 0) {
      setLoading(false);
      setSrcs([]);
    }
    try {
      setLoading(true);
      const filteredImageUrls = urls;
      console.log("filteredImageUrls:", filteredImageUrls);
      setLoading(false);
      setSrcs(filteredImageUrls);
    } catch (error) {
      console.error(error.message);
      setSrcs([]);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setShowGalleryDialog(true);
  }, []);

  React.useEffect(() => {
    updateImages(images || []);
  }, [images]);

  return (
    <>
      <Dialog
        isShown={showGalleryDialog}
        title="Gallery"
        width="80vw"
        hasFooter={false}
        onCloseComplete={() => hideContainer()}
      >
        <OptionsBar
          minWidth={minWidth}
          minHeight={minHeight}
          cols={cols}
          setCols={setCols}
          setMinWidth={setMinWidth}
          setMinHeight={setMinHeight}
          updateImages={updateImages}
        />
        {loading ? "Loading" : ""}
        <Grid cols={cols}>
          {(srcs || []).map((src, i) => {
            return (
              <span key={i}>
                <Image src={src} />
              </span>
            );
          })}
        </Grid>
      </Dialog>
    </>
  );
}

export default Gallery;
