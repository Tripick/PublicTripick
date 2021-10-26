import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Step(props)
{
  const scaleFactor = props.zoomed === true ? 2 : 1;
  const isActive = props.isActive;
  const isFirst = props.isFirst;
  const isLastActive = props.isLastActive;
  const isLast = props.isLast;
  let pick = props.step.visit;
  const isPersonnal = typeof(pick) === 'undefined' || pick === null;
  let stepName = props.step.name !== null && props.step.name.length > 0 ? props.step.name : pick?.place?.nameTranslated;
  let stepSubname = isPersonnal === false && props.step.name !== null && props.step.name.length > 0 ?
    pick?.place?.nameTranslated
    :
    (
      isPersonnal === true && props.step.description !== null && props.step.description.length > 0 ?
        props.step.description
        :
        null
  );
  const time = typeof(props.step.time) === 'undefined' || props.step.time === null ? "00:00" : G.Functions.dateOnlyTime(props.step.time);

  return (
    <View style={s.container}>
      <View style={[s.backFrame, {borderWidth:1*scaleFactor}]}/>
      <View style={s.hour}>
        <Displayers.Touchable
          style={{...G.S.center, ...G.S.full}}
          onPress={() => props.setStepToEditTime(props.step)}
        >
          <Texts.Label right numberOfLines={scaleFactor} style={{ ...G.S.width(), fontSize: 11*scaleFactor, color: G.Colors().Neutral(0.6)}}>
            {time === "00:00" ? "00:00" : time}
          </Texts.Label>
        </Displayers.Touchable>
      </View>
      <View style={s.timeline}>
        <Displayers.Touchable
            style={{...G.S.center, ...G.S.full}}
            onPress={() => props.setStepToZoom(props.step)}
          >
          <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, isFirst === true ? {borderColor: G.Colors().Neutral(0)} : isActive === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
          <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, isLast === true ? {borderColor: G.Colors().Neutral(0)} : isActive === false || isLastActive === true ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
          <View style={[s.timelineIcon, {width:20*scaleFactor}]}>
            <Displayers.IconRound
              name="circle"
              size={24*scaleFactor}
              type={"mci"}
              color={isActive === false ? G.Colors().Neutral(0.1) : G.Colors().Green()}
            />
          </View>
          <View style={[s.timelineIcon, {width:20*scaleFactor}]}>
            <View style={{ height:7*scaleFactor, aspectRatio:1, marginBottom:5*scaleFactor, borderRadius:10, backgroundColor:G.Colors().Green() }}/>
          </View>
          <View style={[s.timelineIcon, {width:20*scaleFactor}]}>
            <Texts.Label style={{ paddingBottom:1, borderRadius:10, backgroundColor:G.Colors().Green(0) }}>
              <Text style={{fontSize: 11*scaleFactor, color:G.Colors().Foreground()}}>{props.step.index + 1}</Text>
            </Texts.Label>
          </View>
        </Displayers.Touchable>
      </View>
      <View style={s.content}>
        <View style={s.placeName}>
          <Displayers.Touchable
            style={{...G.S.center, ...G.S.full}}
            onPress={() => props.setStepToEditName(props.step)}
          >
            <Texts.Label left singleLine style={{ ...G.S.width() }}>
              <Text style={{fontSize: 11*scaleFactor, color:G.Colors().Highlight()}}>{stepName}</Text>
            </Texts.Label>
            {stepSubname === null ? <View/> : 
              <Texts.Label left singleLine style={{ ...G.S.width() }}>
                <Text style={{fontSize: 10*scaleFactor, color:G.Colors().Grey()}}>
                  {stepSubname}
                </Text>
              </Texts.Label>
            }
          </Displayers.Touchable>
        </View>
      </View>
      <View style={[s.checkVisit, {marginRight:5*scaleFactor}]}>
        <View style={[s.timelineIcon, {width:25*scaleFactor}]}>
          <Displayers.Touchable onPress={() => isPersonnal === true ? props.setPersonnalToDisplay(props.step) : props.setPlaceToDisplay(props.step.visit?.place?.id)}>
            <Displayers.Icon
              name={isPersonnal === true ? "file-eye" : "file-eye-outline"}
              type={"mci"}
              size={25*scaleFactor}
              color={G.Colors().Highlight()}
            />
          </Displayers.Touchable>
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(96),
    flexDirection:"row",
    aspectRatio:5.5,
    paddingHorizontal:5,
    overflow:'visible',
  },
  backFrame:
  {
    ...G.S.center,
    ...G.S.height(80),
    ...G.S.width(),
    position:'absolute',
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
  },
  hour:
  {
    ...G.S.center,
    ...G.S.height(80),
    aspectRatio:0.9,
    flexDirection:'row',
  },
  timeline:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
    overflow:'visible',
  },
  checkVisit:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.height(80),
    flex:1,
    paddingRight:5,
  },
  placeName:
  {
    ...G.S.center,
    ...G.S.full,
    flex:1,
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