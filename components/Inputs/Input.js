import * as React from "react";
import { StyleSheet, View, TextInput } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function Input(props) {
  const containerStyle = props.dark
    ? s.containerDark
    : props.highlight
    ? s.containerHighlight
    : props.transparent
    ? s.containerTransparent
    : s.container;
  const inputStyle = props.dark
    ? s.inputDark
    : props.highlight
    ? s.inputHighlight
    : props.transparent
    ? s.inputTransparent
    : s.input;

  return (
    <Views.Center>
      <View style={containerStyle}>
        <Views.Center containerStyle={s.iconContainer}>
          <Displayers.Icon
            fa
            style={s.icon}
            name={props.icon}
            size={15}
            color={G.Colors().Neutral()}
          />
        </Views.Center>
        <Views.Center containerStyle={s.separatorContainer}>
          <View style={s.separator} />
        </Views.Center>
        <Views.Center
          containerStyle={s.inputContainer}
          contentStyle={{ ...G.S.width() }}
        >
          <TextInput
            style={inputStyle}
            onChangeText={props.onChange}
            value={props.value}
            placeholderTextColor={G.Colors().placeHolderText}
          />
        </Views.Center>
      </View>
    </Views.Center>
  );
}

const s = StyleSheet.create({
  container: {
    ...G.S.full,
    ...G.S.shadow(),
    ...G.S.center,
    flexDirection: "row",
    maxHeight: 35,
    maxWidth: "100%",
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: G.Colors().Foreground(),
    aspectRatio: 5,
  },
  iconContainer: { flex: 1, marginLeft: 10 },
  separatorContainer: { flex: 1 },
  inputContainer: {
    flex: 6,
  },
  icon: {},
  separator: {
    height: "60%",
    width: "1%",
    borderWidth: 1,
    borderColor: G.Colors().Important(0.6),
  },
  input: {
    ...G.S.full,
    marginTop: -1,
    textAlign: "left",
    textAlignVertical: "center",
    color: G.Colors().Neutral(),
    fontSize: 16,
  },
});

s.containerDark = {
  ...s.container,
  backgroundColor: G.Colors().Important(),
};
s.inputDark = {
  ...s.input,
  color: G.Colors().Neutral(),
};

s.containerHighlight = {
  ...s.container,
  backgroundColor: G.Colors().Highlight(),
};
s.inputHighlight = {
  ...s.input,
  color: G.Colors().iconButtonHighlight,
};

s.containerTransparent = {
  ...s.container,
  backgroundColor: "transparent",
};
s.inputTransparent = {
  ...s.input,
  color: G.Colors().buttonTextTransparent,
};
