import React from "react";

function Info({ children }) {
  return (
    <>
      <div
        className="d-flex justify-center align-center"
        style={{ padding: 100 }}
      >
        {children}
      </div>
    </>
  );
}

export default Info;
