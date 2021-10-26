import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
// Components
import Icon from "./Icon";

// <Displayers.IconRound name="md-add" size={25} color="green" />
export default function IconRound(props)
{
  return (
    <View
      style={[
        s.container,
        props.alignWidth
          ? { ...G.S.width(), maxWidth: "100%" }
          : { ...G.S.height(), maxHeight: "100%" },
        props.containerStyle,
      ]}
    >
      <Icon
        {...props}
        style={s.content}
        size={props.size ? props.size : 30}
        color={props.color ? props.color : G.Colors().Important(0.4)}
      />
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.center,
    aspectRatio: 1,
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: 100,
  },
  content: {
    textAlign: "center",
    textAlignVertical: "center",
  },
});
