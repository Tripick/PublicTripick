import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Separator(props)
{
  return (
    <View style={[s.container, props.aspectRatio ? {aspectRatio:props.aspectRatio} : {aspectRatio:8} ]}>
      <View style={s.line}/>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(),
    height:0,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
});
