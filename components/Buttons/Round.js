import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import DisplayersIcon from "../Displayers/Icon";
import Touchable from "../Displayers/Touchable";

export default function Round(props)
{
  const contentStyle = props.backgroundDark
    ? s.contentDark
    : props.backgroundDarkTransparent
    ? s.contentDarkTransparent
    : props.backgroundBright
    ? s.contentBright
    : props.backgroundHighlight
    ? s.contentHighlight
    : props.backgroundAltlight
    ? s.contentAltlight
    : props.noBackground
    ? s.contentTransparent
    : s.content;
  const shadow = props.shadow ? s.shadow : s.noShadow;
  const buttonColor = props.dark ? G.Colors().Neutral() : props.disable ? G.Colors().Important(0.4) : G.Colors().Background();
  const iconName = props.name
    ? props.name
    : props.action
    ? "ellipsis-vertical"
    : props.add
    ? "plus"
    : props.back
    ? "chevron-left"
    : props.close
    ? "close"
    : "ellipsis-vertical";
  const sizeAjuster = props.action ? -5 : props.add ? 0 : props.back ? 0 : props.close ? 0 : 0;

  return (
    <View style={[{...G.S.center, flexDirection: props.alignWidth ? "column" : "row"}, props.style]} >
      <View style={[s.container, props.alignWidth ? { ...G.S.width(), maxWidth: "100%" } : { ...G.S.height(), maxHeight: "100%" }, props.containerStyle]}>
        <Touchable noFade onPress={props.onPress}>
          <View style={[contentStyle, shadow, props.contentStyle]}>
            <DisplayersIcon
              style={[s.button, props.adjustPosition]}
              type={props.type ? props.type : (iconName === "ellipsis-vertical" ? null : "mci")}
              name={iconName}
              size={props.size ? props.size : 30 + sizeAjuster + (props.sizeAjuster ? props.sizeAjuster : 0)}
              color={props.color ? props.color : buttonColor}
            />
          </View>
        </Touchable>
      </View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    aspectRatio: 1,
    flexDirection: "row",
    padding: 6,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: G.Colors().Important(0.4),
  },
  noShadow: {},
  button:
  {
    ...G.S.center,
    position:'absolute',
    textAlign: "center",
    textAlignVertical: "center",
  },
});

s.contentDark = {
  ...s.content,
  backgroundColor: G.Colors().Important(),
};
s.contentDarkTransparent = {
  ...s.content,
  backgroundColor: G.Colors().Important(0.25),
};
s.contentBright = {
  ...s.content,
  backgroundColor: G.Colors().Foreground(),
};
s.contentHighlight = {
  ...s.content,
  backgroundColor: G.Colors().Highlight(),
};
s.contentAltlight = {
  ...s.content,
  backgroundColor: G.Colors().Altlight(),
};
s.contentTransparent = {
  ...s.content,
  backgroundColor: G.Colors().Transparent,
};
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
