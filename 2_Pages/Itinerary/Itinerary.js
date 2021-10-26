import React from "react";
// Libs
import * as Wrappers from "../../Libs/Wrappers";
// Components
import TripManager from "../Trip/TripManager";

export default function Itinerary(props)
{
  return (
    <Wrappers.AppFrame>
      <TripManager navigation={props.navigation} lightMode={false} itineraryMode={true}/>
    </Wrappers.AppFrame>
  );
}
