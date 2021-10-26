import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
// Components
import TouchableOverlay from "./TouchableOverlay";

export default function RatingIos(props)
{
  const [value, setValue] = React.useState(props.value);
  const [containerHeight, setContainerHeight] = React.useState(0);
  React.useEffect(() => { setValue(props.value); }, [props.value]);

  const getTouchable = (val) =>
  {
    return (props.onPress ? <TouchableOverlay onPress={() => props.onPress(val)}/> : <View/>);
  };

  const ACTIVE_IMAGE = props.activeImage ? props.activeImage : G.Images.star;
  const INACTIVE_IMAGE = props.inactiveImage ? props.inactiveImage : G.Images.starDisabled;
  //const iconSize = props.iconSize ? props.iconSize : 40;
  const iconSize = containerHeight;
  let ratingPercent = value - Math.floor(value) === 0 ? 0 : Math.trunc((value - Math.floor(value-0.01)) * 100);
  let maxRating = 5;
  const topText = -iconSize/3;
  let stars = [];
  for (let i = 1; i <= maxRating; i++)
  {
    stars.push(
      i <= value ? (
        <View key={i} style={[s.starPlace, { height: iconSize, width: iconSize }]}>
          <Text style={{ height: iconSize, width: iconSize }}>
            <Image
              source={ACTIVE_IMAGE}
              style={[s.starImage, { height: iconSize, width: iconSize }]}
              resizeMode="contain"
            />
          </Text> 
          {getTouchable(i)}
        </View>
      ) : i >= value + 1 ? (
        <View key={i} style={[s.starPlace, { height: iconSize, width: iconSize }]}>
          <Text style={{height: iconSize, width: iconSize}}>
            <Image
              source={INACTIVE_IMAGE}
              style={[s.starImage, { height: iconSize, width: iconSize }]}
              resizeMode="contain"
            />
            {"\n"}
          </Text>
          {getTouchable(i)}
        </View>
      ) : (
        <View key={i} style={[s.starPlace, { height: iconSize, width: iconSize }]}>
          <View style={[s.starContainer, { height: iconSize, width: ratingPercent + "%" }]}>
            <Text style={{height: iconSize, width: iconSize}}>
              <Image
                source={ACTIVE_IMAGE}
                style={[s.starImage, { height: iconSize, width: iconSize }]}
                resizeMode="contain"
              />
              {"\n"}
            </Text>
            {getTouchable(i)}
          </View>
          <View style={[s.starContainerRight, { height: iconSize, width: 100 - ratingPercent + "%" }, ]}>
            <Text style={{height: iconSize, width: iconSize}}>
              <Image
                source={INACTIVE_IMAGE}
                style={[s.starImage, { height: iconSize, width: iconSize }]}
                resizeMode="contain"
              />
              {"\n"}
            </Text>
            {getTouchable(i)}
          </View>
        </View>
      )
    );
  }
  if(props.test === true)
    console.log("Value = " + (props.noValue === true || value < 0 ? " " : (Math.trunc(value * 10) / 10)));
  return (
    <View style={s.container}>
      <View style={{...G.S.center, ...G.S.height()}}>
        <Texts.Label right style={[s.label, props.color ? {color:props.color}: {}, props.labelStyle ? props.labelStyle : {}]}>
          {props.noValue === true || value < 0 ? " " : (Math.trunc(value * 10) / 10)}
        </Texts.Label>
      </View>
      <View style={{ ...G.S.center, ...G.S.height(), flexDirection: "row", paddingTop:3, }}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {containerHeight === 0 ? <View/> : stars.map((star) => { return star;})}
      </View>
      <View style={{...G.S.center, ...G.S.height()}}>
        <Texts.Label left style={[s.label, {paddingLeft:5, paddingRight:0,}, props.color ? {color:props.color} : {}, props.labelStyle ? props.labelStyle : {}]}>
          {props.noValue === true || props.votes < 0 ? " " : props.votes}
        </Texts.Label>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    flexDirection: "row",
  },
  itemRating:
  {
    ...G.S.center,
    flexDirection: "row",
  },
  starImage:
  {
  },
  textImg:
  {
    position:'absolute',
  },
  starPlace:
  {
    flexDirection: "row",
  },
  starContainer:
  {
    ...G.S.center,
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  label:
  {
    paddingRight: 5,
    fontSize: 12,
    color: G.Colors().Foreground(),
  },
});
s.starContainerRight = {
  ...s.starContainer,
  justifyContent: "flex-end",
};
