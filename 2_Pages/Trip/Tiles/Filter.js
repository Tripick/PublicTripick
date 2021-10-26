import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Slider from '@react-native-community/slider';
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Views from "../../../Libs/Views";
import * as Displayers from "../../../Libs/Displayers";

export default function Filter(props)
{
  const minVal = 1;
  const maxVal = 5;
  const [value, setValue] = React.useState(props.value);
  const [currentValue, setCurrentValue] = React.useState(props.value);

  const valueChanged = (val) =>
  {
    setCurrentValue(val);
    props.onValueChange(props.labelMax, val);
  };

  const increaseValue = () =>
  {
    if (currentValue < maxVal)
    {
      const newVal = currentValue + 1;
      valueChanged(newVal);
      setValue(newVal);
    }
  };

  const decreaseValue = () =>
  {
    if (currentValue > minVal)
    {
      const newVal = currentValue - 1;
      valueChanged(newVal);
      setValue(newVal);
    }
  };

  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={props.showTooltip}>
        <View style={{ flex: 1 }}>
          <Views.Bottom containerStyle={s.icon}>
            <Displayers.Icon
              fa
              name={props.iconMin}
              size={
                20 +
                (props.sizeModifier ? props.sizeModifier : 0)
              }
              color={G.Colors().Neutral()}
            />
          </Views.Bottom>
          <Views.Center containerStyle={s.label}>
            <Texts.Label style={s.labelText}>{props.labelMin}</Texts.Label>
          </Views.Center>
        </View>
      </TouchableWithoutFeedback>
      <View style={s.sliderContainer}>
        <Slider
          minimumValue={minVal}
          maximumValue={maxVal}
          minimumTrackTintColor={G.Colors().Highlight()}
          maximumTractTintColor={G.Colors().Highlight()}
          step={1}
          value={value}
          onValueChange={valueChanged}
          style={s.slider}
          thumbTintColor={
            props.disabled ? G.Colors().Important(0.4) : G.Colors().Highlight()
          }
          disabled={props.disabled}
        />
      </View>
      <TouchableWithoutFeedback onPress={props.showTooltip}>
        <View style={{ flex: 1 }}>
          <Views.Bottom containerStyle={s.icon}>
            <Displayers.Icon
              fa
              name={props.iconMax}
              size={20 + (props.sizeModifier ? props.sizeModifier : 0)}
              color={G.Colors().Neutral()}
            />
          </Views.Bottom>
          <Views.Center containerStyle={s.label}>
            <Texts.Label style={s.labelText}>{props.labelMax}</Texts.Label>
          </Views.Center>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
  },
  sliderContainer:
  {
    ...G.S.center,
    //height:20,
    flex: 3,
    overflow: "visible",
  },
  slider:
  {
    ...G.S.width(),
  },
  icon: {
    ...G.S.center,
    flex: 1,
  },
  label: {
    flex: 1,
  },
  labelText: {
    fontSize: 11,
    color: G.Colors().Neutral(),
  },
});
