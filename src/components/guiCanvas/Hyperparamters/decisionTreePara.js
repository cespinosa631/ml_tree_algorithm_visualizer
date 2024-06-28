import React, { useState } from "react";
//import [parameters] from algort
//parameters = { para1,para2 ,....}
// if name:
// algro.parameters
// # of inputs = # of parameters
// [para1,para2,...]
// para1 = string array
// para1 =  int

// return (form-div-dselect)
let parameters = {
  criterion: "",
  min_samples_split: "",
  max_depth: "",
  n_features: "",
  max_leaves: "",
  oblique: "",
};

export function Dtparameters() {
  const [criterion, setCriterion] = useState("gini");
  const [max_depth, setMaxDepth] = useState("");
  const [minSamplesSplit, setMinSplit] = useState("");
  const [maxLeaf, setMinLeaf] = useState("");
  const [oblique, setOblique] = useState("");

  parameters.criterion = criterion;
  parameters.maxDepth = max_depth;
  parameters.minSamplesSplit = minSamplesSplit;
  parameters.maxLeaf = maxLeaf;
  parameters.oblique = oblique;

  const handleObliqueChange = (e) => {
    setOblique(e === "" ? null : parseInt(e, 10));
    parameters.oblique = e === "" ? null : parseInt(e, 10);
  };
  const handleMaxDepth = (e) => {
    setMaxDepth(e === "" ? null : parseInt(e, 10));
    parameters.max_depth = e === "" ? null : parseInt(e, 10);
  };
  const handleMinSplit = (e) => {
    setMinSplit(e === "" ? null : parseInt(e, 10));
    parameters.min_samples_split = e === "" ? null : parseInt(e, 10);
  };
  const handleMinLeaf = (e) => {
    setMinLeaf(e === "" ? null : parseInt(e, 10));
    parameters.max_leaves = e === "" ? null : parseInt(e, 10);
  };

  const handleCriterion = (e) => {
    setCriterion(e);
    parameters.criterion = e;
  };

  //doselect
  //div
  // seclt
  // remember div just in case

  return (
    <form>
      {/* for args array */}
      {/* {parameters.map((value)=> (<>{typeof(value) === "Array"} ? <doselect(value)><d/>
        <label>{value.name}: </label>
      </>
        <select
          value={value.value}
          onChange={(e) => handleCriterion(e.target.value)}
        >
          <option value="gini">Gini</option>
          <option value="entropy">Entropy</option>
          <option value="classification_error">Classification Error</option>
        </select>
      ))} */}
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
        <label>Max Leafs: </label>
        <input
          value={maxLeaf}
          placeholder="default is 2"
          onChange={(e) => handleMinLeaf(e.target.value)}
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
      <div></div>
    </form>
  );
}

export function dtpara() {
  return parameters;
}

export default Dtparameters;
