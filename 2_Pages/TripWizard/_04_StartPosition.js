import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Pickers from "../../Libs/Pickers";

export default function _04_StartPosition(props)
{
  const [dirty, setDirty] = React.useState(
    typeof props.trip === 'undefined' ||
    props.trip === null ||
    props.trip?.startLatitude === null ||
    props.trip?.startLongitude === null ||
    props.trip?.startLatitudeDelta === null ||
    props.trip?.startLongitudeDelta === null
  );
  const updateAndNext = (latitude, longitude, latitudeDelta, longitudeDelta) =>
  {
    if(dirty === false &&
      props.trip?.startLatitude === latitude &&
      props.trip?.startLongitude === longitude &&
      props.trip?.startLatitudeDelta === latitudeDelta &&
      props.trip?.startLongitudeDelta === longitudeDelta)
      props.next();
    else
      props.updateTrip({
        ...props.trip,
        startLatitude: latitude,
        startLongitude: longitude,
        startLatitudeDelta: latitudeDelta,
        startLongitudeDelta: longitudeDelta,
      });
  };

  const region = (typeof props.trip !== 'undefined' && props.trip !== null &&
    props.trip?.startLatitude !== null &&
    props.trip?.startLongitude !== null &&
    props.trip?.startLatitudeDelta !== null &&
    props.trip?.startLongitudeDelta !== null) ?
    {
      latitude:props.trip?.startLatitude,
      longitude:props.trip?.startLongitude,
      latitudeDelta:props.trip?.startLatitudeDelta,
      longitudeDelta:props.trip?.startLongitudeDelta
    }
    :
    typeof props.trip?.region !== 'undefined' && props.trip?.region !== null ?
      props.trip?.region
      :
      G.Constants.defaultMapPoint;
  return (
    <View style={s.container}>
      <Pickers.MapPoint
        validateMessage="Save"
        label="Move the map to indicate where your trip will start"
        latitude={region.latitude}
        longitude={region.longitude}
        latitudeDelta={region.latitudeDelta}
        longitudeDelta={region.longitudeDelta}
        onSelect={updateAndNext}
        noCancelButton={true}
        hide={() => {}}
        drawPolygon={true}
        polygon={typeof props.trip === 'undefined' ||
          props.trip === null ||
          typeof props.trip.polygon === 'undefined' ||
          props.trip.polygon === null  ?
            []
            :
            props.trip.polygon}
      />
    </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:20,
  },
});
