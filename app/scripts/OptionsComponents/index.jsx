import React from "react";
import { useOptions } from "../shared/OptionsStore";

function OptionsPage() {
  const [minWidth, setMinWidth] = React.useState(100);
  const [minHeight, setMinHeight] = React.useState(100);
  const { options, setOption } = useOptions();

  React.useEffect(() => {}, []);

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
