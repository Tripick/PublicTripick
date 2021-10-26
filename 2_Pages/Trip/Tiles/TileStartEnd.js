import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Pickers from "../../../Libs/Pickers";
import * as Displayers from "../../../Libs/Displayers";
// Components
import LocationPicker from "./LocationPicker";

export default function TileStartEnd(props)
{
  const current = props.activeStep === props.activeNumber;
  const active = props.activeStep > props.activeNumber;

  // Explanation
  const [showExplanation, setShowExplanation] = React.useState(false);

  const [currentDate, setCurrentDate] = React.useState(false);
  const onSetDate = (e, newDate) =>
  {
    if(newDate === null || typeof(newDate) == 'undefined')
      props.setShowDatePicker(false);
    else if(current === true)
    {
      props.setShowDatePicker(false);
      setCurrentDate(newDate);
      setShowPointPicker(true);
    }
    else
      props.onDate(newDate);
  }

  const [showPointPicker, setShowPointPicker] = React.useState(false);
  const onPoint = (latitude, longitude, latitudeDelta, longitudeDelta) =>
  {
    setShowPointPicker(false);
    if(props.type === "Start")
      props.updateTrip({
        ...props.trip,
        startDate: current === true ? currentDate : props.trip.startDate,
        startLatitude: latitude,
        startLongitude: longitude,
        startLatitudeDelta: latitudeDelta,
        startLongitudeDelta: longitudeDelta,
      });
    else
      props.updateTrip({
        ...props.trip,
        endDate: current === true ? currentDate : props.trip.endDate,
        endLatitude: latitude,
        endLongitude: longitude,
        endLatitudeDelta: latitudeDelta,
        endLongitudeDelta: longitudeDelta,
      });
  };

  const getContent = () =>
  {
    return (
      <View style={[s.contentFrame, {borderColor:props.separatorColor}]}>
        {
          current === true ?
          <TouchableWithoutFeedback onPress={props.isOwner === true ? () => props.setShowDatePicker(true) : () => {}}>
            <View style={s.explanationButton}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Texts.Label style={{fontSize: 14, color:G.Colors().Foreground()}}>{props.type} date and location</Texts.Label>
              </Texts.Label>
            </View>
          </TouchableWithoutFeedback>
          :
          active === false ?
            <View style={[s.explanation, {paddingLeft:10}]}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 11, color:G.Colors().Neutral(0.1) }}>
                Not ready yet, follow the steps above
              </Texts.Label>
            </View>
          : <View />
        }
        <View style={active === false ? s.contentHidden : s.content}>
          <View style={s.inside}>
            <View style={s.date}>
              <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
                {typeof props.trip !== "undefined" &&
                props.trip !== null &&
                typeof dateObj !== "undefined" &&
                dateObj !== null
                  ? G.Functions.dateToText(dateObj, "MMM Do")
                  : "-"}
              </Texts.Label>
              <Texts.Label style={{ fontSize: 12, color: G.Colors().Neutral(0.4) }}>
                {typeof props.trip !== "undefined" &&
                props.trip !== null &&
                typeof dateObj !== "undefined" &&
                dateObj !== null
                  ? G.Functions.dateToText(dateObj, "YYYY")
                  : ""}
              </Texts.Label>
              <Displayers.TouchableOverlay onPress={props.isOwner === true ? () => props.setShowDatePicker(true) : () => {}} />
            </View>
            {props.lightMode === true ? <View/> :
              <View style={s.map}>
                <LocationPicker
                  helpMessage={props.type === "Start" ? "Move the map to indicate where your trip will start" : "Move the map to indicate where your trip will end"}
                  showPointPicker={showPointPicker}
                  setShowPointPicker={setShowPointPicker}
                  onPoint={onPoint}
                  latitude={props.type === "Start" ?
                    (props.trip?.startLatitude !== null ? props.trip?.startLatitude : (props.trip?.region !== null && typeof(props.trip.region.latitude) !== 'undefined' ? props.trip?.region.latitude : 12.5)) :
                    (props.trip?.endLatitude !== null ? props.trip?.endLatitude : (props.trip?.region !== null && typeof(props.trip.region.latitude) !== 'undefined' ? props.trip?.region.latitude : 12.5))}
                  longitude={props.type === "Start" ?
                    (props.trip?.startLongitude !== null ? props.trip?.startLongitude : (props.trip?.region !== null && typeof(props.trip.region.longitude) !== 'undefined' ? props.trip?.region.longitude : 2.40)) :
                    (props.trip?.endLongitude !== null ? props.trip?.endLongitude : (props.trip?.region !== null && typeof(props.trip.region.longitude) !== 'undefined' ? props.trip?.region.longitude : 2.40))}
                  latitudeDelta={props.type === "Start" ?
                    (props.trip?.startLatitudeDelta !== null ? props.trip?.startLatitudeDelta : (props.trip?.region !== null ? props.trip?.region.latitudeDelta : 146.47173179144855)) :
                    (props.trip?.endLatitudeDelta !== null ? props.trip?.endLatitudeDelta : (props.trip?.region !== null ? props.trip?.region.latitudeDelta : 146.47173179144855))}
                  longitudeDelta={props.type === "Start" ?
                    (props.trip?.startLongitudeDelta !== null ? props.trip?.startLongitudeDelta : (props.trip?.region !== null ? props.trip?.region.longitudeDelta : 126.56148176640272)) :
                    (props.trip?.endLongitudeDelta !== null ? props.trip?.endLongitudeDelta : (props.trip?.region !== null ? props.trip?.region.longitudeDelta : 126.56148176640272))}
                  drawPolygon={true}
                  polygon={props.trip?.polygon !== null ? props.trip?.polygon : []}
                  readOnly={!props.isOwner}
                />
              </View>
            }
          </View>
          <View style={showExplanation === true ? s.explanation : s.contentHidden}>
            <Texts.Label style={{ ...G.S.width(), fontSize: 10, color:G.Colors().Neutral(0.4) }}>
              {
                props.type === "Start" ?
                "Start date and location" :
                "End date and location"
              } 
            </Texts.Label>
          </View>
        </View>
      </View>);
  };

  const dateObj = G.Functions.toMoment(
    props.type === "Start" ?
    (props.trip?.startDate === null ? G.Functions.tomorrow() :  props.trip?.startDate) :
    (props.trip?.endDate === null ? G.Functions.addDays(props.trip?.startDate, 7) :  props.trip?.endDate));
  
  return (
    <View style={[s.container, props.activeStep <= props.activeNumber ? {aspectRatio:3.5} : {}]}>
      <View style={[s.section, {borderColor:props.separatorColor}]}>
        <Displayers.Touchable onPress={() => setShowExplanation(!showExplanation)}>
          <View style={s.sectionContent}>
            <View style={s.sectionIcon}>
              <Displayers.Icon
                name={props.type === "Start" ? "flag-triangle" : "flag-variant"}
                type="mci"
                size={28}
                color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
              />
            </View>
            <View style={s.sectionName}>
              <Texts.Label
                left singleLine
                style={[{ fontSize: 12 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
              >
                {props.type}
              </Texts.Label>
            </View>
          </View>
        </Displayers.Touchable>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "checkbox-marked-circle-outline"}
            size={20}
            type={"mci"}
            color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
          />
        </View>
      </View>
      {getContent()}
      <Pickers.Date
        title={props.type === "Start" ? "Start date" : "End date"}
        visible={props.showDatePicker}
        hide={() => props.setShowDatePicker(false)}
        onChange={onSetDate}
        date={dateObj}
        minimumDate={props.type === "Start" ? null : G.Functions.addDays(props.trip?.startDate, 1)}
        maximumDate={props.type === "Start" ? null : G.Functions.addDays(props.trip?.startDate, G.Constants.maxTripLength - 1)}
      />
    </View>
  );
}

let s = StyleSheet.create({
  container: {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
    aspectRatio:2.5,
    marginTop:-1,
    backgroundColor:G.Colors().Foreground(),
  },
  section:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:3,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
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
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    paddingVertical:10,
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
    flex:1,
  },
  contentHidden:
  {
    height:0,
    width:0,
    flex:0,
    overflow:'hidden'
  },
  inside:
  {
    ...G.S.center,
    flex:10,
    flexDirection:"row",
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

  date:
  {
    ...G.S.center,
    ...G.S.height(),
    marginHorizontal:10,
    flex:1,
  },
  map:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:2.5,
  },
  explanationButton:
  {
    padding:10,
    paddingHorizontal:15,
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
  },
});
