import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Buttons from "../../../Libs/Buttons";
import * as Displayers from "../../../Libs/Displayers";

export default function TileItinerary(props)
{
  const activeNumber = 7;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  const getContent = () =>
  {
    return (
      <View style={[s.contentFrame, {borderColor:props.separatorColor}]}>
        {
          current === true ?
          <Buttons.Label
            shadow
            backgroundHighlight
            color={G.Colors().Foreground()}
            onPress={() => props.goTo("Itinerary")}
            containerStyle={{...G.S.width() }}
            contentStyle={{ ...G.S.height(80), ...G.S.width(), paddingBottom:1, borderWidth:1, borderColor:G.Colors().Foreground(), }}
            chevron={true}
            chevronSize={18}
          >
            <Texts.Label style={{fontSize: 12, color:G.Colors().Foreground()}}>See my itinerary</Texts.Label>
          </Buttons.Label>
          :
          active === false && props.nbDays ?
            <View style={s.explanation}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Text style={{ fontSize: 11, color:G.Colors().Neutral(0.6) }}>
                  You picked
                </Text>
                <Text style={{ fontSize: 16, color:G.Colors().Highlight() }}>
                  {" " + props.nbPicks + "/" + props.nbDays + " "}
                </Text>
                <Text style={{ fontSize: 11, color:G.Colors().Neutral(0.6) }}>
                  places{"\n"}necessary to generate an itinerary{"\n"}to have at least one activity per day
                </Text>
              </Texts.Label>
            </View>
          : 
          <View style={s.explanation}>
            <Texts.Label style={{ ...G.S.width(), fontSize: 11, color:G.Colors().Neutral(0.1) }}>
              Not ready yet, follow the steps above
            </Texts.Label>
          </View>
        }
          <View style={active === false ? s.containerFrameHidden : s.containerFrame}>
            <View style={s.content}>
              <Buttons.Label
                shadow
                backgroundHighlight
                color={G.Colors().Foreground()}
                onPress={() => props.goTo("Itinerary")}
                containerStyle={{...G.S.width() }}
                contentStyle={{ ...G.S.height(80), ...G.S.width(), paddingBottom:1, borderWidth:1, borderColor:G.Colors().Foreground(), }}
                chevron={true}
                chevronSize={18}
              >
                <Texts.Label style={{fontSize: 12, color:G.Colors().Foreground()}}>See my itinerary</Texts.Label>
              </Buttons.Label>
            </View>
          </View>
      </View>);
  };

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3.5} : {}]}>
      <View style={[s.section, {borderColor:props.separatorColor}]}>
        <View style={s.sectionContent}>
          <View style={s.sectionIcon}>
            <Displayers.Icon
              name="go-kart-track"
              type="mci"
              size={28}
              color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
            />
            </View>
            <View style={s.sectionName}>
              <Texts.Label left singleLine
                style={[{ fontSize: 14 }, current === true ? {color: G.Colors().Highlight()} : {color: G.Colors().Neutral(0.1)} ]}
              >
              Itinerary
            </Texts.Label>
          </View>
        </View>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Transparent} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
            size={20}
            type={"mci"}
            color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
          />
        </View>
      </View>
      {getContent()}
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
    aspectRatio:3.5,
    marginTop:-1,
    backgroundColor:G.Colors().Foreground()
  },
  section: {
    ...G.S.center,
    ...G.S.height(),
    flex:3,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
  timeline: {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:10,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    paddingTop:10,
    paddingBottom:10,
  },
  containerFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  containerFrameHidden:
  {
    height:0,
    width:0,
    overflow:'hidden'
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:5,
  },
  empty:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  
  sectionContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:1,
    paddingVertical:10,
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
});