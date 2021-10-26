import React from "react";
import {StyleSheet, View} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
// Components
import Title from "./Title";
import Tiles from "./Tiles/Tiles";

export default function TripContent(props)
{
  return (
    <View style={s.container}>
      {props.lightMode === true ?
        <View/>
        : 
        <Title
          trip={props.trip}
          goBack={props.goBack}
          showMenuPopup={props.showMenuPopup}
        />
      }
      <View style={s.content}>
        <Tiles
          goTo={props.goTo}
          trip={props.trip}
          updateTrip={props.updateTrip}
          saveTravelers={props.saveTravelers}
          showDescriptionInput={props.showDescriptionInput}
          setShowDescriptionInput={props.setShowDescriptionInput}
          lightMode={props.lightMode}
          isOwner={props.isOwner}
        />
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  content:
  {
    ...G.S.width(),
    flex:1,
    zIndex:3,
  }
});
