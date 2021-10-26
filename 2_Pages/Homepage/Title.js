import React from "react";
import { StyleSheet, View, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";

export default function Title(props)
{
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.titleLine}>
          <Texts.Title left style={s.titleSubtext}>WELCOME ON</Texts.Title>
        </View>
        <View style={s.titleLine}>
          <Texts.Title left style={s.titleText}>Tripick</Texts.Title>
        </View>
      </View>
      <View style={s.iconTripick}>
        <Image source={G.Images.logo} style={s.icon} resizeMode='contain'/>
      </View>
      <View style={s.avatarContainer}>
        <Buttons.RoundImage
          onPress={props.showMenu}
          contentStyle={s.avatar}
          image={
            props.user.photo &&
            props.user.photo !== null &&
            typeof(props.user.photo) != 'undefined'&&
            props.user.photo.image !== null &&
            typeof(props.user.photo.image) != 'undefined' ? props.user.photo.image : "_"
          }
        />
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 4,
    marginTop:5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    position: "absolute",
    left:"5%",
  },
  iconTripick:
  {
    ...G.S.center,
    ...G.S.height(80),
    aspectRatio:1,
    position: "absolute",
  },
  icon:
  {
    ...G.S.height(),
  },
  titleLine:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  titleSubtext:
  {
    ...G.S.width(),
    textAlignVertical: "center",
    fontSize: 12,
    color: G.Colors().Neutral(0.5),
    paddingLeft:10,
  },
  titleText:
  {
    ...G.S.width(),
    textAlignVertical: "center",
    fontSize: 40,
    fontFamily:"clip",
  },
  textTripick:
  {
    ...G.S.center,
    paddingBottom: 5,
  },
  avatarContainer:
  {
    ...G.S.height(70),
    position: "absolute",
    top:0,
    right:4,
    aspectRatio: 1,
  },
  avatar:
  {
    ...G.S.shadow(),
    borderWidth:1.5,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
    overflow:'visible'
  },
});
