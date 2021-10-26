import * as React from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Libs
import * as G from "../../Libs/Globals";

/*
<Views.Gradient
  horizontal/oblic
  intensity={0.2}
  style={s.gradient}
  color={G.Colors().gradientColor}
>
*/
export default function Gradient(props) {
  const startTab = { begin: [0.05, 0.5], finish: [0.5, 0.05] };
  const endTab = { begin: [0.95, 0.5], finish: [0.5, 0.95] };
  const start = props.horizontal
    ? (props.reversed ? endTab : startTab).begin
    : props.oblic
    ? [0.5, 0]
    : (props.reversed ? endTab : startTab).finish;
  const end = props.horizontal
    ? (props.reversed ? startTab : endTab).begin
    : props.oblic
    ? [1, 2]
    : (props.reversed ? startTab : endTab).finish;

  return (
    <LinearGradient
      start={start}
      end={end}
      colors={
        props.isOpacity
          ? G.Functions.colorToTransparent(props.color, props.intensity)
          : G.Functions.colorToGradient(props.color, props.intensity)
      }
      style={props.style}
      {...props}
    >
      {props.children}
    </LinearGradient>
  );
}
