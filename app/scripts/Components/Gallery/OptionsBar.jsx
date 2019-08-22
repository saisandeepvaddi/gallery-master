import React from "react";
import { Pane, TextInput, Button } from "evergreen-ui";

function OptionsBar({
  minWidth,
  minHeight,
  cols,
  setMinWidth,
  setMinHeight,
  updateImages,
  setCols,
}) {
  return (
    <>
      <Pane display="flex" padding={2} background="tint2" borderRadius={3}>
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
          <span>Min Height</span>
          <TextInput
            type="number"
            placeholder="height"
            min="1"
            value={minHeight}
            onChange={e => setMinHeight(e.target.value || 5)}
            width="20%"
          />
          <Button onClick={() => updateImages()}>
            Fetch with new dimensions
          </Button>
        </Pane>
      </Pane>
    </>
  );
}

export default OptionsBar;
