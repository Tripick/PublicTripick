import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";

export default function Title(props)
{
  const originalTitle = "How would you name your trip?";
  const getTitle = () =>
  {
    return props.trip?.name !== null && props.trip?.name !== "" ? props.trip?.name : originalTitle;
  };

  const getHeader = () =>
  {
    return (
      <View style={h.header}>
        <View style={h.backButton}>
          <Buttons.Round
            backgroundBright
            shadow
            name="chevron-left"
            type="mci"
            size={30}
            color={G.Colors().Highlight()}
            onPress={props.goBack}
            adjustPosition={{paddingRight:1}}
          />
        </View>
        <View style={h.addButton}>
          <Buttons.Round
            backgroundBright
            shadow
            action
            size={22}
            color={G.Colors().Highlight()}
            onPress={props.showMenuPopup}
            adjustPosition={{paddingLeft:2}}
          />
        </View>
      </View>
    );
  };

  const getName = () =>
  {
    return (
      <View style={h.titleContainer}>
        <LinearGradient colors={[G.Colors().Black(0), G.Colors().Black(0.5), G.Colors().Black(0.7)]} style={s.fog}/>
        <Texts.Title style={h.title} numberOfLines={2}>
          {getTitle()}
        </Texts.Title>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.imageContainer}>
        <Image
          source={{uri:
            typeof props.trip !== "undefined" &&
            props.trip !== null &&
            props.trip.coverImage !== null &&
            props.trip.coverImage !== ""
              ? props.trip.coverImage : "_",
          }}
          style={{ ...G.S.center, ...G.S.full, zIndex:2 }}
        />
      </View>
      {getHeader()}
      {getName()}
    </View>
  );
}

let h = StyleSheet.create({
  header:
  {
    ...G.S.center,
    height:45,
    ...G.S.width(),
    flexDirection:'row',
    position:'absolute',
    top:0,
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
  },
  titleContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    position:'absolute',
    bottom:0,
  },
  title:
  {
    ...G.S.height(),
    fontSize: 18,
    color: G.Colors().White(),
    marginBottom:5,
    paddingHorizontal:10,
  },
  backButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
    position:'absolute',
    left:0,
  },
  addButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
    position:'absolute',
    right:0,
  },
});

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.shadow(),
    ...G.S.width(),
    aspectRatio:2,
    zIndex:1000,
    overflow:'visible',
  },
  imageContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    position:'absolute',
    top:0,
  },
  fog:
  {
    ...G.S.full,
    position:'absolute',
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection: "row",
    borderRadius: 100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    backgroundColor: G.Colors().Highlight(),
    paddingRight:5,
  },
  title:
  {
    ...G.S.width(),
  },
});
