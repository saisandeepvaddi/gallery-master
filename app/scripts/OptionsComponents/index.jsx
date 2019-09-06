import React from "react";

function OptionsPage() {
  return (
    <>
      <p>Options</p>
      <div className="d-flex flex-column justify-center align-center">
        <div className="d-flex align-center">
          <label>
            Default Min Width:
            <input type="number" min="1" step="30" />
          </label>
        </div>
      </div>
    </>
  );
}

export default OptionsPage;
