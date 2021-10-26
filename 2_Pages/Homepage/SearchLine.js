import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";

export default function SearchLine(props)
{
  return (
    <View style={s.container}>
      <View style={s.banner}>
        <Image
          source={G.Images.buildings}
          style={s.bannerImage} resizeMode='contain' 
        />
      </View>
      <View style={s.search}>
        <Buttons.Label
          backgroundBright
          iconName="map-marker-plus"
          type="mci"
          color={G.Colors().Foreground()}
          textLeft
          size={20}
          onPress={() => props.goTo("Search")}
          containerStyle={{...G.S.width()}}
          contentStyle={{...G.S.width(), justifyContent:'flex-start', paddingLeft:30, borderWidth:0, borderColor:G.Colors().Foreground(), backgroundColor:G.Colors().Highlight()}}
          iconStyle={{left:12}}
        >
          <Text style={{ fontWeight: "bold", fontSize: 14, color:G.Colors().Foreground() }}>Search</Text>
          <Text style={{ fontSize: 12, color:G.Colors().Foreground() }}> or</Text>
          <Text style={{ fontWeight: "bold", fontSize: 14, color:G.Colors().Foreground() }}> Add</Text>
          <Text style={{ fontSize: 12, color:G.Colors().Foreground() }}> places</Text>
        </Buttons.Label>
        <View style={s.iconGo}>
          <Displayers.Icon
            alignWidth
            dark
            noBackground
            name="chevron-right"
            type="mci"
            size={20}
            color={G.Colors().Foreground()}
          />
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  banner:
  {
    ...G.S.center,
    ...G.S.width(80),
    aspectRatio:5.16,
  },
  bannerImage:
  {
    ...G.S.full,
  },
  search:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:7,
    marginTop:-2,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: "2%",
    position:'absolute',
    right:0,
  },
});
