import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function LoadMore(props)
{
  return (
    <View style={[s.container, props.aspectRatio ? {aspectRatio:props.aspectRatio} : {} ]}>
      <View style={s.line}/>
      <View style={s.buttonFrame}>
        <Displayers.Touchable onPress={props.onPress}>
          <Texts.Label style={s.loadMore}>{props.message ? props.message : "Load more"}</Texts.Label>
        </Displayers.Touchable>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:8,
    paddingVertical:7,
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(),
    position: "absolute",
    height:0,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
  buttonFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.shadow(3),
    borderRadius:100,
    marginTop:-1,
    paddingHorizontal:10,
    paddingBottom:2,
    backgroundColor:G.Colors().Foreground(),
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
  },
  loadMore:
  {
    color:G.Colors().Highlight(),
    fontWeight:'bold',
  },
});