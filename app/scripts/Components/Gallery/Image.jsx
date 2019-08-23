import React from "react";
import { useImages } from "../../shared/ImageStore";

function Image({ imgMeta }) {
  const { selectedImages, setSelectedImages } = useImages();
  const { _id, src } = imgMeta;

  const isThisImageSelected = !!selectedImages.find(x => x._id === _id);

  const handleClick = e => {
    e.preventDefault();

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

  return (
    <>
      <img
        onClick={handleClick}
        id={_id}
        alt="Image Here"
        src={"http://placehold.it/500"}
        data-src={src}
        className="lazyload"
        style={{
          border: isThisImageSelected ? "3px solid #407cca" : "none",
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}

export default Image;
