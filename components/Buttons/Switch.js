import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import DisplayersIcon from "../Displayers/Icon";

export default function Switch(props) {
  return (
    <View style={s.container}>
      <TouchableWithoutFeedback
        onPress={() => props.onSwitch(!props.activated)}
      >
        <View
          style={[s.button, props.activated === true ? s.buttonActivated : {}]}
        >
          <View
            style={[
              s.round,
              props.activated === true ? s.activated : s.disabled,
            ]}
          ></View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.center,
    ...G.S.full,
  },
  button: {
    ...G.S.center,
    ...G.S.full,
    aspectRatio: 1.6,
    paddingHorizontal: "10%",
    borderRadius: 100,
    backgroundColor: G.Colors().Background(),
    borderWidth: 0.5,
    borderColor: G.Colors().Neutral(0.3),
  },
  round: {
    ...G.S.center,
    ...G.S.height(90),
    position: "absolute",
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: G.Colors().Foreground(),
  },
  buttonActivated: {
    backgroundColor: G.Colors().Highlight(),
  },
  disabled: { left: "5%" },
  activated: { right: "5%" },
});
