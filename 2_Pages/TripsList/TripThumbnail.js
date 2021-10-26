import React from "react";
import {StyleSheet, View, TouchableWithoutFeedback, Image} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function TripThumbnail(props)
{
  if (typeof props.trip === "undefined" || props.trip === null) return <View />;
  return (
    <View style={s.container}>
      <TouchableWithoutFeedback onPress={() => props.onTripClick(props.trip?.id)} >
        <View style={s.content}>
          <View style={s.contentFrame}>
            <View style={s.imageContainer}>
              <View style={s.imageFrame}>
                <Image style={s.image} source={{ uri: typeof props.trip !== "undefined" && props.trip !== null && props.trip?.coverImage !== null && props.trip?.coverImage !== "" ? props.trip?.coverImage : "_" }}/>
              </View>
            </View>
            <View style={s.description}>
              <View style={s.dates}>
                <View style={{ ...G.S.center, flex: 5 }}>
                  <Texts.Label style={s.dateText} >
                    {props.trip?.startDate === null ? "-" : G.Functions.dateToText(props.trip?.startDate)}
                  </Texts.Label>
                </View>
                <View style={{ ...G.S.center, flex: 1 }}>
                  <Displayers.Icon
                    alignWidth
                    dark
                    noBackground
                    name="chevron-forward"
                    size={15}
                    color={G.Colors().Neutral(0.5)}
                  />
                </View>
                <View style={{ ...G.S.center, flex: 5 }}>
                  <Texts.Label style={s.dateText} >
                    {props.trip?.endDate === null ? "-" : G.Functions.dateToText(props.trip?.endDate)}
                  </Texts.Label>
                </View>
              </View>
              <View style={s.title}>
                <Texts.Label style={{ ...G.S.width(), fontSize: 16 }} numberOfLines={3} >
                  {props.trip?.name}
                </Texts.Label>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 3,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  content:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    flex: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: G.Colors().Transparent,
    backgroundColor: G.Colors().Foreground(),
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection: "row",
    borderRadius: 15,
    padding: 5,
  },
  containerTimeline:
  {
    ...G.S.center,
  },
  contentTimeline:
  {
    flexDirection: "row",
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 7,
  },
  imageContainer:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.height(),
    aspectRatio:1.2,
    borderRadius: 12,
  },
  imageFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 12,
  },
  image:
  {
    ...G.S.full,
    position: "absolute",
  },
  description:
  {
    ...G.S.center,
    flex: 7,
  },
  dates:
  {
    ...G.S.width(),
    flexDirection: "row",
    flex: 1,
    position: "absolute",
    top: 5,
  },
  dateText:
  {
    fontSize: 10,
    color: G.Colors().Neutral(0.6)
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal: 10,
    flex: 2,
  },
});
