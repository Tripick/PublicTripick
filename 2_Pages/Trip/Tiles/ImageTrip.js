import React from "react";
import { StyleSheet, View, Image } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";

export default function ImageTrip(props)
{
  return (
    <View style={s.container}>
      <Image
        source={{uri:
          typeof props.trip !== "undefined" &&
          props.trip !== null &&
          props.trip.coverImage !== null &&
          props.trip.coverImage !== ""
            ? props.trip.coverImage : "_",
        }}
        style={{ ...G.S.center, ...G.S.full, zIndex:2 }}
      />
      {/* <View style={s.fog}/> */}
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    position:'absolute',
    top:0,
  },
  fog:
  {
    ...StyleSheet.absoluteFill,
    backgroundColor:G.Colors().Neutral(0.3),
    zIndex:3,
  },
});
