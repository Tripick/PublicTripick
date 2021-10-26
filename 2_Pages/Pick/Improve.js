import React from "react";
import { StyleSheet, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default function Improve(props) {
  return (
    <View style={s.container}>
      <Views.Left containerStyle={{ flex: 1 }}>
        <Buttons.Label
          iconName="edit"
          type="mi"
          fullWidth
          shadow
          backgroundHighlight
        >
          Improve this page
        </Buttons.Label>
      </Views.Left>
      <Views.Right containerStyle={{ flex: 1 }}>
        <Buttons.Label
          iconName="pan-tool"
          type="mi"
          fullWidth
          shadow
          dark
          backgroundBright
        >
          Report this page
        </Buttons.Label>
      </Views.Right>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.width(),
    aspectRatio: 7,
    flexDirection: "row",
    marginBottom: 15,
  },
});
