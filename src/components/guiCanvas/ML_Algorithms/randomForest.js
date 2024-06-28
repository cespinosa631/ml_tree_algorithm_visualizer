/*
RANDOM FOREST IMPLEMENTATION (FROM SCRATCH)
*/
import { DecisionTreeClassifier } from "./decisionTree.js";

// this file is intended to run a random forest algorithm
export class RandomForest {
  constructor({
    n_trees = 1,
    criterion,
    max_depth,
    min_samples_split,
    max_leaves,
    n_features,
    oblique,
  }) {
    this.n_trees = n_trees;
    this.criterion = criterion;
    this.max_depth = max_depth;
    this.min_samples_split = min_samples_split;
    this.max_leaves = max_leaves;
    this.n_features = n_features;
    this.trees = []; //keep track of the decision trees we created so far
    this.oblique = oblique;
  }

  fit(X, y) {
    this.trees = [];
    for (let i = 0; i < this.n_trees; i++) {
      let tree = new DecisionTreeClassifier({
        criterion: this.criterion,
        max_depth: this.max_depth,
        min_samples_split: this.min_samples_split,
        max_leaves: this.max_leaves,
        n_features: this.n_features,
        oblique: this.oblique,
      });

      let [X_sample, y_sample] = this._bootstrap_samples(X, y);
      tree.fit(X_sample, y_sample);
      this.trees.push(tree);
    }
  }

  _bootstrap_samples(X, y) {
    const n_samples = X.length;
    let X_sample = [];
    let y_sample = [];

    for (let i = 0; i < n_samples; i++) {
      const index = Math.floor(Math.random() * n_samples);
      X_sample.push(X[index]);
      y_sample.push(y[index]);
    }

    return [X_sample, y_sample];
  }

  predict(X) {
    // Check if trees are not trained yet
    if (this.trees.length === 0) {
      console.error(
        "No trees trained. Ensure fit method is called before predict."
      );
      return; // or throw an error, return a default value, or handle the case appropriately
    }

    // Initialize an array to store predictions from all trees
    let predictions = [];

    // Aggregate predictions from each tree
    for (let tree of this.trees) {
      let tree_predictions = tree.predict(X);
      predictions.push(tree_predictions);
    }

    // Transpose the predictions array if predictions are available
    if (predictions.length > 0) {
      predictions = predictions[0].map((_, i) =>
        predictions.map((row) => row[i])
      );
    } else {
      console.error(
        "No predictions available. Ensure trees are trained and predict method is called correctly."
      );
      return; // or throw an error, return a default value, or handle the case appropriately
    }

    // Apply majority voting for classification
    let final_predictions = predictions.map((tree_preds) => {
      // Count occurrences of each class label
      let counts = {};
      for (let pred of tree_preds) {
        counts[pred] = (counts[pred] || 0) + 1;
      }
      // Find the most common class label
      let maxCount = 0;
      let maxLabel;
      for (let label in counts) {
        if (counts[label] > maxCount) {
          maxCount = counts[label];
          maxLabel = label;
        }
      }
      return maxLabel;
    });

    return final_predictions;
  }

  predict_proba(X) {
    // Check if trees are not trained yet
    if (this.trees.length === 0) {
      console.error(
        "No trees trained. Ensure fit method is called before predict_proba."
      );
      return;
    }

    // Initialize an array to store probabilities from all trees
    let probabilities = [];

    // Aggregate probabilities from each tree
    for (let tree of this.trees) {
      let tree_probabilities = tree.predict_proba(X);
      probabilities.push(tree_probabilities);
    }

    // Transpose the probabilities array if probabilities are available
    if (probabilities.length > 0) {
      probabilities = probabilities[0].map((_, i) =>
        probabilities.map((row) => row[i])
      );
    } else {
      console.error(
        "No probabilities available. Ensure trees are trained and predict_proba method is called correctly."
      );
      return;
    }

    // Combine probabilities from all trees
    let combined_probabilities = probabilities.map((tree_probs) => {
      // Calculate average probability for each class label
      let avg_probs = {};
      for (let prob of tree_probs) {
        for (let label in prob) {
          avg_probs[label] = (avg_probs[label] || 0) + prob[label];
        }
      }
      for (let label in avg_probs) {
        avg_probs[label] /= tree_probs.length;
      }
      return avg_probs;
    });

    return combined_probabilities;
  }
}
