import React from "react";
import { Text, StyleSheet } from "react-native";

const TextInANest = () => {
  return <Text style={styles.baseText}></Text>;
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
});

export default TextInANest;
