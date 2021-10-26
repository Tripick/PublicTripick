import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";

export default function _07_Travelers(props)
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
          <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Your friends can participate to your trip organization!\n\n"}</Text>
        </Texts.Label>
        <Texts.Label style={[s.message, {textAlign:'justify'}]}>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"Because trips with friends can be difficult to organize, Tripick comes with an awesome feature :"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" Trip sharing!"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\n\nBy adding friends as travelers"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" in your trip, they can see your trip and"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" pick places"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" too. Tripick will take their picks into account to generate an itinerary that everyone loves!"}</Text>
          <Text style={[s.normalText, {fontSize:20, color:G.Colors().Highlight()}]}>{"\n\n\nHow to add friends as travelers?"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"\n\n- First"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" add them as friends"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" on the main menu of the main page."}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"\n\n- Once they accepted your friend invite,"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\nopen your trip"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" and add them to the"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\nlist of travelers!\n\n\n"}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Got it, I can add friends as travelers", props.next, false)}
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
