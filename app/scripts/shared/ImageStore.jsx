import React from "react";

const ImageContext = React.createContext({});

const ImageProvider = props => {
  const [images, setImages] = React.useState(props.images || []);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [downloadProgress, setDownloadProgress] = React.useState(-1);

  const value = React.useMemo(
    () => ({
      images,
      setImages,
      selectedImages,
      setSelectedImages,
      downloadProgress,
      setDownloadProgress,
    }),
    [
      images,
      setImages,
      selectedImages,
      setSelectedImages,
      downloadProgress,
      setDownloadProgress,
    ]
  );

  return (
    <ImageContext.Provider value={value}>
      {props.children}
    </ImageContext.Provider>
  );
};

function useImages() {
  const context = React.useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used inside ImageProvider");
  }

  return context;
}

export { ImageProvider, useImages };
