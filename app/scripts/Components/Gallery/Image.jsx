import React from "react";

function Image({ src, _id }) {
  return (
    <>
      <img
        id={_id}
        alt="Image Here"
        src={"http://placehold.it/500"}
        data-src={src}
        className="lazyload"
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
