import React from "react";
// Libs
import * as Wrappers from "../../Libs/Wrappers";
// Components
import TripManager from "./TripManager";

export default function Trip(props)
{
  return (
    <Wrappers.AppFrame>
      <TripManager navigation={props.navigation} lightMode={false} itineraryMode={false}/>
    </Wrappers.AppFrame>
  );
}
