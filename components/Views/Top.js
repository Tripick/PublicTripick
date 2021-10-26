import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Top(props) {
  return (
    <View {...props} style={[s.horizontal, props.containerStyle]}>
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
  },
  aligner: {
    ...G.S.center,
    justifyContent: "flex-start",
  },
  vertical: {
    ...G.S.center,
  },
});
