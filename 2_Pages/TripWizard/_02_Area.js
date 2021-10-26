import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Pickers from "../../Libs/Pickers";

export default function _02_Area(props)
{
  const [dirty, setDirty] = React.useState(typeof props.trip?.polygon === 'undefined' || props.trip?.polygon === null);
  const updateAndNext = (polygon, region, tiles) =>
  {
    if(dirty === false)
      props.next();
    else
    {
      props.updateTrip(
      {
        ...props.trip,
        region: region,
        polygon: polygon,
        tiles: tiles
      });
    }
  };

  const region = typeof props.trip?.region === 'undefined' || props.trip?.region === null ? G.Constants.defaultMapPoint : props.trip?.region;
  return (
    <View style={s.container}>
      <Pickers.MapPolyline
        latitude={region.latitude}
        longitude={region.longitude}
        latitudeDelta={region.latitudeDelta}
        longitudeDelta={region.longitudeDelta}
        trip={props.trip}
        updateTrip={updateAndNext}
        hide={() => {}}
        setDirty={setDirty}
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
