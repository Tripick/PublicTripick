import * as React from "react";
import { StyleSheet, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Label(props)
{
  return (
    <Text
      {...props}
      style={[s.label,
        {
          textAlign: props.left ? "left" : props.right ? "right" : "center",
          textAlignVertical: props.top ? "top" : props.bottom ? "bottom" : "center",
          fontWeight: props.bold ? "bold" : "normal",
        },
        props.bold ? {fontFamily: "labelBold"} : {},
        props.style,
      ]}
      numberOfLines={ props.singleLine ? 1 : props.numberOfLines ? props.numberOfLines : undefined
      }
    >
      {props.children}
    </Text>
  );
}

const s = StyleSheet.create({
  label:
  {
    ...G.S.center,
    color: G.Colors().Neutral(),
    fontFamily: "label",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
