import React from "react";
import { Pane, TextInput, Button } from "evergreen-ui";

function OptionsBar({
  minWidth,
  minHeight,
  cols,
  setMinWidth,
  setMinHeight,
  updateImagesWithMinDimensions,
  setCols,
}) {
  return (
    <>
      <Pane display="flex" padding={10} background="tint2">
        <Pane flex={1} alignItems="center" display="flex">
          <span>Columns: </span>
          <TextInput
            type="number"
            placeholder="Columns in Grid"
            min="1"
            max="10"
            value={cols}
            onChange={e => setCols(e.target.value || 2)}
            width="20%"
          />
        </Pane>
        <Pane flex={1} alignItems="center" display="flex">
          <span>Min Width: </span>
          <TextInput
            type="number"
            placeholder="width"
            min="1"
            value={minWidth}
            onChange={e => setMinWidth(e.target.value || 5)}
            width="20%"
          />
          <span style={{ padding: 10 }}></span>
          <span>Min Height: </span>
          <TextInput
            type="number"
            placeholder="height"
            min="1"
            value={minHeight}
            onChange={e => setMinHeight(e.target.value || 5)}
            width="20%"
          />
          <span style={{ padding: 10 }}></span>

          <Button onClick={() => updateImagesWithMinDimensions()}>
            Update
          </Button>
        </Pane>
      </Pane>
    </>
  );
}

export default OptionsBar;
