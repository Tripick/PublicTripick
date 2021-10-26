import React from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline } from "react-native-maps";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Views from "../../../Libs/Views";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Popups from "../../../Libs/Popups";
import * as Displayers from "../../../Libs/Displayers";

export default function LocationPicker(props)
{
  // forceRefresh, forceReload, forceUpdate
  const [forceRefresh, setForceRefresh] = React.useState(false);
  React.useEffect(() => { setForceRefresh(false); }, [forceRefresh]);
  React.useEffect(() => { setForceRefresh(!forceRefresh); }, [props.latitude, props.longitude, props.latitudeDelta, props.longitudeDelta]);

  const getInitRegion = () =>
  {
    if(props.latitude === null || typeof(props.latitude) === 'undefined')
      return {
        latitude:G.Constants.defaultMapPoint.latitude,
        longitude:G.Constants.defaultMapPoint.longitude,
        latitudeDelta:G.Constants.defaultMapPoint.latitudeDelta,
        longitudeDelta:mapSize === null ? G.Constants.defaultMapPoint.longitudeDelta :
          (G.Constants.defaultMapPoint.latitudeDelta * mapSize.width / mapSize.height)
      };
    return {
      latitude: props.latitude,
      longitude: props.longitude,
      latitudeDelta: props.latitudeDelta,
      longitudeDelta: mapSize === null ? G.Constants.defaultMapPoint.longitudeDelta :
        (props.latitudeDelta * mapSize.width / mapSize.height)
    };
  };

  const [mapSize, setMapSize] = React.useState(null);
  const [mapReady, setMapReady] = React.useState(false);
  const getMap = () =>
  {
    return (
      <View style={s.mapFrame}>
        <View style={s.mapContainer}
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
              initialRegion={getInitRegion()}
              rotateEnabled={false}
              pitchEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              onMapReady={() => setTimeout(() => setMapReady(true), 500)}
            >
              {Platform.OS == "android" ? <MapView.UrlTile urlTemplate={G.Constants.tileProvider} /> : <View/>}
              {props.drawPolygon === true ?
                <Polyline
                  style={{zIndex:10}}
                  coordinates={props.polygon}
                  strokeColor={G.Colors().Highlight()}
                  strokeWidth={3}
                  lineDashPattern={[1]}
                />
                :
                <View/>
              }
              {forceRefresh === false ? 
                <MapView.Marker
                  coordinate={{ latitude: props.latitude, longitude: props.longitude }}
                  style={s.markerContainer}
                  tracksViewChanges={!mapReady}
                >
                  <View style={s.marker}>
                    <Image source={G.Images.pinPoint} style={s.pinPoint} />
                  </View>
                </MapView.Marker>
                :
                <View/>
              }
            </MapView>
            : <View/>
          }
        </View>
      </View>
    );
  };
  
  return (
    <View style={s.container}>
      <View style={[s.content, props.borderColor ? {borderColor:props.borderColor} : {}]}>
        <View style={s.inside}>
          {getMap()}
          {props.readOnly === true ? <View/> : 
            <Popups.Popup
              noCloseButton={true}
              containerStyle={{ ...G.S.height(), ...G.S.width() }}
              style={{ overflow:'hidden' }}
              visible={props.showPointPicker}
              hide={() => props.setShowPointPicker(false)}
            >
              {forceRefresh === false ? 
                <Pickers.MapPoint
                  validateMessage="Save"
                  label={props.helpMessage}
                  latitude={props.latitude}
                  longitude={props.longitude}
                  latitudeDelta={props.latitudeDelta}
                  longitudeDelta={props.longitudeDelta}
                  onSelect={props.onPoint}
                  hide={() => props.setShowPointPicker(false)}
                  drawPolygon={props.drawPolygon}
                  polygon={props.polygon}
                /> :
                <View/>
              }
            </Popups.Popup>
          }
        </View>
      </View>
      {props.readOnly === true ? <View/> : <Displayers.TouchableOverlay onPress={() => props.setShowPointPicker(true)} />}
    </View>
  );
}

const theme = G.Colors().Foreground();
const markerSize = 30;
const radius = 15;
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
    borderRadius: radius,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    overflow:'visible',
  },
  inside:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: radius,
  },

  mapFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  mapContainer:
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
