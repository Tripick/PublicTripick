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
// Components
import Filters from "./Filters";

export default function TilePreferences(props)
{
  const activeNumber = 5;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  const [context, setContext] = React.useContext(AppContext);
  const [showFilters, setShowFilters] = React.useState(false);
  const [loaderVisible, setLoaderVisible] = React.useState(false);

  const onSave = (filterIntense, filterSportive, filterCity, filterFamous, filterFar, filterExpensive) =>
  {
    setShowFilters(false);
    props.updateTrip({
      ...props.trip,
      filtersSet:true,
      filterIntense: filterIntense,
      filterSportive: filterSportive,
      filterCity: filterCity,
      filterFamous: filterFamous,
      filterFar: filterFar,
      filterExpensive: filterExpensive,
    });
  };

  const getContent = () =>
  {
    return (
      <View style={s.contentFrame}>
        <View style={active === false && current === false ? s.containerFrameHidden : s.containerFrame}>
          <View style={s.content}>
            {active === true || current === true ?
              <TouchableWithoutFeedback onPress={() => setShowFilters(true)}>
                <View style={s.empty}>
                  {current === true ? 
                    <Texts.Label style={s.explanationLabel}>
                      <Texts.Label style={{fontSize: 14, color:G.Colors().Highlight()}}>Click here </Texts.Label>
                      <Texts.Label style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>to set your trip</Texts.Label>
                      <Text style={{fontSize: 14, color:G.Colors().Neutral(0.5), fontWeight:'bold'}}> preferences </Text>
                    </Texts.Label>
                  :
                  <View style={s.emptyContainer}>
                    <View style={s.emptyIcon}>
                      <Displayers.Icon
                        name="playlist-check"
                        type="mci"
                        size={25}
                        color={G.Colors().Highlight()}
                      />
                    </View>
                    <View style={s.emptyLabel}>
                      <Texts.Label>
                        <Texts.Label style={{fontSize: 14, color:G.Colors().Highlight()}}>Preferences saved</Texts.Label>
                      </Texts.Label>
                    </View>
                  </View>
                  }
                </View>
              </TouchableWithoutFeedback> : 
              active === false ?
                <View style={s.empty}>
                  <Texts.Label style={[s.explanationLabel, {fontSize: 11, color:G.Colors().Neutral(0.1)}]}>
                    Not ready yet, follow the steps above
                  </Texts.Label>
                </View>
              : <View />
            }
          </View>
        </View>
        <Filters
          height={97}
          width={95}
          name="Preferences"
          icon="options"
          iconType=""
          show={showFilters}
          hide={() => setShowFilters(false)}
          save={onSave}
          loaderVisible={loaderVisible}
          trip={props.trip}
        />
      </View>);
  };

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3.5} : {}]}>
    <View style={s.section}>
        <View style={s.sectionContent}>
          <View style={s.sectionIcon}>
            <Displayers.Icon
              name="options"
              size={28}
              color={current === true ? G.Colors().Highlight() : (active === false ? G.Colors().Neutral(0.1) : G.Colors().Neutral(0.5))}
            />
            </View>
            <View style={s.sectionName}>
              <Texts.Label
                left singleLine
                style={[{ fontSize: 11 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
              >
              Preferences
            </Texts.Label>
          </View>
        </View>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
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
    aspectRatio:4,
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
  explanation:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop:3,
  },
  explanationLabel:
  {
    ...G.S.width(),
  },
  containerFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  containerFrameHidden:
  {
    ...G.S.grid,
    height:0,
    width:0,
    overflow:'hidden',
    flex:0,
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
  emptyContainer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:'row',
  },
  emptyIcon:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    marginLeft:10,
  },
  emptyLabel:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:5,
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