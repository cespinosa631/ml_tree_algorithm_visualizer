import * as tf from "@tensorflow/tfjs";
import { setBackend } from "scikitjs";
import { DecisionTreeClassifier } from "./decisionTree.js";
import { RandomForest } from "./randomForest.js";
setBackend(tf);
export function train(x, y, para, name) {
  if (name === "Decision Tree") {
    const model = new DecisionTreeClassifier(para);
    model.fit(x, y);
    return model;
  } else {
    const model = new RandomForest(para);
    model.fit(x, y);
    return model;
  }
}

export function predictDataset(dataset, model) {
  try {
    return model.predict(dataset);
  } catch (error) {
    console.error("ERROR: model has no predict method", error);
    // Handle the error appropriately, e.g., display an error message to the user
  }
}
