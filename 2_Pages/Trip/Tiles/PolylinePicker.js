import React from "react";
import {StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline } from "react-native-maps";
// Libs
import * as G from "../../../Libs/Globals";
import * as Pickers from "../../../Libs/Pickers";
import * as Popups from "../../../Libs/Popups";
import * as Displayers from "../../../Libs/Displayers";

export default function PolylinePicker(props)
{
  const [forceRefresh, setForceRefresh] = React.useState(false);
  React.useEffect(() => { setForceRefresh(false); }, [forceRefresh]);

  const getInitRegion = () =>
  {
    return typeof props.trip === 'undefined' || props.trip === null || props.trip.region === null ?
      G.Constants.defaultMapPoint : 
      {
        latitude:props.trip.region.latitude,
        longitude:props.trip.region.longitude,
        latitudeDelta:props.trip?.region?.latitudeDelta,
        longitudeDelta:props.trip?.region?.longitudeDelta
      };
  };

  const updateTrip = (polygon, region, tiles) =>
  {
    props.updateTrip({ ...props.trip, region: region, polygon: polygon, tiles: tiles }, true);
    props.toggle(false);
    setForceRefresh(true);
  };

  const showTiles = (show = false) =>
  {
    return show === false ? <View/> : props.trip?.tiles?.map((tile, index) => getTile(tile, index));
  }
  const getTile = (tile, index) =>
  {
    return (
      <View key={index}>
        <Polyline
          coordinates={[
            {latitude:tile.latitude, longitude:tile.longitude},
            {latitude:(tile.latitude+tile.height), longitude:tile.longitude+tile.width}
          ]}
          strokeColor={G.Colors().Highlight()}
          strokeWidth={3}
          lineDashPattern={[1]}
        />
      </View>
    );
  }

  const [mapSize, setMapSize] = React.useState(null);
  const getMap = () =>
  {
    return (
      <View style={s.mapFrame}
        onLayout={(event) =>
        {
          setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width });
          setForceRefresh(true);
        }}
      >
        {forceRefresh === false && mapSize !== null ? 
          <MapView
            style={{ ...G.S.mapHd(mapSize)}}
            provider={PROVIDER_DEFAULT}
            mapType={MAP_TYPES.NONE}
            region={getInitRegion()}
            rotateEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {Platform.OS == "android" ? <MapView.UrlTile style={{zIndex:-3}} urlTemplate={G.Constants.tileProvider} /> : <View/>}
            <Polyline
              style={{zIndex:10}}
              coordinates={props.trip?.polygon !== null ? props.trip?.polygon : []}
              strokeColor={G.Colors().Highlight()}
              strokeWidth={3}
              lineDashPattern={[1]}
            />
            {showTiles(false)}
          </MapView>
          :
          <View/>
        }
      </View>
    );
  };
  
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.inside}>
          {getMap()}
          <Popups.Popup
            noCloseButton={true}
            containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
            style={{ overflow:'hidden' }}
            visible={props.visible}
            hide={() => props.toggle(false)}
          >
            <Pickers.MapPolyline
              latitude={getInitRegion().latitude}
              longitude={getInitRegion().longitude}
              latitudeDelta={getInitRegion().latitudeDelta}
              longitudeDelta={getInitRegion().longitudeDelta}
              trip={props.trip}
              updateTrip={updateTrip}
              hide={() => props.toggle(false)}
            />
          </Popups.Popup>
        </View>
      </View>
      <Displayers.TouchableOverlay onPress={() => props.toggle(true)} />
    </View>
  );
}

const markerSize = 30;
const theme = G.Colors().Foreground();
let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    flex: 1,
    flexDirection: "row",
    padding: 5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    ...G.S.shadow(3),
    flex: 1,
    backgroundColor: theme,
    borderRadius: 10,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    overflow:'visible',
  },
  inside:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 10,
  },

  mapFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  tile:
  {
    height:10,
    width:10,
    backgroundColor: G.Colors().Highlight(0.5),
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
