import * as React from "react";
import { TouchableOpacity } from "react-native";

export default function Touchable(props)
{
  return (
    <TouchableOpacity activeOpacity={props.noFade ? 1 : 0.5} {...props}>
      {props.children}
    </TouchableOpacity>
  );
}
