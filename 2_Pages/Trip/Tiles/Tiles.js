import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
// Components
import DescriptionPopup from "./DescriptionPopup";
import TileStartEnd from "./TileStartEnd";
import TileAreas from "./TileAreas";
import TileTravelers from "./TileTravelers";
import TilePicks from "./TilePicks";

export default function Tiles(props)
{
  const [showDatePickerStart, setShowDatePickerStart] = React.useState(false);
  const onStartDate = (selectedDate) =>
  {
    setShowDatePickerStart(false);
    if (typeof selectedDate !== "undefined")
    {
      props.updateTrip({
        ...props.trip,
        enabledStartDate: true,
        startDate: selectedDate,
        endDate:
          G.Functions.daysBetween(selectedDate, props.trip?.endDate) <= 0 ?
            G.Functions.addDays(selectedDate, G.Functions.daysBetween(props.trip?.startDate, props.trip?.endDate)) :
            props.trip?.endDate
      });
    }
  };

  const [showDatePickerEnd, setShowDatePickerEnd] = React.useState(false);
  const onEndDate = (selectedDate) =>
  {
    setShowDatePickerEnd(false);
    if (typeof(selectedDate) !== "undefined")
    {
      props.updateTrip({ ...props.trip, enabledEndDate: true, endDate: selectedDate });
    }
  };

  let activeStep = 6;
  if(typeof(props.trip?.region) == 'undefined' || props.trip?.region === null) activeStep = 0;
  else if(typeof(props.trip?.startDate) == 'undefined' || props.trip?.startDate === null) activeStep = 1;
  else if(typeof(props.trip?.endDate) == 'undefined' || props.trip?.endDate === null) activeStep = 2;

  const separatorColor = G.Colors().Neutral(0.1);
  return (
    <View style={s.container}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{ ...G.S.full }}
        contentContainerStyle={{...G.S.center, paddingTop:0}}
      >
        <View style={s.frame}>
          {/* <View style={s.name}><Texts.Title style={h.title} numberOfLines={2}>{getTitle()}</Texts.Title></View> */}
          {/* <View style={s.slidingBar}/> */}
          {/* <Description activeStep={activeStep} trip={props.trip} updateTrip={props.updateTrip} showDescriptionInput={props.showDescriptionInput} setShowDescriptionInput={props.setShowDescriptionInput} separatorColor={separatorColor} /> */}
          <TileAreas
            activeStep={activeStep}
            trip={props.trip}
            updateTrip={props.updateTrip}
            separatorColor={separatorColor}
            lightMode={props.lightMode}
            isOwner={props.isOwner}
          />
          <TileStartEnd
            activeStep={activeStep}
            activeNumber={1} trip={props.trip}
            updateTrip={props.updateTrip}
            type={"Start"}
            showDatePicker={showDatePickerStart}
            setShowDatePicker={setShowDatePickerStart}
            onDate={onStartDate}
            separatorColor={separatorColor}
            lightMode={props.lightMode}
            isOwner={props.isOwner}
          />
          <TileStartEnd
            activeStep={activeStep}
            activeNumber={2}
            trip={props.trip}
            updateTrip={props.updateTrip}
            type={"End"}
            showDatePicker={showDatePickerEnd}
            setShowDatePicker={setShowDatePickerEnd}
            onDate={onEndDate}
            separatorColor={separatorColor}
            lightMode={props.lightMode}
            isOwner={props.isOwner}
          />
          <TileTravelers
            activeStep={activeStep}
            isLast={props.lightMode === true}
            trip={props.trip}
            saveTravelers={props.saveTravelers}
            deleteTraveler={props.deleteTraveler}
            separatorColor={separatorColor}
            isOwner={props.isOwner}
          />
          {props.lightMode === true ?
            <View/>
            :
            <TilePicks activeStep={activeStep} trip={props.trip} goTo={props.goTo} separatorColor={separatorColor} />
          }
        </View>
      </ScrollView>
      <DescriptionPopup trip={props.trip} updateTrip={props.updateTrip} showDescriptionInput={props.showDescriptionInput} setShowDescriptionInput={props.setShowDescriptionInput} />
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    zIndex: 1,
    backgroundColor:G.Colors().Foreground(),
  },
  frame:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:10,
    backgroundColor:G.Colors().Foreground(),
  },
});
