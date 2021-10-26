import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function RatingPopup(props)
{
  const icon = G.Images.picksIcon;
  const inactiveIcon = G.Images.picksIconDisabled;

  if(props.show === false)
    return <View/>;
  return (
    <View style={[s.container,{bottom:5}]}>
      <View style={[s.indicator, {paddingBottom:20}]}>
        <View style={s.icon}>
          <Displayers.Icon
            name="thumbs-up-down"
            type="mci"
            size={50}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label bold style={{ fontSize: 16, color:G.Colors().Highlight() }}>
              Would you like to visit this place?
          </Texts.Label>
        </View>
        <View style={s.subtitle}>
          <Texts.Label>
            <Text style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              You picked
            </Text>
            <Text style={{ fontSize: 26, color:G.Colors().Highlight() }}>
              {" "}{props.existingPicksCount}{" "}
            </Text>
            <Text style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              places for your trip so far{"\n"}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.rating}>
          {Platform.OS == "android" ?
            <Displayers.Rating
              iconSize={40}
              noValue
              value={props.currentRating}
              activeImage={icon}
              inactiveImage={inactiveIcon}
            />
            :
            <Displayers.RatingIos
              iconSize={40}
              noValue
              value={props.currentRating}
              activeImage={icon}
              inactiveImage={inactiveIcon}
            />
          }
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(94),
    position: "absolute",
    bottom:0,
    overflow: "visible",
    zIndex:99,
  },
  indicator:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    borderRadius: 25,
    backgroundColor: G.Colors().Foreground(),
    borderWidth:2,
    borderColor:G.Colors().Highlight(),
    zIndex:99,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:20,
    paddingVertical:10,
    marginHorizontal:10,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    marginHorizontal:10,
    paddingVertical:10,
  },
  subtitle:
  {
    ...G.S.center,
    marginHorizontal:10,
    paddingTop:10,
  },
  rating:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:10,
  },
});
