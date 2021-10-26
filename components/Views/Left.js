import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

{
  /*
  <Views.Left width={18}>
    <Texts.Label>Blop</Texts.Label>
  </Views.Left>
*/
}
export default function Left(props) {
  return (
    <View
      //{...props}
      style={[s.horizontal, props.containerStyle]}
    >
      <View
        style={[s.aligner, props.width ? { width: props.width + "%" } : {}]}
      >
        <View
          style={[
            s.vertical,
            props.contentStyle,
            props.height ? { height: props.height + "%" } : {},
          ]}
        >
          {props.children}
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  horizontal: {
    ...G.S.full,
    ...G.S.center,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  aligner: {
    ...G.S.center,
  },
  vertical: {
    ...G.S.height(),
    ...G.S.center,
  },
});
