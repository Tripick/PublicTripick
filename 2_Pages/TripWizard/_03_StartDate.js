import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";
import * as Pickers from "../../Libs/Pickers";

export default function _03_StartDate(props)
{
  const [errorMessage, setErrorMessage] = React.useState("");
  const [date, setDate] = React.useState(props.trip?.startDate);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [dirty, setDirty] = React.useState(typeof props.trip?.startDate === 'undefined' || props.trip?.startDate === null);

  const getButton = (text, onPress, isAlt, isDeactivated) =>
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

  const onSetDate = (e, newDate) =>
  {
    if(typeof(newDate) == 'undefined' || newDate === null)
      setShowDatePicker(false);
    else
    {
      setDirty(true);
      setShowDatePicker(false);
      setDate(newDate);
    }
  }
  const saveAndNext = () =>
  {
    if(typeof(date) == 'undefined' || date === null)
      setErrorMessage("Error.");
    else if(dirty === false)
      props.next();
    else
      props.updateTrip({...props.trip, startDate: date});
  };

  const dateObj = G.Functions.toMoment(date === null ? G.Functions.tomorrow() : date);
  
  return (
    <View style={s.container}>
      <View style={s.content}>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 16, color:G.Colors().Neutral(0.6)}]}>{"When can you start visiting the area?\n\n\n"}</Text>
        </Texts.Label>
        <View style={s.inputContainer}>
          <View style={s.inputContent}>
            <View style={s.date}>
              <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
                {typeof dateObj !== "undefined" && dateObj !== null ? G.Functions.dateToText(dateObj, "MMM Do") : "-"}
              </Texts.Label>
              <Texts.Label style={{ fontSize: 12, color: G.Colors().Neutral(0.4) }}>
                {typeof dateObj !== "undefined" && dateObj !== null ? G.Functions.dateToText(dateObj, "YYYY") : ""}
              </Texts.Label>
            </View>
            <Displayers.TouchableOverlay onPress={() => setShowDatePicker(true)} />
          </View>
        </View>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 12, color:G.Colors().Fatal}]}>{"\n" + errorMessage}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Select my starting position", saveAndNext, false, false)}
        </View>
      </View>
      <Pickers.Date
        title={"Start date"}
        visible={showDatePicker}
        hide={() => setShowDatePicker(false)}
        onChange={onSetDate}
        date={dateObj}
      />
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
  inputContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
  },
  inputContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(0.6),
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
  date:
  {
    ...G.S.center,
    ...G.S.height(),
    marginHorizontal:10,
    flex:1,
  },
});
