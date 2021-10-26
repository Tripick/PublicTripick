import * as React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function SingleLine(props)
{
  return (
    <Views.Center width={100}>
      <View style={s.inputFrame}>
        <TextInput
          style={s.input}
          onChangeText={props.onChange}
          value={props.value}
          placeholderTextColor={G.Colors().placeHolderText}
        />
      </View>
    </Views.Center>
  );
}

const s = StyleSheet.create({
  inputFrame: {
    ...G.S.shadow(),
    overflow: "hidden",
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 3,
    backgroundColor: G.Colors().Foreground(),
  },
  input: {
    ...G.S.full,
    textAlign: "left",
    textAlignVertical: "center",
    color: G.Colors().Neutral(),
    fontSize: 14,
  },
});
