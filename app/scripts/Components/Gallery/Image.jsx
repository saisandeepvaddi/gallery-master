import React from "react";
import { useImages } from "../../shared/ImageStore";
import { Button } from "evergreen-ui";
import { startSlideShow } from "../Slideshow";
import { getPlaceholderImage } from "../../contentScripts/images";

const placeholderImage = getPlaceholderImage();

function Image({ imgMeta, ctrlPressed, allImagesMeta, currentIndex }) {
  const { selectedImages, setSelectedImages } = useImages();
  const { _id, src, alt } = imgMeta;
  const [mouseEntered, setMouseEntered] = React.useState(false);

  const isThisImageSelected = !!selectedImages.find(x => x._id === _id);

  const selectImage = () => {
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

  const handleClick = e => {
    e.preventDefault();
    if (e.ctrlKey) {
      selectImage();
      return;
    } else {
      startSlideShow(allImagesMeta, currentIndex);
    }
  };

  const handleDoubleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseEnter = () => {
    setMouseEntered(true);
  };

  const handleMouseLeave = () => {
    setMouseEntered(false);
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
        {mouseEntered ? (
          <div
            className="p-absolute"
            style={{ top: 10, right: 10, opacity: 1, zIndex: 99 }}
          >
            <Button
              onClick={handlePinSave}
              style={{ background: "#E60023", color: "white" }}
              title="Add image to your Pinterest account"
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
          src={placeholderImage}
          data-src={src}
          className="lazyload gallery-image"
          style={{
            border: isThisImageSelected ? "3px solid #407cca" : "none",
            objectFit: "cover",
            width: "100%",
            height: "100%",
            opacity: mouseEntered ? 0.7 : 1,
            cursor: ctrlPressed ? "grab" : "zoom-in",
          }}
        />
      </div>
    </>
  );
}

export default Image;
