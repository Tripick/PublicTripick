import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline } from "react-native-maps";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";

export default function Location(props)
{
  const getInitRegion = () =>
  {
    if(
      props.trip === null ||
      props.trip?.region === null ||
      props.trip?.region?.latitude === null ||
      typeof(props.trip?.region) === 'undefined' ||
      typeof(props.trip?.region?.latitude) === 'undefined'
    )
    {
      const reg = {
        latitude: typeof(props.place?.latitude) === 'undefined' ? G.Constants.defaultMapPoint.latitude : props.place?.latitude,
        longitude: typeof(props.place?.longitude) === 'undefined' ? G.Constants.defaultMapPoint.longitude : props.place?.longitude,
        latitudeDelta:G.Constants.defaultMapPoint.latitudeDelta,
        longitudeDelta:G.Constants.defaultMapPoint.longitudeDelta
      };
      return reg;
    }
    return props.trip?.region;
  };
  
  const [showLegend, setShowLegend] = React.useState(false);
  const [mapSize, setMapSize] = React.useState(null);
  const [mapReady, setMapReady] = React.useState(false);
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.mapFrame} onLayout={(event) => setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width })}>
          {mapSize !== null ? 
            <MapView
              style={{ ...G.S.mapHd(mapSize)}}
              mapPadding={{top: 0, left: 0, right: 0, bottom: 30}}
              provider={PROVIDER_DEFAULT}
              mapType={MAP_TYPES.NONE}
              region={getInitRegion()}
              rotateEnabled={false}
              pitchEnabled={false}
              scrollEnabled={false}
              zoomEnabled={false}
              onMapReady={() => setTimeout(() => setMapReady(true), 500)}
            >
              {Platform.OS == "android" ? <MapView.UrlTile style={{zIndex:-3}} urlTemplate={G.Constants.tileProvider} /> : <View/>}
              <Polyline
                style={{zIndex:10}}
                coordinates={props.trip?.polygon !== null && typeof(props.trip?.polygon) !== 'undefined' ? props.trip?.polygon : []}
                strokeColor={G.Colors().Highlight()}
                strokeWidth={3}
                lineDashPattern={[1]}
              />
              <MapView.Marker
                coordinate={
                {
                  latitude: typeof(props.place?.latitude) === 'undefined' ? G.Constants.defaultMapPoint.latitude : props.place?.latitude,
                  longitude: typeof(props.place?.longitude) === 'undefined' ? G.Constants.defaultMapPoint.longitude : props.place?.longitude
                }}
                tracksViewChanges={!mapReady}
              >
                <View style={m.marker}>
                  <Image source={G.Images.pinPoint} style={m.pinPoint} />
                </View>
              </MapView.Marker>
            </MapView>
            :
            <View/>
          }
          {mapSize !== null && props.place?.country !== null && typeof(props.place?.country) !== 'undefined' && props.place?.country !== "" ?
            <View style={s.countryNameContainer}>
              <Texts.Label style={s.countryName}>{props.place?.country}</Texts.Label>
            </View>
            :
            <View/>
          }
          <Displayers.TouchableOverlay onPress={() => setShowLegend(!showLegend)} />
        </View>
      </View>
      {props.showLegend === true && showLegend === true ?
        <View style={s.legendContainer}>
          <View style={s.legendButton}>
            <Buttons.Label
              alignWidth
              shadow
              backgroundBright
              color={G.Colors().Highlight()}
              onPress={props.moreByPosition}
              style={{ ...G.S.full, }}
              contentStyle={s.legendButtonContent}
              chevron={true}
              chevronSize={15}
              chevronStyle={{ right:3 }}
            >
              <Text style={{ fontSize: 12, color:G.Colors().Highlight() }}>See position</Text>
            </Buttons.Label>
          </View>
          <View style={s.legendButton}>
            <Buttons.Label
              alignWidth
              shadow
              backgroundBright
              color={G.Colors().Highlight()}
              onPress={props.moreByName}
              style={{ ...G.S.full, }}
              contentStyle={s.legendButtonContent}
              chevron={true}
              chevronSize={15}
              chevronStyle={{ right:3 }}
            >
              <Text style={{ fontSize: 12, color:G.Colors().Highlight() }}>Open map</Text>
            </Buttons.Label>
          </View>
        </View>
        :
        <View/>
      }
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:5,
    paddingTop:0,
  },
  content:
  {
    ...G.S.shadow(3),
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    borderRadius:20,
    overflow:'visible',
    zIndex:3,
  },
  legendContainer:
  {
    ...G.S.width(),
    ...G.S.shadow(2),
    aspectRatio:4.5,
    flexDirection:'row',
    paddingTop:33,
    paddingBottom:3,
    marginTop:-32,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor:G.Colors().Foreground(),
    overflow:'hidden',
    zIndex:2,
  },
  legendButton:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  legendButtonContent:
  {
    ...G.S.center,
    ...G.S.height(94),
    ...G.S.width(94),
    paddingBottom:1,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
  },
  mapFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:20,
    borderWidth:2,
    borderColor:G.Colors().Foreground(),
  },
  map:
  {
    ...G.S.center,
    marginTop: "-10%",
    marginBottom: "-10%",
  },
  countryNameContainer:
  {
    ...G.S.center,
    position:'absolute',
    top:10,
    left:10,
    borderRadius:5,
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.3),
    backgroundColor:G.Colors().Foreground(),
  },
  countryName:
  {
    ...G.S.full,
    padding:5,
    paddingHorizontal:25,
    textAlign: "center",
    color: G.Colors().Neutral(0.6),
    fontSize: 12,
  },
});

const markerSize = 25;
let m = StyleSheet.create({
  marker:
  {
    ...G.S.center,
    height: markerSize,
    width: markerSize,
  },
  pinPoint:
  {
    ...G.S.full,
  },
});
