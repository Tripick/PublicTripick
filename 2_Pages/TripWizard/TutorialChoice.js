import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";

export default function TutorialChoice(props)
{
  const [errorMessage, setErrorMessage] = React.useState("");
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
          <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Congratulations\nyour trip is created!\n\n"}</Text>
          <Text style={[s.normalText, {fontSize: 16, color:G.Colors().Neutral(0.6)}]}>{"Tripick has a lot of functionalities,\nwould you like to follow a quick tutorial?\nProceed by clicking on a button below.\n\n\n"}</Text>
        </Texts.Label>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 12, color:G.Colors().Fatal}]}>{"\n" + errorMessage}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Skip tutorial, I know Tripick", props.close, true)}
        </View>
        <View style={s.buttonContainer}>
          {getButton("Start tutorial", props.next, false)}
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
  inputContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    //flex:1,
  },
  inputContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    borderRadius:100,
    backgroundColor:G.Colors().Background(0.6),
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
  highlightedText:
  {
    fontSize: 20,
    color:G.Colors().Highlight(),
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
  textInput:
  {
    ...G.S.center,
    ...G.S.full,
    textAlign: "center",
    color:G.Colors().Neutral(),
    paddingHorizontal:5,
  },
});
