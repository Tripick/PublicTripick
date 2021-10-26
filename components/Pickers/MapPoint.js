import React from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { PROVIDER_DEFAULT, Polyline } from "react-native-maps";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function MapPoint(props)
{
  const [region, setRegion] = React.useState(
  {
    latitude: props.latitude !== null && typeof(props.latitude) !== "undefined" ? props.latitude : G.Constants.defaultMapPoint.latitude,
    longitude: props.longitude !== null && typeof(props.longitude) !== "undefined" ? props.longitude : G.Constants.defaultMapPoint.longitude,
    latitudeDelta: props.latitudeDelta !== null && typeof(props.latitudeDelta) !== "undefined" ? props.latitudeDelta : G.Constants.defaultMapPoint.latitudeDelta,
    longitudeDelta: props.longitudeDelta !== null && typeof(props.longitudeDelta) !== "undefined" ? props.longitudeDelta : G.Constants.defaultMapPoint.longitudeDelta,
  });

  const onRegionChange = (newRegion) =>
  {
    setRegion(newRegion);
  };

  const [mapSize, setMapSize] = React.useState(null);
  return (
    <View style={s.container}>
      <View style={s.mapContainer}
        onLayout={(event) => setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width })}>
        {mapSize !== null ? 
          <MapView
            style={{ ...G.S.mapHd(mapSize)}}
            provider={PROVIDER_DEFAULT}
            mapType={G.Constants.mapType}
            initialRegion={region}
            onRegionChange={onRegionChange}
            rotateEnabled={false}
            pitchEnabled={true}
            scrollEnabled={true}
            zoomEnabled={true}
          >
            {Platform.OS == "android" ? <MapView.UrlTile urlTemplate={G.Constants.tileProvider} /> : <View/>}
            {props.drawPolygon === true ?
              <Polyline
                style={{zIndex:10}}
                coordinates={props.polygon}
                strokeColor={G.Colors().Highlight()}
                strokeWidth={3}
                lineDashPattern={[1]}
              /> : <View/>
            }
            <MapView.Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} style={s.markerContainer}>
              <View style={s.marker}>
                <Image source={G.Images.pinPoint} style={s.pinPoint} />
              </View>
            </MapView.Marker>
          </MapView>
          :
          <View/>
        }
      </View>
      <View style={s.bannerContainer}>
        <View style={s.bannerIconContainer}>
          <View style={s.bannerIcon}>
            <Displayers.Icon
              name={"arrow-all"}
              type="mci"
              size={26}
              color={G.Colors().Highlight()}
            />
          </View>
        </View>
        <View style={s.bannerTextContainer}>
          <Texts.Label left style={{color:G.Colors().Highlight()}}>
            {props.label}
          </Texts.Label>
        </View>
      </View>
      <View style={s.footerContainer}>
        <View style={s.footer}>
          {props.noCancelButton === true ?
            <View/>
            : 
            <View style={s.buttonContainer}>
              <Buttons.Label
                center
                iconLeft
                iconName="chevron-left"
                type="mci"
                alignWidth
                contentForeground
                backgroundBright
                style={s.button}
                borderStyle={{borderWidth:1, borderColor:G.Colors().Highlight()}}
                color={G.Colors().Highlight()}
                size={20}
                containerStyle={{...G.S.width()}}
                contentStyle={{...G.S.width(), paddingLeft:20}}
                iconStyle={{left:10}}
                onPress={() => props.hide()}
              >
                Cancel
              </Buttons.Label>
            </View>
          }
          <View style={s.buttonContainer}>
            <Buttons.Label
              center
              iconRight
              alignWidth
              contentForeground
              backgroundHighlight
              iconName="check"
              type="mci"
              style={s.button}
              size={20}
              containerStyle={{...G.S.width()}}
              contentStyle={{
                ...G.S.width(), 
                paddingRight:15,
                borderWidth:1,
                borderColor:G.Colors().Foreground(),
              }}
              iconStyle={{right:10}}
              onPress={() => props.onSelect(region.latitude, region.longitude, region.latitudeDelta, region.longitudeDelta)}
            >
              {props.validateMessage}
            </Buttons.Label>
          </View>
        </View>
      </View>
    </View>
  );
}

const markerSize = 25;
const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  mapContainer:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 15,
  },
  map:
  {
    ...G.S.center,
    marginTop: "-10%",
    marginBottom: "-10%",
  },
  bannerContainer:
  {
    ...G.S.center,
    ...G.S.width(96),
    aspectRatio:6,
    position: "absolute",
    flexDirection:'row',
    top: 10,
    marginTop: 0,
    paddingHorizontal:0,
    paddingRight: 30,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  bannerIconContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingVertical:5
  },
  bannerIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
  },
  bannerStep:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  bannerTextContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:4,
    flexDirection:'row',
    justifyContent: "flex-start"
  },
  footerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    position: "absolute",
    bottom: 0,
    aspectRatio: 5,
    paddingBottom: 10,
    paddingHorizontal: "3%",
  },
  footer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:"row",
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(50),
    aspectRatio:4,
    paddingHorizontal:5
  },
  button:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
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
