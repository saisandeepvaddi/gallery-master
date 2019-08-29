import React from "react";
import { useImages } from "../../shared/ImageStore";
import { startZoom } from "../Zoom";
import { Button } from "evergreen-ui";

function Image({ imgMeta }) {
  const { selectedImages, setSelectedImages } = useImages();
  const { _id, src, alt } = imgMeta;
  const [showPinterest, setShowPinterest] = React.useState(false);

  const isThisImageSelected = !!selectedImages.find(x => x._id === _id);

  const handleClick = e => {
    e.preventDefault();
    console.log("pin: ", window.window);

    const isAlreadyInSelectedImages = isThisImageSelected;
    if (!isAlreadyInSelectedImages) {
      const thisImageAddedArray = [...selectedImages, { ...imgMeta }];
      setSelectedImages(thisImageAddedArray);
    } else {
      const thisImageRemovedArray = [...selectedImages].filter(
        x => x._id !== _id
      );
      setSelectedImages(thisImageRemovedArray);
    }
  };

  const handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    startZoom(imgMeta);
  };

  const handleMouseEnter = () => {
    setShowPinterest(true);
  };

  const handleMouseLeave = () => {
    setShowPinterest(false);
  };

  const handlePinSave = e => {
    e.preventDefault();
    try {
      window.PinUtils.pinOne({
        media: src,
        description: alt || "",
      });
    } catch (error) {
      console.log("pinterest error:", error);
    }
  };

  return (
    <>
      <div
        className="p-relative h-100 w-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showPinterest ? (
          <div className="p-absolute" style={{ top: 10, right: 10 }}>
            <Button
              onClick={handlePinSave}
              style={{ background: "#E60023", color: "white" }}
            >
              Pinterest
            </Button>
          </div>
        ) : null}
        <img
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          id={_id}
          alt={alt || "Image Here"}
          src={"http://placehold.it/500"}
          data-src={src}
          className="lazyload"
          style={{
            border: isThisImageSelected ? "3px solid #407cca" : "none",
            objectFit: "cover",
            width: "100%",
            height: "100%",
            opacity: 1,
          }}
        />
      </div>
    </>
  );
}

export default Image;
