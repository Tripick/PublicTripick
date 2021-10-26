import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function StepPlace(props)
{
  const scaleFactor = props.zoomed === true ? 2 : 1;
  let stepName = props.place.nameTranslated;

  return (
    <View style={s.container}>
      <View style={[s.backFrame, {borderWidth:scaleFactor}]}/>
      <View style={s.title}>
        <Texts.Label style={{ ...G.S.width(), fontSize: 11*scaleFactor, color:G.Colors().Highlight() }}>
          {stepName.length > 40 ? stepName.substring(0, 40) +"..." : stepName}
        </Texts.Label>
      </View>
      <View style={s.rating}>
        {Platform.OS == "android" ? 
          <Displayers.Rating
            iconSize={30}
            value={props.place.rating}
            color={G.Colors().Highlight()}
            labelStyle={{fontSize:20, paddingTop:4}}
            votes={"("+props.place.nbRating+")"}
          />
          :
          <Displayers.RatingIos
            iconSize={30}
            value={props.place.rating}
            color={G.Colors().Highlight()}
            labelStyle={{fontSize:20, paddingTop:4}}
            votes={"("+props.place.nbRating+")"}
          />
        }
      </View>
      <View style={[s.checkVisit, {marginRight:5*scaleFactor}]}>
        <View style={[s.timelineIcon, {width:20*scaleFactor}]}>
          <Displayers.Icon
            name={"file-eye-outline"}
            type={"mci"}
            size={20*scaleFactor}
            color={G.Colors().Highlight()}
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
    aspectRatio:5,
    overflow:'visible',
  },
  backFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(),
    position:'absolute',
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingTop:15,
  },
  rating:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingBottom:15,
    marginBottom:8,
  },
  checkVisit:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
    position:'absolute',
    right:0,
  },
  flagLine:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingLeft:5,
    paddingRight:"5%",
  },
  timelineLine:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop:-0.3
  },
  timelineLineMiddle:
  {
    ...G.S.center,
    ...G.S.height(),
    width:1,
    borderWidth: 1,
    borderRadius: 1,
    borderStyle: 'dotted',
    borderColor: G.Colors().Green(),
    marginTop:10,
  },
  timelineIcon:
  {
    ...G.S.center,
    aspectRatio:1,
    position: 'absolute'
  },
});