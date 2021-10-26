import * as React from "react";
import { Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Title(props) {
  return (
    <Text
      {...props}
      style={[
        {
          color: G.Colors().Neutral(),
          textAlign: props.left ? "left" : props.right ? "right" : "center",
          textAlignVertical: "center",
          fontFamily:
            props.style && props.style.fontFamily
              ? props.style.fontFamily
              : props.bold
              ? "titleBold"
              : "title",
        },
        props.style,
        props.caps ? { textTransform: "uppercase" } : {},
      ]}
      numberOfLines={
        props.singleLine
          ? 1
          : props.numberOfLines
          ? props.numberOfLines
          : undefined
      }
    />
  );
}
