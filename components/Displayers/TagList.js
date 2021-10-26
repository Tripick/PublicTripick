import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Tags from "react-native-tags";
// Libs
import * as G from "../../Libs/Globals";

export default function TagList(props) {
  return (
    <Tags
      initialTags={props.data}
      containerStyle={{ justifyContent: "space-evenly" }}
      readonly={true}
      renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
        <TouchableOpacity
          key={`${tag}-${index}`}
          onPress={() => console.log("Tag pressed !")}
        >
          <View style={s.container}>
            <Text style={s.text}>{tag}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
let s = StyleSheet.create({
  container: {
    margin: 3,
    paddingVertical: 2,
    paddingBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: G.Colors().Background(),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 10,
  },
});
