import React, { useState } from "react";
import "../guiCanvas.css";
let parameters = {
  n_trees: null,
  criterion: "gini",
  max_depth: null,
  min_samples_split: null,
  max_leaves: null,
  n_features: null,
  oblique: null,
};

export function RFparameters() {
  const [nTrees, setTrees] = useState("");
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSplit] = useState("");
  const [max_leaves, setMaxLeaves] = useState("");
  const [oblique, setOblique] = useState("");

  const handleObliqueChange = (e) => {
    setOblique(e === "" ? null : parseInt(e, 10));
    parameters.oblique = e === "" ? null : parseInt(e, 10);
  };
  const handleNTree = (e) => {
    setTrees(e === "" ? null : parseInt(e, 10));
    parameters.n_trees = e === "" ? null : parseInt(e, 10);
  };
  const handleMinSplit = (e) => {
    setMinSplit(e === "" ? null : parseInt(e, 10));
    parameters.min_samples_split = e === "" ? null : parseInt(e, 10);
  };
  const handleMaxDepth = (e) => {
    setMaxDepth(e === "" ? null : parseInt(e, 10));
    parameters.max_depth = e === "" ? null : parseInt(e, 10);
  };

  const handleCriterion = (e) => {
    setCriterion(e);
    parameters.criterion = e;
  };

  return (
    <form>
      <div>
        <label>Criterion: </label>
        <select
          value={criterion}
          onChange={(e) => handleCriterion(e.target.value)}
        >
          <option value="gini">Gini</option>
          <option value="entropy">Entropy</option>
          <option value="classification_error">Classification Error</option>
        </select>
      </div>
      <div>
        <label>Number of Trees: </label>
        <input
          value={nTrees}
          placeholder="default is none"
          onChange={(e) => handleNTree(e.target.value)}
        />
      </div>
      <div>
        <label>Max Depth: </label>
        <input
          value={max_depth}
          placeholder="default is none"
          onChange={(e) => handleMaxDepth(e.target.value)}
        />
      </div>
      <div>
        <label>Min Samples Splits: </label>
        <input
          value={minSamplesSplit}
          placeholder="default is 2"
          onChange={(e) => handleMinSplit(e.target.value)}
        />
      </div>
      <div>
        <label>Oblique: </label>
        <select
          value={oblique}
          onChange={(e) => handleObliqueChange(e.target.value)}
        >
          <option value="0">Off</option>
          <option value="1">On</option>
        </select>
      </div>
    </form>
  );
}

export const RFpara = () => {
  console.log(parameters);
  return parameters;
};

export default RFparameters;
