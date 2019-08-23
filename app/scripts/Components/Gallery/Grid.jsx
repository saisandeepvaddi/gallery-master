import React from "react";

function Grid({ cols, children }) {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cols}fr)`,
          gridGap: "1em",
          gridAutoFlow: "dense",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Grid;
