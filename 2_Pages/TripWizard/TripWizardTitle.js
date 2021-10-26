import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";

export default function TripWizardTitle(props)
{
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.aligner}>
          {props.path === 0 ?
            <View/>
            :
            <Buttons.Round
              alignWidth
              dark
              noBackground
              name={"chevron-left"}
              type="mci"
              size={25}
              color={G.Colors().Foreground()}
              onPress={props.previous}
            />
          }
        </View>
        <View style={s.middle}>
          <View style={s.title}>
            <Texts.Title style={{color:G.Colors().Foreground(), fontSize: 16 }} numberOfLines={2}>
              {props.path > 0 ?
                <Text style={{color:G.Colors().Foreground(), fontSize: 20}}>{props.path + " / " + props.totalPath + "\n"}</Text>
                :
                <View/>
              }
              <Text style={{color:G.Colors().Foreground(), fontSize: 16}}>{props.title}</Text>
            </Texts.Title>
          </View>
        </View>
        <View style={s.aligner}>
          {/* <Buttons.Round
            alignWidth
            dark
            noBackground
            name={props.mode === "ModifyPlace" ? "pencil-outline" : "dots-vertical"}
            type="mci"
            size={25}
            color={G.Colors().Foreground()}
            onPress={onMore}
          /> */}
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(),
    overflow: "hidden",
    backgroundColor:G.Colors().Highlight(),
    aspectRatio: 5,
    borderBottomWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  content:
  {
    ...G.S.width(),
    ...G.S.center,
    flexDirection: "row",
  },
  aligner:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
  },
  middle:
  {
    ...G.S.center,
    flex: 4,
  },
  title:
  {
    ...G.S.center,
  },
});
