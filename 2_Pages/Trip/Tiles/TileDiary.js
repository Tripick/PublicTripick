import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native";
// Context
import { AppContext } from "../../../AppContext";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Views from "../../../Libs/Views";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Inputs from "../../../Libs/Inputs";
import * as Displayers from "../../../Libs/Displayers";

export default function TileDiary(props)
{
  const activeNumber = 8;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  const [context, setContext] = React.useContext(AppContext);

  const getContent = () =>
  {
    return (
      <View style={[s.contentFrame, {borderColor:props.separatorColor}]}>
        {
          current === true ?
          <TouchableWithoutFeedback onPress={() => console.log("Go to itinerary")}>
            <View style={[s.explanation, {paddingLeft:10}]}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Text style={{fontSize: 14, color:G.Colors().Highlight(), fontWeight:'bold'}}>Click here </Text>
                <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>to generate your itnerary{"\n"}based on all the travelers' picks of the trip!</Text>
              </Texts.Label>
            </View>
          </TouchableWithoutFeedback> : 
          active === false ?
            <View style={s.explanation}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 11, color:G.Colors().Neutral(0.1) }}>
                Not ready yet, follow the steps above
              </Texts.Label>
            </View>
          : <View />
        }
          <View style={active === false ? s.containerFrameHidden : s.containerFrame}>
            <View style={s.content}>
              <TouchableWithoutFeedback onPress={() => console.log("Go to itinerary")}>
                <View style={s.empty}>
                  <Texts.Label style={{ ...G.S.width() }}>
                    <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>Your</Text>
                    <Text style={{fontSize: 14, color:G.Colors().Highlight(), fontWeight:'bold'}}> Itinerary </Text>
                    <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>is ready!</Text>
                  </Texts.Label>
                </View>
              </TouchableWithoutFeedback>
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
              name="book-open-page-variant"
              type="mci"
              size={28}
              color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
            />
            </View>
            <View style={s.sectionName}>
              <Texts.Label
                left singleLine
                style={[{ fontSize: 14 }, active === false && current === false ? {color: G.Colors().Neutral(0.1)} : {color: G.Colors().Neutral(0.6)} ]}
              >
              Diary
            </Texts.Label>
          </View>
        </View>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Neutral(0)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "check-circle-outline"} //checkbox-blank-circle-outline //check-circle-outline
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