import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";

export default function _08_PickTutorial(props)
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
          <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Pick places!\n\n"}</Text>
        </Texts.Label>
        <Texts.Label style={[s.message, {textAlign:'justify'}]}>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"Tripick will present you places based on your"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" area"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{","}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" dates"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" and"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" preferences"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"."}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\n\nRate them"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" from:"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\n0 (not interested)"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" to"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" 5 (very interested)"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{".\nby"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" sliding the button "}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>
            <Image source={G.Images.picksIcon} style={s.icon} />
          </Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" horizontally.\n\n\nYou will now be redirected to"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" your trip page"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{". Click"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" Pick places you like"}</Text>
          <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" to start organizing your trip!\n\n"}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Quit tutorial, let's pick places!", props.next, false)}
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
  icon:
  {
    height:40,
    width:40,
  },
});
