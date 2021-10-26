import React from "react";
import { View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";
import * as Displayers from "../../Libs/Displayers";
// Components
import Trips from "./Trips";

export default function Homepage({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const goTo = (screenName) =>
  {
    setContext({ ...context, previousPageName: "Homepage" });
    context.navigate(navigation, screenName);
  };

  React.useEffect(() => { setContext({ ...context, previousPageName: "Homepage" }); }, []);
  
  const onTripClick = (idTrip) =>
  {
    const trip = context.userContext.trips.filter(t => t.id === idTrip)[0];
    setContext({ ...context, previousPageName: "Homepage", currentTripId: idTrip });
    context.navigate(navigation, trip.isItineraryGenerated === true ? "Itinerary" : "Trip");
  };
  
  // Create trip
  const createTrip = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_create",
      isRetribution:false,
      data:{ },
      callback:createTripOnSuccess
    }]});
  };
  const createTripOnSuccess = (response) =>
  {
    context.navigate(navigation, "Trip");
  };

  if(context.userContext === null) return (<View/>);
  return (
    <Wrappers.AppFrame>
      <View style={{...G.S.width(), flex:1}}>
        {typeof(context.userContext) === 'undefined' || context.userContext === null ?
          <View/>
          :
          <Trips navigation={navigation} onTripClick={onTripClick} createTrip={createTrip} goTo={goTo} />
        }
      </View>
    </Wrappers.AppFrame>
  );
}
