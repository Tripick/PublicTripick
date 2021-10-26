import React from "react";
import { StyleSheet, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";

export default function CountriesAreas({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);

  /////////////////////////// OPTIONS ///////////////////////////
  const [region, setRegion] = React.useState({
    latitude:G.Constants.defaultMapPoint.latitude,
    longitude:G.Constants.defaultMapPoint.longitude,
    latitudeDelta:G.Constants.defaultMapPoint.latitudeDelta,
    longitudeDelta:G.Constants.defaultMapPoint.longitudeDelta,
  });
  const applyRegion = (newRegion) =>
  {
    setRegion({...newRegion, longitudeDelta: newRegion.longitudeDelta > -200 ? newRegion.longitudeDelta : 126});
  }

  const [selectedCountry, setSelectedCountry] = React.useState(null);
  React.useEffect(() => { getCountry(1); }, []);
  const getCountry = (id) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"country_get",
      isRetribution:false,
      data:{ id:id, name:"" },
      callback:getCountryOnSuccess
    }]});
  };
  const getCountryOnSuccess = (response) =>
  {
    setSelectedCountry(response);
  };

  const displayAreasOfSelectedCountry = () =>
  {
    let i = 0;
    if(selectedCountry === null)
      return <View/>;
    let polylinesToDisplay = [];
    selectedCountry.Areas.forEach(area =>
    {
      area.forEach(polyline =>
      {
        let zoneLine = [
          {latitude:polyline.MinLat, longitude:polyline.MinLon},
          {latitude:polyline.MaxLat, longitude:polyline.MinLon},
          {latitude:polyline.MaxLat, longitude:polyline.MaxLon},
          {latitude:polyline.MinLat, longitude:polyline.MaxLon},
          {latitude:polyline.MinLat, longitude:polyline.MinLon},
        ];
        polylinesToDisplay.push(
          <Polyline
            key={i}
            coordinates={zoneLine}
            strokeColor={G.Colors().Highlight()}
            strokeWidth={1}
            fillColor={G.Colors().Highlight()}
            lineDashPattern={[1]}
          />
        );
        i++;
      });
    });
    return polylinesToDisplay;
  };

  const getMap = () =>
  {
    return(
      <MapView
        style={[s.map, {...G.S.mapHd(G.Layout.window.height, G.Layout.window.width, 1)}]}
        // provider={PROVIDER_DEFAULT}
        // mapType={MAP_TYPES.NONE}
        initialRegion={region}
        onRegionChangeComplete={applyRegion}
        rotateEnabled={false}
        pitchEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* <MapView.UrlTile style={{zIndex:-3}} urlTemplate={G.Constants.tileProvider} /> */}
        {displayAreasOfSelectedCountry()}
      </MapView>
    );
  };

  return (
    <Wrappers.AppFrame>
      <View style={s.container}>
        {getMap()}
      </View>
    </Wrappers.AppFrame>
  );
}

const markerSize = 25;
const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  map:
  {
    marginTop: "-10%",
    marginBottom: "-10%",
  },
  markerContainer:
  {
    ...G.S.center,
    height: markerSize,
    width: markerSize,
    zIndex:1000,
  },
  marker:
  {
    ...G.S.center,
    height: markerSize,
    width: markerSize,
  },
  pinPoint:
  {
    ...G.S.full,
  }
});
