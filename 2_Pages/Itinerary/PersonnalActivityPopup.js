import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";
// Components
import PersonnalActivity from "./PersonnalActivity";

export default function PersonnalActivityPopup(props)
{
  const [activity, setActivity] = React.useState(typeof(props.activity) === 'undefined' || props.activity === null ? {} : props.activity);
  const [isValid, setIsValid] = React.useState(false);
  React.useEffect(() => { setActivity(typeof(props.activity) === 'undefined' || props.activity === null ? {} : props.activity); }, [props.activity]);
  React.useEffect(() =>
  {
    setIsValid(typeof(activity) !== 'undefined' && activity !== null &&
    typeof(activity.name) !== 'undefined' && activity.name !== null && activity.name.length >= 3 &&
    typeof(activity.latitude) !== 'undefined' && activity.latitude !== null &&
    typeof(activity.longitude) !== 'undefined' && activity.longitude !== null);
  }, [activity]);

  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:7 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="file-edit-outline"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Day " + (props.day.index + 1)}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n" + G.Functions.dateToText(props.day.date)}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.content}>
          <PersonnalActivity
            day={props.day}
            activity={activity}
            setActivity={setActivity}
            position={props.getDayPosition(props.day)}
          />
        </View>
        <View style={s.footer}>
          <Buttons.Label
            center
            iconRight
            alignWidth
            contentForeground
            backgroundHighlight
            iconName="check"
            type="mci"
            style={s.buttonLabel}
            size={20}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
            iconStyle={{right:10}}
            onPress={() => isValid === true ? props.save(activity) : props.displayMessage("Name and position are required.", 2000, "alert")}
          >
            Apply
          </Buttons.Label>
        </View>
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingTop:30,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:8,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(96),
    flex:1,
    borderWidth:1,
    borderRadius:20,
    borderColor:G.Colors().Neutral(0.2),
    zIndex:1000,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    marginVertical:20,
  },
});
  