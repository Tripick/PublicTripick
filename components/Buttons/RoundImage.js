import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
// Libs
import * as G from "../../Libs/Globals";

// image = "data:image/jpeg;base64,xxxxxxxxxxxxxxx..."
export default function RoundImage(props)
{
  const shadow = props.shadow ? s.shadow : s.noShadow;
  return (
    <View
      style={[
        {
          ...G.S.center,
          flexDirection: props.alignWidth ? "column" : "row",
        },
        props.style,
      ]}
    >
      <View
        style={[
          s.container,
          props.alignWidth
            ? { ...G.S.width(), maxWidth: "100%" }
            : { ...G.S.height(), maxHeight: "100%" },
          props.containerStyle,
        ]}
      >
        <TouchableWithoutFeedback {...props} underlayColor="transparent">
          <View style={[s.content, shadow, props.contentStyle]}>
            <Image source={{uri: props.image}} style={{ ...G.S.center, ...G.S.full, borderRadius: 100, }} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.center,
    aspectRatio: 1,
    flexDirection: "row",
    padding: 6,
  },
  content: {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: G.Colors().Important(0.4),
  },
  noShadow: {},
  button: {
    textAlign: "center",
    textAlignVertical: "center",
  },
});

s.shadow = {
  ...s.noShadow,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
};
