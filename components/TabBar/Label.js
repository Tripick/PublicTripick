import * as React from "react";
import { StyleSheet } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";

export default function Label(props) {
  if (false && !props.focused) return null;
  return (
    <Texts.Title
      style={[
        s.tabLabel,
        {
          color: props.focused ? G.Colors().Highlight() : G.Colors().Important(0.4),
        },
      ]}
    >
      {props.name}
    </Texts.Title>
  );
}

const s = StyleSheet.create({
  tabLabel: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 12,
    fontFamily: "title",
  },
});
