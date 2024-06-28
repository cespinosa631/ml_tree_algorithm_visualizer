import React from "react";
import { Text, StyleSheet } from "react-native";

const SetSummary = () => {
  return (
    <>
      <Text style={styles.baseText}>
        <Text style={styles.titleText} numberOfLines={5}>
          Machine Learning GUI
        </Text>
      </Text>
      <Text style={styles.regText}>
        <Text style={styles.headingText} numberOfLines={5}>
          Algorithms
        </Text>
        <Text style={styles.keyText} numberOfLines={5}>
          Decision Tree:
        </Text>
        <div>
          A decision tree is a popular machine learning algorithm used for both
          classification and regression tasks.<br></br>
          It's a simple yet powerful way to make decisions based on input data
          by following a tree-like structure of decisions and outcomes.<br></br>
          Here's a high-level description of how a decision tree works:
          <Text style={styles.keyText} numberOfLines={5}>
            1. Root Node:
          </Text>
          At the top of the tree, you have the root node, which represents the
          entire dataset or the initial set of data.<br></br>
          <Text style={styles.keyText} numberOfLines={5}>
            2. Internal Nodes:
          </Text>
          The tree branches out from the root node into internal nodes. Each
          internal node represents a decision or a test on a specific feature
          <br></br>
          (attribute) of the data. These tests are designed to split the data
          into subsets based on certain conditions.
          <Text style={styles.keyText} numberOfLines={5}>
            3. Branches:
          </Text>
          Each branch emanating from an internal node represents one possible
          outcome of the test.
          <Text style={styles.keyText} numberOfLines={5}>
            4. Leaves(Terminal Nodes):
          </Text>
          The branches ultimately lead to leaf nodes, also known as terminal
          nodes or decision nodes. These nodes represent the final decision or
          prediction.<br></br>
          In classification tasks, each leaf node corresponds to a class or
          category, while in regression tasks, it represents a numeric value.
          <Text style={styles.keyText} numberOfLines={5}>
            5. Decision Rules:
          </Text>
          The path from the root node to a leaf node represents a set of
          decision rules. These rules are determined by the conditions in each
          internal node.
          <Text style={styles.keyText} numberOfLines={5}>
            6. Splitting Criteria:
          </Text>
          To construct a decision tree, the algorithm chooses the best feature
          and the best condition to split the data at each internal node.
          <br></br>
          This decision is made based on a splitting criterion, such as Gini
          impurity or information gain (for classification) or mean squared
          error reduction (for regression). <br></br>
          The goal is to create nodes that best separate the data into
          homogeneous groups, making accurate predictions.
          <Text style={styles.keyText} numberOfLines={5}>
            7. Pruning:
          </Text>
          Decision trees can become overly complex and prone to overfitting,
          which means they capture noise in the data rather than the underlying
          patterns.<br></br>
          To mitigate this, pruning techniques can be applied to simplify the
          tree by removing branches that don't contribute much to the overall
          accuracy.
        </div>
        <Text style={styles.headingText} numberOfLines={5}>
          InterFace Commands
        </Text>
        <Text style={styles.keyText} numberOfLines={5}>
          Draw button:
        </Text>
        <Text numberOfLines={5}>
          1. If the button was pressed, you can add points on the empty canvas
          by left clicking. <br></br>
          2. If the button was pressed again, it will enable the mode too move
          points by left click and dragging the point(s). <br></br>
        </Text>
        <Text style={styles.keyText}>Erase button: </Text>
        <Text numberOfLines={5}>
          1. If the button was pressed, it will clear the canvas back to a white
          canvas with no points. <br></br>
        </Text>
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontSize: 20,
    fontFamily: "Franklin Gothic Medium",
    textAlign: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingText: {
    fontSize: 20,
    fontFamily: "Franklin Gothic Medium",
    fontWeight: "bold",
    textAlign: "center",
  },
  regText: {
    fontSize: 20,
    fontFamily: "Franklin Gothic Medium",
    textAlign: "left",
  },
  keyText: {
    fontSize: 20,
    fontFamily: "Franklin Gothic Medium",
    fontWeight: "bold",
    textAlign: "left",
  },
});

export default SetSummary;
