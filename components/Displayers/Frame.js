import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Views from "../../Libs/Views";

export default function Frame(props) {
  const content = (
    <Views.Center containerStyle={props.style} width={100}>
      <View
        style={{
          ...G.S.full,
          padding: 7,
          paddingTop: 1,
        }}
      >
        <View style={s.frame}>{props.children}</View>
      </View>
    </Views.Center>
  );
  return props.onPress ? (
    <TouchableWithoutFeedback onPress={props.onPress}>
      {content}
    </TouchableWithoutFeedback>
  ) : (
    content
  );
}

const s = StyleSheet.create({
  frame: {
    ...G.S.height(),
    ...G.S.shadow(3),
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: G.Colors().Foreground(),
    borderColor: G.Colors().Important(),
  },
});
