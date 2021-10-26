import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
// Components
import PersonnalActivityReadOnly from "./PersonnalActivityReadOnly";

export default function PersonnalActivityPopupReadOnly(props)
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
      containerStyle={{ ...G.S.width(96) }}
      style={{ paddingBottom:15 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={[s.container, {paddingTop:20}]}>
        <View style={[s.content, {borderWidth:0}]}>
          <PersonnalActivityReadOnly
            activity={activity}
            setActivity={setActivity}
            position={props.getDayPosition(props.day)}
          />
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
    ...G.S.width(),
    paddingTop:30,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(96),
    borderWidth:1,
    borderRadius:20,
    borderColor:G.Colors().Neutral(0.2),
    zIndex:1000,
  },
});
  