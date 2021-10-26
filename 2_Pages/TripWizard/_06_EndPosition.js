import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Pickers from "../../Libs/Pickers";

export default function _06_EndPosition(props)
{
  const [dirty, setDirty] = React.useState(
    typeof props.trip === 'undefined' ||
    props.trip === null ||
    props.trip?.endLatitude === null ||
    props.trip?.endLongitude === null ||
    props.trip?.endLatitudeDelta === null ||
    props.trip?.endLongitudeDelta === null
  );
  const updateAndNext = (latitude, longitude, latitudeDelta, longitudeDelta) =>
  {
    if(dirty === false &&
      props.trip?.endLatitude === latitude &&
      props.trip?.endLongitude === longitude &&
      props.trip?.endLatitudeDelta === latitudeDelta &&
      props.trip?.endLongitudeDelta === longitudeDelta)
      props.next();
    else
      props.updateTrip({
        ...props.trip,
        endLatitude: latitude,
        endLongitude: longitude,
        endLatitudeDelta: latitudeDelta,
        endLongitudeDelta: longitudeDelta,
      });
  };

  const region = (typeof props.trip !== 'undefined' && props.trip !== null &&
    props.trip?.endLatitude !== null &&
    props.trip?.endLongitude !== null &&
    props.trip?.endLatitudeDelta !== null &&
    props.trip?.endLongitudeDelta !== null) ?
    {
      latitude:props.trip?.endLatitude,
      longitude:props.trip?.endLongitude,
      latitudeDelta:props.trip?.endLatitudeDelta,
      longitudeDelta:props.trip?.endLongitudeDelta
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
        label="Move the map to indicate where your trip will end"
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
