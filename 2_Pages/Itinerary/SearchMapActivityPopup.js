import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
// Components
import SearchMap from "./SearchMap";

export default function SearchMapActivityPopup(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [suggestions, setSuggestions] = React.useState([]);
  React.useEffect(() => { setSuggestions([]); }, [props.show]);

  const searchMap = (region) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_searchMap",
      isRetribution:false,
      data:{ idTrip:props.trip.id, region:region },
      callback:searchMapOnSuccess
    }]});
  };
  const searchMapOnSuccess = (response) =>
  {
    setSuggestions(response);
  };

  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:7 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="map-search"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Search an activity to add in Day " + (props.day.index + 1)}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n" + G.Functions.dateToText(props.day.date)}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.mapContainer}>
          <SearchMap
            trip={props.trip}
            day={props.day}
            setPlaceToDisplay={props.setPlaceToDisplay}
            suggestions={suggestions}
            search={searchMap}
            import={props.save}
            getDayPosition={props.getDayPosition}
          />  
        </View>
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingTop:30,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:8,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  mapContainer:
  {
    ...G.S.center,
    ...G.S.width(96),
    flex:1,
    borderWidth:1,
    borderRadius:20,
    borderColor:G.Colors().Neutral(0.2),
    // backgroundColor: G.Colors().Background(),
    zIndex:1000,
  },
});
  