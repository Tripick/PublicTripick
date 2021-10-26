import React from "react";
import { StyleSheet, View, ScrollView, Keyboard, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";
import * as Wrappers from "../../Libs/Wrappers";

export default function GenerateItineraryPopup(props)
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
    <Displayers.Touchable onPress={() => Keyboard.dismiss()}>
      <Popups.Popup
        noCloseButton={true}
        top={false}
        transparent={true}
        containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
        visible={props.show}
        hide={props.hide}
      >
        <View style={s.container}>
          <View style={s.content}>
            <View style={s.icon}>
              <Wrappers.CircleOverlay
                size={50}
                name="go-kart-track"
                type="mci"
                iconColor={props.itineraryPercentIndicator < 100 ? G.Colors().Foreground() : G.Colors().Highlight()}
                backgroundColor={props.itineraryPercentIndicator < 100 ? G.Colors().Highlight() : G.Colors().Foreground()}
                fogColor={props.itineraryPercentIndicator < 100 ? G.Colors().Foreground(0.95) : G.Colors().Neutral(0.5)}
                percent={props.itineraryPercentIndicator}
                fogModifier={{}}
              />
            </View>
            <Texts.Label style={s.message}>
              <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Neutral(0.6)}]}>{Math.trunc(props.itineraryPercentIndicator) + "%\n\n"}</Text>
            </Texts.Label>
            {props.isOwner === true ?
              (props.itineraryPercentIndicator < 100 ?
                <View style={s.message}>
                  <Texts.Label style={s.message}>
                    <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Generate your itinerary?\n\n"}</Text>
                  </Texts.Label>
                  <Texts.Label style={[s.message, {textAlign:'justify'}]}>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"Your trip is "}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{props.nbDays+" days"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" long but you picked only "}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{props.existingPicksCount + " places"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{".\n\nSome days won't automatically have an activity but you can"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" add activities manually"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" later!\n\n"}</Text>
                  </Texts.Label>
                </View>
                :
                <View style={s.message}>
                  <Texts.Label style={s.message}>
                    <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"Generate your itinerary?\n\n"}</Text>
                  </Texts.Label>
                  <Texts.Label style={[s.message, {textAlign:'justify'}]}>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"The"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" more"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" you pick places, the"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" better"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" your generated itinerary will be.\n\nIf you think you"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" picked enough places"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" to generate a satisfying trip, just click the"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" button below"}</Text>
                    <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"!\n\n"}</Text>
                  </Texts.Label>
                </View>
              )
              :
              <View style={s.message}>
                <Texts.Label style={s.message}>
                  <Text style={[s.normalText, {fontSize: 20, color:G.Colors().Highlight()}]}>{"You picked enough places to generate the itinerary!\n\n"}</Text>
                </Texts.Label>
                <Texts.Label style={[s.message, {textAlign:'justify'}]}>
                  <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{"Only the trip leader"}</Text>
                  <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{" can generate the itinerary.\n\nInform the trip leader that you're"}</Text>
                  <Text style={[s.normalText, {color:G.Colors().Highlight()}]}>{" done picking places"}</Text>
                  <Text style={[s.normalText, {color:G.Colors().Neutral(0.6)}]}>{"!"}</Text>
                </Texts.Label>
              </View>
            }
          </View>
          <View style={s.actionContainer}>
            <View style={s.buttonContainer}>
              {getButton((props.isOwner === true ? "Pick more places" : "Got it !"), props.hide, true)}
            </View>
            {props.isOwner === true ?
              <View style={s.buttonContainer}>
                {getButton("Generate my itinerary now!", props.goToItinerary, false)}
              </View>
              :
              <View/>
            }
          </View>
        </View>
      </Popups.Popup>
    </Displayers.Touchable>
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
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:3,
  },
});
