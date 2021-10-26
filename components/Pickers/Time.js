import * as React from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Time(props) {
  return props.visible === true ? (
    <DateTimePicker
      timeZoneOffsetInMinutes={0}
      value={props.date}
      mode="time"
      is24Hour={true}
      display="clock"
      onChange={props.onChange}
    />
  ) : (
    <View />
  );
}
