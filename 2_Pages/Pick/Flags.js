import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";

export default function Flags(props)
{
  const getFlag = (flag, index) =>
  {
    return (
      <View key={index} style={s.flagContainer}>
        <View style={s.flag}>
          <View style={s.iconContainer}>
            <Displayers.Icon
              type="mci"
              name={flag.config.icon}
              size={25}
              color={G.Colors().Neutral(0.6)}
            />
          </View>
        </View>
        <View style={s.label}>
          <Text style={s.textName}>{flag.config.name}</Text>
        </View>
        <View style={s.value}>
          <Text style={s.text}>{G.Functions.displayFlag(flag)}</Text>
        </View>
      </View>
    );
  };

  const getArrow = (isRight) => 
  (
    <View style={[s.arrow, isRight ? { right: 0 } : { left: 0 }]}>
      <View style={{ ...G.S.height(), ...G.S.center }}>
        <Displayers.Icon
          name={isRight ? "chevron-right" : "chevron-left"}
          type="mci"
          size={20}
          color={G.Colors().Important(0.6)}
        />
      </View>
    </View>
  );
  
  if(props.place.flags.length <= 0)
    return (<View/>);
  return (
    <View style={{ ...G.S.width() }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={s.container}
        contentContainerStyle={{ ...G.S.center, flexGrow: 1, }}
      >
        {props.place.flags.map((flag, index) => getFlag(flag, index))}
      </ScrollView>
      {props.place.flags.length > 5 ? getArrow() : <View />}
      {props.place.flags.length > 5 ? getArrow(true) : <View />}
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.width(),
    flexDirection: "row",
  },
  flagContainer:
  {
    ...G.S.center,
    width:G.Layout.window.width/5-2,
    aspectRatio:1,
  },
  flag:
  {
    ...G.S.center,
    flexDirection: "row",
  },
  label:
  {
    ...G.S.center,
  },
  value:
  {
    ...G.S.center,
  },
  iconContainer:
  {
    ...G.S.center,
  },
  textName:
  {
    textAlign: "center",
    fontSize: 10,
    color: G.Colors().Important(0.6),
  },
  text:
  {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: G.Colors().Important(0.6),
  },
  arrow:
  {
    ...G.S.height(),
    ...G.S.center,
    position: "absolute",
    width: "5%",
    flexDirection: "row",
  },
});
