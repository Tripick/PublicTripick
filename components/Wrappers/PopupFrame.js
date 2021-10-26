import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function PopupFrame(props)
{
  return (
    <View style={s.container}>
      <View style={[s.content,props.transparent ? {backgroundColor: G.Colors().Foreground(0)} : {}]}>{props.children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 30,
  },
  content:
  {
    ...G.S.center,
    //...G.S.full,
    ...G.S.height(101),
    ...G.S.width(101),
    marginTop:"-0.5%",
    marginLeft:"-0.2%",
    backgroundColor: G.Colors().Foreground(0.6),
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
});
