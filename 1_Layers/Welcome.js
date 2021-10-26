import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
// Context
import { AppContext } from "../AppContext";
// Libs
import * as G from "../Libs/Globals";
import * as Displayers from "../Libs/Displayers";
import * as Texts from "../Libs/Texts";
import * as Wrappers from "../Libs/Wrappers";

export default function Welcome(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const goTo = (pageName) => { context.navigate(props.navigation, pageName); }

  const getButton = (text, onPress, style, textStyle) =>
  {
    return (
      <Displayers.Touchable onPress={onPress} style={[s.button, style !== null ? style : {}]}>
        <Text style={[s.buttonText, textStyle !== null ? textStyle : {}]}>{text}</Text>
      </Displayers.Touchable>
    );
  };

  return (
    <Wrappers.AppFrame>
      <View style={s.container}>
        <View style={s.page}>
          <View style={s.logoContainer}>
            <View style={s.logoContent}>
              <Image source={G.Images.logo} style={s.logo} />
            </View>
          </View>
          <View style={s.messageContainer}>
            <Texts.Label style={s.message}>
              <Text style={s.bigText}>{"Thank you\n"}</Text>
              <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"\nfor discovering the Tripick community!\n\n"}</Text>
            </Texts.Label>
            <Texts.Label style={[s.message, {textAlign:'justify'}]}>
              <Text style={[s.normalText, {fontSize: 16, color:G.Colors().Neutral(0.7)}]}>{"Don't want to miss anything while traveling?\nUse Tripick, the easiest way to discover places and plan your trips!\n"}</Text>
              <Text style={[s.normalText, {fontSize: 16, color:G.Colors().Highlight()}]}>{"\nBrowse among millions of destinations, improved everyday by the Tripick community.\n"}</Text>
            </Texts.Label>
            <Texts.Label left style={s.message}>
              <Text style={[s.normalText, {fontSize: 14, color:G.Colors().Neutral(0.5)}]}>{"- Select an area anywhere on Earth.\n- Pick places based on your travel preferences.\n- Automatically generate your itinerary.\n- Customize it as you like, and let's go!"}</Text>
            </Texts.Label>
          </View>
          <View style={s.actionContainer}>
            <View style={s.buttonContainer}>
              {getButton(
                "I am new",
                () => goTo("Register"),
                {backgroundColor:G.Colors().Highlight()},
                {color:G.Colors().Foreground()}
              )}
            </View>
            <View style={s.buttonContainer}>
              {getButton(
                "I have an account",
                props.hide,
                {borderWidth:1, borderColor:G.Colors().Highlight()},
                {color:G.Colors().Highlight()}
              )}
            </View>
          </View>
        </View>
      </View>
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    //backgroundColor:G.Colors().Foreground(),
  },
  page:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },

  logoContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent:'flex-end',
    alignContent:'flex-end',
  },
  logoContent:
  {
    ...G.S.center,
    ...G.S.height(75),
    ...G.S.width(),
  },
  messageContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    flex:2,
  },
  actionContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:20,
  },

  logoContainerName:
  {
    ...G.S.center,
    flex: 1.3,
    marginTop: 10,
  },
  logo:
  {
    ...G.S.full,
    resizeMode: "contain",
  },
  message:
  {
    ...G.S.width(),
  },
  bigText:
  {
    fontSize:24,
    color:G.Colors().Highlight(),
  },
  textLine:
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
});

const h = StyleSheet.create(
{
  header:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(5),
    backgroundColor: G.Colors().Highlight(),
    aspectRatio:6.5,
  },
  title:
  {
    ...G.S.width(),
    fontSize: 20,
    color: G.Colors().Foreground(),
    position:'absolute',
  },
  backButton:
  {
    ...G.S.center,
    height:65,
    aspectRatio: 1,
    position:'absolute',
    left:10,
  },
  addButton:
  {
    ...G.S.center,
    height:65,
    aspectRatio: 1,
    position:'absolute',
    right:10,
  },
});
