import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";

/*
  <Wrappers.CircleOverlay name="go-kart-track" type="mci" color={G.Colors().Highlight()} />
*/
export default function CircleOverlay(props)
{
  const [size, setSize] = React.useState(10);
  const strokeWidth = size / 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[s.container, {backgroundColor:props.backgroundColor}, props.containerStyle ? props.containerStyle : {}]}>
      <View style={s.bunked}>
        <Displayers.Icon
          name={props.name}
          type={props.type}
          size={props.size}
          color={props.iconColor}
        />
      </View>
      <View
        style={[s.bunked, {transform: [{ rotate: '-90deg'}]}]}
      >
        <View style={s.fog}
        onLayout={(event) => setSize(event.nativeEvent.layout.height)}>
          <Svg style={props.fogModifier ? props.fogModifier : {}}>
            <Circle
              stroke={props.fogColor}
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={-circumference * (props.percent / 100)}
            />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.height(75),
    ...G.S.shadow(3),
    aspectRatio:1,
    borderRadius:100,
    margin: 5,
  },
  bunked:
  {
    ...G.S.center,
    ...G.S.full,
    position:'absolute',
  },
  fog:
  {
    ...G.S.center,
    ...G.S.height(90),
    ...G.S.width(90),
    marginLeft:-0.7,
    marginBottom:-0.4,
  },
});
