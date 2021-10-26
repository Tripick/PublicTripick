import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Displayers from "../../../Libs/Displayers";
// Components
import PolylinePicker from "./PolylinePicker";

export default function TileAreas(props)
{
  const [showPolylinePicker, setShowPolylinePicker] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const activeNumber = 0;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3.5} : {}]}>
      <View style={s.section}>
        <Displayers.Touchable onPress={() => setShowExplanation(!showExplanation)}>
          <View style={s.sectionContent}>
            <View style={s.sectionIcon}>
              <Displayers.Icon
                name="map-marker-radius"
                type="mci"
                size={32}
                color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
              />
            </View>
            <View style={s.sectionName}>
              <Texts.Label
                left singleLine
                style={[{ fontSize: 12 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
              >
                Area
              </Texts.Label>
            </View>
          </View>
        </Displayers.Touchable>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}/>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "checkbox-marked-circle-outline"} //checkbox-blank-circle-outline //check-circle-outline
            size={20}
            type={"mci"}
            color={G.Colors().Highlight()}
          />
        </View>
      </View>
      <View style={s.contentFrame}>
        {active === false ?
          <TouchableWithoutFeedback onPress={() => setShowPolylinePicker(true)}>
            <View style={s.explanationButton}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Text style={{fontSize: 14, color:G.Colors().Foreground()}}>Select the area to explore</Text>
              </Texts.Label>
            </View>
          </TouchableWithoutFeedback> : 
          <View/>
        }
        <View style={active === false ? s.contentHidden : {}}>
          <View style={s.content}>
            <PolylinePicker
              visible={props.lightMode === true ? false : showPolylinePicker}
              toggle={props.isOwner === true ? setShowPolylinePicker : () => {}}
              trip={props.trip}
              updateTrip={props.updateTrip}
              lineDashPattern={[1]}
            />
          </View>
          <View style={showExplanation === true ? s.explanation : s.contentHidden}>
            <Texts.Label style={{ ...G.S.width(), fontSize: 10, color:G.Colors().Neutral(0.4) }}>
              Area you will explore
            </Texts.Label>
          </View>
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
    flexDirection:"row",
    aspectRatio:2.5,
    backgroundColor:G.Colors().Foreground(),
    zIndex:0
  },
  section:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:3,
  },
  timeline:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:10,
    paddingTop:0,
    paddingBottom:10,
  },
  explanation:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    flex:10,
    paddingLeft:10
  },
  contentHidden:
  {
    height:0,
    width:0,
    overflow:'hidden'
  },
  
  sectionContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:1,
    paddingVertical:5,
  },
  sectionIcon: {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },
  sectionName: {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },

  timelineLine:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  timelineLineMiddle:
  {
    ...G.S.center,
    ...G.S.height(),
    width:1,
    borderLeftWidth: 1.5,
    borderColor: G.Colors().Highlight(),
    marginTop:10
  },
  timelineIcon:
  {
    ...G.S.center,
    width:20,
    aspectRatio:1,
    position: 'absolute'
  },
  explanationButton:
  {
    padding:10,
    paddingHorizontal:15,
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
  },
});
