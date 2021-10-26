import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";

export default function Title(props)
{
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.aligner}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name={"chevron-left"}
            type="mci"
            size={30}
            color={G.Colors().Highlight()}
            onPress={props.goBack}
          />
          <Displayers.TouchableOverlay onPress={props.goBack} />
        </View>
        <View style={s.middle}>
          <View style={s.title}>
            <Texts.Title style={{color:G.Colors().Highlight(), fontSize: 16 }} numberOfLines={2}>
              {props.title}
            </Texts.Title>
          </View>
        </View>
        <View style={s.aligner}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name={"dots-vertical"}
            type="mci"
            size={25}
            color={G.Colors().Highlight()}
            onPress={props.showMenu}
          />
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    overflow: "hidden",
  },
  content:
  {
    ...G.S.width(),
    ...G.S.center,
    flexDirection: "row",
  },
  aligner:
  {
    ...G.S.grid,
    ...G.S.center,
    flex: 1,
  },
  middle:
  {
    ...G.S.center,
    flex: 4,
  },
  title:
  {
    ...G.S.center,
    justifyContent: "flex-end",
  },
});
