import React from "react";

function Image({ src }) {
  return (
    <>
      <img
        src={src}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}

export default Image;
