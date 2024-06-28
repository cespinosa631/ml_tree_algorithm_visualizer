// Node class represents a node in the decision tree
export class Node {
  constructor({
    feature_indices = null,
    weights = null,
    threshold = null,
    left = null,
    right = null,
    value = null,
  }) {
    this.feature_indices = feature_indices;
    this.weights = weights;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
    this.value = value;
  }

  // Checks if the node is a leaf node
  is_leaf_node() {
    return this.value !== null && this.value !== undefined;
  }
}

// DecisionTreeClassifier class represents a decision tree classifier
export class DecisionTreeClassifier {
  constructor({
    criterion = "entropy",
    min_samples_split = null,
    max_depth = null,
    n_features = null,
    max_leaves = null,
    oblique = null,
  } = {}) {
    this.criterion = criterion;
    this.min_samples_split = min_samples_split;
    this.max_depth = max_depth;
    this.n_features = n_features;
    this.max_leaves = max_leaves;
    this.oblique = oblique;
  }

  // Fits the decision tree classifier to the training data
  fit(X, y) {
    this.n_features = this.n_features
      ? Math.min(X[0].length, this.n_features)
      : X[0].length;
    this.root = this._grow_tree(X, y, 0);
  }

  // Grows the decision tree recursively
  _grow_tree(X, y, depth) {
    let n_samples = X.length;
    let n_leaves = 0;
    let node = new Node({});

    let n_labels = new Set(y).size;

    if (
      (this.max_depth !== null && depth >= this.max_depth) ||
      n_labels === 1 ||
      n_samples < this.min_samples_split ||
      (this.max_leaves !== null && n_leaves >= this.max_leaves - 1)
    ) {
      let leaf_value = this._most_common_label(y);
      node.value = leaf_value;
      n_leaves++;
    } else {
      if (this.oblique) {
        let [feature_indices, weights, threshold] = this._best_split_oblique(
          X,
          y
        );
        node.feature_indices = feature_indices;
        node.weights = weights;
        node.threshold = threshold;
      } else {
        let [best_feature, best_thresh] = this._best_split(X, y);
        node.feature_indices = [best_feature];
        node.weights = [1];
        node.threshold = best_thresh;
      }
      let [left_idxs, right_idxs] = this._split(X, node);
      node.left = this._grow_tree(
        left_idxs.map((i) => X[i]),
        left_idxs.map((i) => y[i]),
        depth + 1
      );
      node.right = this._grow_tree(
        right_idxs.map((i) => X[i]),
        right_idxs.map((i) => y[i]),
        depth + 1
      );
    }
    return node;
  }

  // Finds the best feature to split on and its threshold for axis-aligned splits
  _best_split(X, y) {
    let best_gain = -1;
    let split_idx = null;
    let split_threshold = null;

    for (let feat_idx = 0; feat_idx < this.n_features; feat_idx++) {
      let X_column = X.map((row) => row[feat_idx]);
      let thresholds = Array.from(new Set(X_column)).sort((a, b) => a - b);

      for (let i = 0; i < thresholds.length - 1; i++) {
        let thr = (thresholds[i] + thresholds[i + 1]) / 2;
        let gain = this._information_gain(y, X_column, thr);

        if (gain >= best_gain) {
          best_gain = gain;
          split_idx = feat_idx;
          split_threshold = thr;
        }
      }
    }
    return [split_idx, split_threshold];
  }

  // Finds the best hyperplane for oblique splits
  _best_split_oblique(X, y) {
    let best_gain = -1;
    let best_feature_indices = null;
    let best_weights = null;
    let best_threshold = null;

    // 200 random hyperplanes
    for (let i = 0; i < 200; i++) {
      let feature_indices = [];
      let weights = [];
      // Randomly select feature indices and weights
      for (let j = 0; j < 2; j++) {
        // Select 2 features
        let idx = Math.floor(Math.random() * this.n_features);
        feature_indices.push(idx);
        weights.push(Math.random() * 2 - 1); // Random weight between -1 and 1
      }

      // Calculate threshold as the mean of projections of samples
      let projections = X.map((x) => {
        let sum = 0;
        for (let j = 0; j < 2; j++) {
          sum += x[feature_indices[j]] * weights[j];
        }
        return sum;
      });
      let minProjection = Math.min(...projections);
      let maxProjection = Math.max(...projections);
      let threshold = (minProjection + maxProjection) / 2;

      // Split data based on the hyperplane
      let left_idxs = [];
      let right_idxs = [];
      for (let j = 0; j < X.length; j++) {
        if (projections[j] <= threshold) {
          left_idxs.push(j);
        } else {
          right_idxs.push(j);
        }
      }

      // Calculate information gain for the split
      let gain = this._information_gain(y, projections, threshold);

      // Update best split if information gain is higher
      if (gain > best_gain) {
        best_gain = gain;
        best_feature_indices = feature_indices;
        best_weights = weights;
        best_threshold = threshold;
      }
    }

    return [best_feature_indices, best_weights, best_threshold];
  }

  // Calculates the information gain
  _information_gain(y, X_column, threshold) {
    if (this.criterion === "entropy") {
      return this._entropy_gain(y, X_column, threshold);
    } else if (this.criterion === "gini") {
      return this._gini_gain(y, X_column, threshold);
    } else if (this.criterion === "classification_error") {
      return this._classification_error_gain(y, X_column, threshold);
    }
    return 0;
  }

  // Calculates impurity (either entropy or Gini)
  _impurity(y) {
    if (this.criterion === "entropy") {
      return this._entropy(y);
    } else if (this.criterion === "gini") {
      return this._gini(y);
    }
    return 0;
  }

  // Calculates entropy gain
  _entropy_gain(y, X_column, threshold) {
    // Calculate parent entropy
    let parent_entropy = this._entropy(y);

    // Split data based on the threshold
    let left_idxs = [];
    let right_idxs = [];
    for (let i = 0; i < X_column.length; i++) {
      if (X_column[i] <= threshold) {
        left_idxs.push(i);
      } else {
        right_idxs.push(i);
      }
    }

    // Calculate weighted average of child entropies
    let p_left = left_idxs.length / y.length;
    let p_right = right_idxs.length / y.length;
    let child_entropy =
      p_left * this._entropy(y.filter((_, i) => left_idxs.includes(i))) +
      p_right * this._entropy(y.filter((_, i) => right_idxs.includes(i)));

    // Calculate information gain
    return parent_entropy - child_entropy;
  }

  // Calculates Gini gain
  _gini_gain(y, X_column, threshold) {
    // Calculate parent Gini impurity
    let parent_gini = this._gini(y);

    // Split data based on the threshold
    let left_idxs = [];
    let right_idxs = [];
    for (let i = 0; i < X_column.length; i++) {
      if (X_column[i] <= threshold) {
        left_idxs.push(i);
      } else {
        right_idxs.push(i);
      }
    }

    // Calculate weighted average of child Gini impurities
    let p_left = left_idxs.length / y.length;
    let p_right = right_idxs.length / y.length;
    let child_gini =
      p_left * this._gini(y.filter((_, i) => left_idxs.includes(i))) +
      p_right * this._gini(y.filter((_, i) => right_idxs.includes(i)));

    // Calculate Gini gain
    return parent_gini - child_gini;
  }

  // Calculates classification error gain
  _classification_error_gain(y, X_column, threshold) {
    // Calculate parent classification error
    let parent_error = this._classification_error(y);

    // Split data based on the threshold
    let left_idxs = [];
    let right_idxs = [];
    for (let i = 0; i < X_column.length; i++) {
      if (X_column[i] <= threshold) {
        left_idxs.push(i);
      } else {
        right_idxs.push(i);
      }
    }

    // Calculate weighted average of child classification errors
    let p_left = left_idxs.length / y.length;
    let p_right = right_idxs.length / y.length;
    let child_error =
      p_left *
        this._classification_error(y.filter((_, i) => left_idxs.includes(i))) +
      p_right *
        this._classification_error(y.filter((_, i) => right_idxs.includes(i)));

    // Calculate classification error gain
    return parent_error - child_error;
  }

  // Splits the data based on the given hyperplane
  _split(X, node) {
    let left_idxs = [];
    let right_idxs = [];

    for (let i = 0; i < X.length; i++) {
      if (this._oblique_decision(X[i], node)) {
        left_idxs.push(i);
      } else {
        right_idxs.push(i);
      }
    }

    return [left_idxs, right_idxs];
  }

  // Makes decision for oblique splits
  _oblique_decision(x, node) {
    if (
      node.feature_indices &&
      node.feature_indices.length > 0 &&
      node.weights &&
      node.weights.length > 0 &&
      node.threshold !== null
    ) {
      let sum = 0;
      for (let i = 0; i < node.feature_indices.length; i++) {
        sum += x[node.feature_indices[i]] * node.weights[i];
      }
      return sum <= node.threshold;
    }
    return false;
  }

  // Creates a histogram of labels
  _create_hist(y) {
    let hist = Array.from(new Set(y)).map((label) => ({ label, count: 0 }));
    y.forEach((label) => hist.find((item) => item.label === label).count++);
    return hist.map((item) => item.count / y.length);
  }

  // Calculates entropy
  _entropy(y) {
    let hist = this._create_hist(y);
    return -hist.reduce((acc, p) => acc + (p === 0 ? 0 : p * Math.log2(p)), 0);
  }

  // Calculates Gini impurity
  _gini(y) {
    let hist = this._create_hist(y);
    return 1 - hist.reduce((acc, p) => acc + Math.pow(p, 2), 0);
  }

  // Calculates the classification error
  _classification_error(y) {
    let hist = this._create_hist(y);
    let max_freq = Math.max(...hist);
    return 1 - max_freq;
  }

  // Finds the most common label
  _most_common_label(y) {
    let freq = {};
    let maxFreq = 0;
    let mostCommonLabel = null;

    for (let i = 0; i < y.length; i++) {
      let label = y[i];
      freq[label] = (freq[label] || 0) + 1;
      if (freq[label] > maxFreq) {
        maxFreq = freq[label];
        mostCommonLabel = label;
      }
    }
    return mostCommonLabel;
  }

  // Predicts the labels for the input data
  predict(X) {
    let preds = [];
    for (let i = 0; i < X.length; i++) {
      preds.push(this._traverse_tree(X[i], this.root));
    }
    return preds;
  }
  // Predicts the probabilities of each class for the input data
  predict_proba(X) {
    let probs = [];
    for (let i = 0; i < X.length; i++) {
      probs.push(this._predict_proba_single(X[i], this.root));
    }
    return probs;
  }

  // Predicts the probabilities of each class for a single sample
  _predict_proba_single(x, node) {
    if (node.is_leaf_node()) {
      // If it's a leaf node, return the probabilities stored in the node
      return node.value;
    }

    // Otherwise, traverse the tree to the appropriate child node
    if (this.oblique) {
      if (this._oblique_decision(x, node)) {
        return this._predict_proba_single(x, node.left);
      } else {
        return this._predict_proba_single(x, node.right);
      }
    } else {
      if (
        node.feature_indices &&
        node.feature_indices.length > 0 &&
        x[node.feature_indices[0]] <= node.threshold
      ) {
        return this._predict_proba_single(x, node.left);
      } else {
        return this._predict_proba_single(x, node.right);
      }
    }
  }

  // Traverses the tree to predict the label for a single sample
  _traverse_tree(x, node) {
    if (node.is_leaf_node()) {
      return node.value;
    }

    if (this.oblique) {
      if (this._oblique_decision(x, node)) {
        return this._traverse_tree(x, node.left);
      } else {
        return this._traverse_tree(x, node.right);
      }
    } else {
      if (
        node.feature_indices &&
        node.feature_indices.length > 0 &&
        x[node.feature_indices[0]] <= node.threshold
      ) {
        return this._traverse_tree(x, node.left);
      } else {
        return this._traverse_tree(x, node.right);
      }
    }
  }
}
