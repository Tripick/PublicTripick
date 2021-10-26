import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";

export default function _01_Presentation(props)
{
  const getButton = (text, onPress, isAlt, isDeactivated = false) =>
  {
    return (
      <Displayers.Touchable onPress={onPress} style={[
          s.button,
          isAlt === true ?
            {backgroundColor:G.Colors().Foreground(), borderWidth:1, borderColor:G.Colors().Highlight()} :
            {backgroundColor:G.Colors().Highlight()},
          isDeactivated === true ?
            {backgroundColor:G.Colors().Foreground(), borderWidth:1, borderColor:G.Colors().Neutral(0.6)} :
            {},
        ]}>
        <Text style={[
          s.buttonText,
          isAlt === true ? {color:G.Colors().Highlight()} : {color:G.Colors().Foreground()},
          isDeactivated === true ? {color:G.Colors().Neutral(0.6)} : {},
        ]}>{text}</Text>
      </Displayers.Touchable>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.content}>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Welcome to the Tripick tutorial!\n\n"}</Text>
        </Texts.Label>
        <Texts.Label style={[s.message, {textAlign:'justify'}]}>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"Tripick is the easiest way to discover awesome places and organize your trips!"}</Text>
          <Text style={[s.normalText, {fontSize:20, color:G.Colors().Highlight()}]}>{"\n\nHow so?"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"\nSimply"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" select an area to explore"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" on Earth, Tripick will then show you places you will chose to"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" like"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{","}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" love"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" or"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" discard"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{".\n\nOnce you selected enough places to visit, Tripick will"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" generate an itinerary"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" based on your preferences.\nYou can"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" customize your itinerary"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" as you like and you will be ready to go on your next adventure!\n\n\n"}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Select the area of my trip", props.next, false)}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },

  content:
  {
    ...G.S.center,
    ...G.S.width(85),
    flex:1,
  },
  messageContainer:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  actionContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:20,
  },

  message:
  {
    ...G.S.width(),
  },
  normalText:
  {
    ...G.S.width(),
    fontSize: 16,
    color:G.Colors().Neutral(0.6),
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:7,
    marginTop:10,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
    paddingBottom:2,
  },
  buttonText:
  {
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Neutral(0.6),
  },
});
