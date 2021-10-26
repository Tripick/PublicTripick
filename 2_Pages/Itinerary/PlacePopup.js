import React from "react";
import { View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
// Components
import PickSlider from "../Pick/PickSlider";

export default function PlacePopup(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [pick, setPick] = React.useState(null);

  const getPickFromPlace = (placeId) =>
  {
    setPick(null);
    if(placeId !== -1)
    {
      setContext({ ...context, ordersQueue:[...context.ordersQueue,
      {
        id:G.Functions.newGUID(),
        actionName:"place_get",
        isRetribution:false,
        data:{ placeId:placeId },
        callback:getPickFromPlaceOnSuccess
      }]});
    }
  };
  const getPickFromPlaceOnSuccess = (place) =>
  {
    if(place !== null)
      setPick({index:0, idPlace:place.id, idTrip:-1, idUser:-1, Rating:-1, place:place });
    else
      console.log("Place [" + props.placeId + "] is null.");
  };
  React.useEffect(() => { getPickFromPlace(props.placeId); }, [props.placeId]);

  const closePopup = () =>
  {
    setPick(null);
    props.hide();
  };

  return (
    <Popups.Popup
      noCloseButton={true}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(), ...G.S.width() }}
      style={{ ...G.S.height(), ...G.S.width() }}
      visible={props.show}
      hide={closePopup}
    >
      {pick !== null ?
        <PickSlider
          noRater={true}
          navigation={props.navigation}
          trip={null}
          picks={[pick]}
          index={0}
          onIndexChange={() => {}}
          goBack={closePopup}
          existingPicksCount={0}
          globalPicksCount={1}
          totalPicksCount={1}
          savePick={() => {}}
          saveFilters={() => {}}
          saveFlag={() => {}}
          deleteFlag={() => {}}
          applyFilters={() => {}}
          showFiltersPopup={() => {}}
          setShowFiltersPopup={() => {}}
          itineraryPercentIndicator={0}
        />
        :
        <View/>
      }
    </Popups.Popup>
  );
}
