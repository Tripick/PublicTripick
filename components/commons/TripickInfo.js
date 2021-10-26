import * as React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function TripickInfo(props)
{
  const getImageColor = () =>
  {
    if (props.type === "grant") return G.Colors().Grant;
    else if (props.type === "warning") return G.Colors().Warning;
    else if (props.type === "error") return G.Colors().Fatal;
    else return G.Colors().Neutral();
  }

  return (
    (typeof(props.message) === 'undefined' || props.message === null || !props.message.indexOf || props.message.length < 1) ?
      <View />
      : 
      <ScrollView style={s.scrollView}>
        <View style={s.iconLine}>
          <Displayers.Icon name={"md-information-circle-outline"} size={24} color={getImageColor()} />
        </View>
        <Texts.Multilines
          {...props}
          style={[s.text, {color:getImageColor()}, props.message.indexOf("\n-") >= 0 ? {textAlign: "left"} : {}]}
          icon="alert-circle-outline"
        >
          {props.message}
        </Texts.Multilines>
      </ScrollView>
  );
}

let s = StyleSheet.create({
  iconLine: {
    ...G.S.center,
    flexDirection: "row",
    marginTop: 3,
  },
  scrollView: {
    ...G.S.grid,
    ...G.S.full,
    borderRadius: 15,
    backgroundColor: G.Colors().Background(),
  },
  text: {
    textAlign: "center",
    padding: 10,
    paddingVertical: 5,
    color: G.Colors().Neutral(),
  },
});