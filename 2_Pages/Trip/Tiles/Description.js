import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Popups from "../../../Libs/Popups";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Inputs from "../../../Libs/Inputs";
import * as Displayers from "../../../Libs/Displayers";

export default function Description(props)
{
  const originalDescription = "Describe your trip in a few words here...";
  const getDescription = () => 
  {
    return typeof props.trip !== "undefined" &&
    props.trip !== null &&
    typeof props.trip.description !== "undefined" &&
    props.trip.description !== null && props.trip.description !== "" ? props.trip.description
      : originalDescription;
  };

  return (
    <View style={[s.container, { borderColor:props.separatorColor }]}>
      <Displayers.Touchable onPress={() => props.setShowDescriptionInput(true)}>
        <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }} left>
          {getDescription()}
        </Texts.Label>
      </Displayers.Touchable>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:20,
    paddingHorizontal:20,
    borderBottomWidth:1,
  }
});
