import * as React from "react";
import { StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";

export default function Date(props)
{
  const [newDate, setNewDate] = React.useState(props.date);
  React.useEffect(() =>
  {
    setNewDate(props.date);
  }, [props.date]);
  const changeDate = (e, date) =>
  {
    setNewDate(date);
  }

  const getDatePickerAndroid = () =>
  {
    return (
      <DateTimePicker
        //style={Platform.OS == "android" ? {} : {...G.S.center, ...G.S.full, aspectRatio:2}}
        {...props}
        timeZoneOffsetInMinutes={0}
        value={props.date}
        mode="date"
        is24Hour={true}
        display="spinner"
        onChange={props.onChange}
        minimumDate={props.minimumDate}
        maximumDate={props.maximumDate}
      />
    );
  }

  const getDatePickerIOS = () =>
  {
    return (
      <Popups.Popup
        transparent={true}
        containerStyle={{ ...G.S.height(40), ...G.S.width(90) }}
        visible={props.visible}
        hide={props.hide}
      >
        <View style={popup.container}>
          <View style={popup.title}>
            <Texts.Label style={{ fontSize: 16, color:G.Colors().Highlight() }}>
              {props.title}
            </Texts.Label>
          </View>
          <View style={popup.input}>
            <DateTimePicker
              style={{...G.S.center, ...G.S.width(), aspectRatio:2}}
              timeZoneOffsetInMinutes={0}
              value={newDate}
              mode="date"
              is24Hour={true}
              display="spinner"
              onChange={changeDate}
            />
          </View>
          <View style={popup.buttons}>
            <Buttons.Round
              shadow
              backgroundHighlight
              name="check"
              type="mci"
              size={25}
              color={G.Colors().Background()}
              onPress={() => props.onChange(null, newDate)}
              contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground()}}
            />
          </View>
        </View>
      </Popups.Popup>
    );
  }

  return props.visible != true ?
    <View /> :
    Platform.OS == "android" ? getDatePickerAndroid() : getDatePickerIOS();
}

let popup = StyleSheet.create({
  container:
  {
    ...G.S.full,
    padding:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingHorizontal:"5%",
  },
  input:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:4,
    // borderRadius: 8,
    // borderWidth:1,
    // borderRadius:7,
    // borderColor:G.Colors().Neutral(0.1),
    // backgroundColor:G.Colors().Background(0.5),
  },
  inputField:
  {
    ...G.S.full,
    padding: 10,
    textAlign: "left",
    textAlignVertical: "top",
    color: G.Colors().Neutral(),
    fontSize: 14,
  },
  buttons: {
    ...G.S.center,
    height:60,
    ...G.S.width(),
  },
});
