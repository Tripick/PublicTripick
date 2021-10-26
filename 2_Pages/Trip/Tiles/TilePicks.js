import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Buttons from "../../../Libs/Buttons";
import * as Displayers from "../../../Libs/Displayers";

export default function TilePicks(props)
{
  const activeNumber = 6;
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
            alignWidth
            backgroundHighlight
            color={G.Colors().Foreground()}
            onPress={() => props.goTo("PickBrowser")}
            containerStyle={{...G.S.width(), aspectRatio:4.5 }}
            contentStyle={{ ...G.S.full, paddingBottom:1, borderWidth:1, borderColor:G.Colors().Foreground() }}
            chevron={true}
            chevronSize={18}
          >
            <Texts.Label style={{...G.S.width(), fontSize: 12, color:G.Colors().Foreground()}}>Pick places</Texts.Label>
          </Buttons.Label>
          :
          (active === true ?
            <Buttons.Label
              shadow
              backgroundBright
              color={G.Colors().Highlight()}
              onPress={() => props.goTo("PickBrowser")}
              containerStyle={{...G.S.width() }}
              contentStyle={{ ...G.S.height(80), ...G.S.width(), paddingBottom:1, borderWidth:1, borderColor:G.Colors().Highlight(), }}
              chevron={true}
              chevronSize={18}
            >
              <Texts.Label style={{...G.S.width(), fontSize: 12, color:G.Colors().Highlight()}}>Pick places</Texts.Label>
            </Buttons.Label>
            :
            <View style={s.explanation}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 11, color:G.Colors().Neutral(0.1) }}>
                Not ready yet, follow the steps above
              </Texts.Label>
            </View>)
        }
      </View>);
  };

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3} : {}]}>
      <View style={[s.section, {borderColor:props.separatorColor}]}>
        <View style={s.sectionContent}>
          <View style={s.sectionIcon}>
            <Displayers.Icon
              name="podium-gold"
              type="mci"
              size={28}
              color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
            />
            </View>
            <View style={s.sectionName}>
              <Texts.Label
                left singleLine
                style={[{ fontSize: 12 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
              >
              Pick
            </Texts.Label>
          </View>
        </View>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, {borderColor: G.Colors().Neutral(0)}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={"checkbox-blank-circle-outline"} //checkbox-blank-circle-outline //check-circle-outline
            size={20}
            type={"mci"}
            color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()} // G.Colors().Neutral(0.5) // G.Colors().Highlight()
          />
        </View>
      </View>
      {getContent()}
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
    aspectRatio:3,
    marginTop:-1,
    backgroundColor:G.Colors().Foreground()
  },
  section:
  {
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
    paddingVertical:20,
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
  sectionIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },
  sectionName:
  {
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