import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function BackgroundImage(props)
{
  return (
    <View style={[{ ...StyleSheet.absoluteFill }, props.style]}>
      <Image source={props.source} style={{ ...G.S.full }} />
    </View>
  );
}
