import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";

export default function TabLabelIcon(props) {
  return (
    <View
      style={[
        s.tag,
        { ...props.style },
        props.top ? { justifyContent: "flex-start" } : {},
        props.bottom ? { justifyContent: "flex-end" } : {},
      ]}
    >
      <View
        style={[
          s.aligner,
          props.size ? { maxHeight: props.size } : {},
          props.left ? { justifyContent: "flex-start" } : {},
          props.right ? { justifyContent: "flex-end" } : {},
        ]}
      >
        <View style={s.tagValueContainer}>
          <Texts.Label style={s.tagText}>{props.label}</Texts.Label>
        </View>
        <View style={s.tagIconContainer}>
          <View style={s.tagIcon}>
            <Image
              source={props.image}
              style={[
                s.iconImage,
                { height: (props.iconSize ? props.iconSize : 80) + "%" },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  tag: {
    ...G.S.center,
    flex: 1,
  },
  aligner: {
    ...G.S.center,
    flexDirection: "row",
    maxHeight: 45,
  },
  tagValueContainer: {
    ...G.S.height(),
    ...G.S.center,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  tagIconContainer: {
    ...G.S.height(),
    ...G.S.center,
    flexDirection: "row",
    marginLeft: -1,
    marginRight: 1,
    aspectRatio: 1,
    backgroundColor: G.Colors().Background(),
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: "flex-start",
  },
  tagIcon: {
    ...G.S.height(),
    ...G.S.center,
  },
  tagText: {
    paddingLeft: 10,
    paddingRight: 2,
    paddingBottom: 2,
    backgroundColor: G.Colors().Background(),
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    textAlignVertical: "center",
  },
  iconImage: {
    aspectRatio: 1,
  },
});
