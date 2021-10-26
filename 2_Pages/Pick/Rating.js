import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default function Rating(props) {
  return (
    <View style={s.container}>
      <View style={{ flex: 1 }}></View>
      <View
        style={{
          ...G.S.center,
          flex: 2.5,
        }}
      >
        {Platform.OS == "android" ?
          <Displayers.Rating iconSize={25} value={3.6} votes={92} />
          :
          <Displayers.RatingIos iconSize={25} value={3.6} votes={92} />
        }
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.width(),
    ...G.S.center,
    flexDirection: "row",
  },
});
