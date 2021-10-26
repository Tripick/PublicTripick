import * as React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function TouchableOverlay(props)
{
  return (
    <TouchableOpacity style={{ ...StyleSheet.absoluteFill }} activeOpacity={0.5} onPress={props.onPress}>
      <View style={s.container}/>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...StyleSheet.absoluteFill
  },
});
