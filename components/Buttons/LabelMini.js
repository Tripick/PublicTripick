import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";

export default function LabelMini(props) {
  const contentStyle = props.backgroundDark
    ? s.contentDark
    : props.backgroundBright
    ? s.contentBright
    : props.backgroundHighlight
    ? s.contentHighlight
    : props.backgroundAltlight
    ? s.contentAltlight
    : props.noBackground
    ? s.contentTransparent
    : props.backgroundDanger
    ? s.contentDanger
    : s.content;
  const textColor = props.dark ? G.Colors().Neutral() : G.Colors().Background();

  return (
    <TouchableWithoutFeedback {...props} underlayColor="transparent">
      <View style={s.container}>
        <View style={[s.content, contentStyle]}>
          <Texts.Label style={[s.text, { color: textColor }, props.style]}>
            {props.children}
          </Texts.Label>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    ...G.S.center,
    paddingVertical: 3,
    paddingHorizontal: 1,
  },
  content: {
    ...G.S.height(),
    ...G.S.center,
    ...G.S.shadow(1),
    borderRadius: 100,
    backgroundColor: G.Colors().Background(),
  },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: -1,
    fontSize: 8,
  },
});
s.contentDark = {
  ...s.content,
  backgroundColor: G.Colors().Important(),
};
s.contentBright = {
  ...s.content,
  backgroundColor: G.Colors().Background(),
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
s.contentDanger = {
  ...s.content,
  backgroundColor: G.Colors().Fatal,
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
