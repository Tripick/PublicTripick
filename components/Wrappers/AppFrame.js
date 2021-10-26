import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
// Components
import BackgroundImage from "../Displayers/BackgroundImage";

export default function AppFrame(props)
{
  return (
    <View style={[s.container, props.style ? props.style : {}]}>
      <View style={s.content}>
        {/* <BackgroundImage style={s.back} source={G.Images.background} /> */}
        {props.children}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor: G.Colors().Background(),
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  back:
  {
    ...G.S.center,
    ...G.S.full,
    opacity:0.04,
  },
});
