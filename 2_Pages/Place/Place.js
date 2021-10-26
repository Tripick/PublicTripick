import React from "react";
import { View } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as Wrappers from "../../Libs/Wrappers";
// Components
import Place from "../Pick/Place";

export default function PlaceInitializer({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = () => { context.navigate(navigation, backPage); };

  const [place, setPlace] = React.useState(null);
  React.useEffect(() =>
  {
    if (context.currentPlaceId && context.currentPlaceId !== null)
      getPlace();
  }, [context.currentPlaceId]);

  useFocusEffect(React.useCallback(() =>
  {
    const getPlaceCallback = async () =>
    {
      if (context.currentPlaceId && context.currentPlaceId !== null)
        getPlace();
    };
    getPlaceCallback();
  }, []));

  const getPlace = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"place_get",
      isRetribution:false,
      data:{ placeId:context.currentPlaceId },
      callback:getPlaceOnSuccess
    }]});
  };

  const getPlaceOnSuccess = (response) =>
  {
    console.log("Place received.");
    setPlace(response);
  };

  return (
    <Wrappers.AppFrame>
      {place === null ?
        <View/>
        :
        <Place
          mode={"Place"}
          index={0}
          currentIndex={0}
          active={true}
          trip={null}
          showFilters={() => {}}
          place={place}
          goBack={goBack}
          navigation={navigation}
        />
      }
    </Wrappers.AppFrame>
  );
}
