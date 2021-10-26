import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline, Polygon } from "react-native-maps";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Buttons from "../../Libs/Buttons";

export default function Map(props)
{
  const map = React.useRef(null);
  const [mapSize, setMapSize] = React.useState({height: G.Layout.window.height, width:G.Layout.window.width });
  const [mapReady, setMapReady] = React.useState(false);
  const [region, setRegion] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(false);
  React.useEffect(() => { setForceRefresh(true); }, [mapSize]);
  React.useEffect(() => { setForceRefresh(false); }, [forceRefresh]);
  React.useEffect(() => { setForceRefresh(!forceRefresh); }, [props.trip]);
  
  const getRegion = () =>
  {
    return {
      latitude: props.trip.region.latitude,
      longitude: props.trip.region.longitude,
      latitudeDelta: props.trip.region.latitudeDelta,
      longitudeDelta: props.trip.region.longitudeDelta
    };
  };
  const getMap = () =>
  {
    return (
      <MapView
        ref={map}
        style={{ ...G.S.mapHd(mapSize)}}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.NONE}
        initialRegion={getRegion()}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={() => setTimeout(() => { setMapReady(true); }, 500)}
        onRegionChangeComplete={setRegion}
      >
        {Platform.OS == "android" ? <MapView.UrlTile urlTemplate={G.Constants.tileProvider} /> : <View/>}
        {getDayMarkers()}
        {getDaysLink()}
      </MapView>
    );
  };
  const getDaysLink = () =>
  {
    let route = [];
    let lastPosition = { latitude:props.trip?.startLatitude, longitude:props.trip?.startLongitude };
    props.trip?.itinerary?.days?.forEach(d =>
    {
      if(d.index === props.trip.itinerary.days.length - 1)
        lastPosition = { latitude:props.trip.endLatitude, longitude:props.trip.endLongitude };
      else if(typeof(d.steps) !== 'undefined' && d.steps !== null && d.steps.length > 0)
        lastPosition =
        {
          latitude:d.steps[0].visit === null ? d.steps[0].latitude : d.steps[0].visit?.place.latitude,
          longitude:d.steps[0].visit === null ? d.steps[0].longitude : d.steps[0].visit?.place.longitude };
      route.push(lastPosition);
    });
    let routeDirections = [];
    for (let i = 1; i < route.length; i++)
    {
      let angle = 0;
      if(i !== -1)
      {
        const latS = route[i-1].latitude;
        const latE = route[i].latitude;
        const lonS = route[i-1].longitude;
        const lonE = route[i].longitude;
        if(lonE <= lonS && latE >= latS)
          angle = -Math.atan((lonS - lonE) / (latE - latS)) * 180 / Math.PI;
        else if(lonE <= lonS && latE <= latS)
          angle = -Math.atan((latS - latE) / (lonS - lonE)) * 180 / Math.PI - 90;
        else if(lonE >= lonS && latE <= latS)
          angle = 90 + Math.atan((latS - latE) / (lonE - lonS)) * 180 / Math.PI;
        else if(lonE >= lonS && latE >= latS)
          angle = Math.atan((lonE - lonS) / (latE - latS)) * 180 / Math.PI;
      }
      routeDirections.push(
      {
        latitude:(route[i-1].latitude + route[i].latitude) / 2,
        longitude:(route[i-1].longitude + route[i].longitude) / 2,
        angle:angle
      });
    }
    return (
      <View>
        <Polygon
          style={{zIndex:10}}
          coordinates={route}
          strokeColor={G.Colors().Highlight(0.5)}
          strokeWidth={3}
          //lineDashPattern={[0]}
        />
        {routeDirections.map((rd, rdIndex) => 
          <MapView.Marker
            key={rdIndex}
            coordinate={{ latitude: rd.latitude, longitude: rd.longitude }}
            tracksViewChanges={true}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[s.directionMarkerContainer, {transform:[{ rotateZ:(rd.angle + "deg")}]}]}>
              <Displayers.Icon
                name="chevron-up"
                type="mci"
                size={35}
                color={G.Colors().Highlight(0.5)}
              />
            </View>
          </MapView.Marker>
        )}
      </View>
    );
  };

  const markerDayRefs = React.useRef([]);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const selectMarker = (i) =>
  {
    const day = props.trip.itinerary.days[i];
    setSelectedDay(day.id);
    if(markerDayRefs !== null && markerDayRefs.current && markerDayRefs.current.length > 0)
      markerDayRefs.current[i].showCallout();
    if(map !== null && map.current)
    {
      const p = props.getDayPosition(day);
      map.current.animateToRegion({
        latitude:p.latitude,
        longitude:p.longitude,
        latitudeDelta:(region === null ? props.trip.region : region).latitudeDelta,
        longitudeDelta:(region === null ? props.trip.region : region).longitudeDelta
      });
    }
  };
  const getDayMarkers = () =>
  {
    let allMarkers = [];
    props.trip?.itinerary?.days?.forEach((d, i) =>
    {
      const p = props.getDayPosition(d);
      allMarkers.push(
        <MapView.Marker
          key={i}
          ref={m => markerDayRefs.current[i] = m}
          coordinate={{ latitude: p.latitude, longitude: p.longitude }}
          tracksViewChanges={false}
          onPress={() => selectMarker(i)}
          style={{zIndex:i}}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View>
            <View style={s.marker}>
              <View style={s.markerIcon}>
                <Displayers.Icon
                  name="circle"
                  type="mci"
                  size={45}
                  color={
                    d.index === 0 ? G.Colors().Green(0.8) :
                    d.index === (props.trip?.itinerary?.days.length - 1) ? G.Colors().Red(0.8) :
                    G.Colors().Highlight(0.8)}
                />
              </View>
              <View style={s.markerTextContainer}>
                <Texts.Label style={s.markerText}>
                  {d.index + 1}
                </Texts.Label>
              </View>
            </View>
            <MapView.Callout tooltip={true} onPress={() => props.selectDay(d.id)}>
              <View style={sTooltip.container}>
                <View style={sTooltip.content}>
                  <View style={sTooltip.contentFrame}>
                    <View style={sTooltip.title}>
                      <Texts.Label style={{ ...G.S.full, fontSize: 20, color:G.Colors().Foreground() }}>
                        Day {d.index + 1}
                      </Texts.Label>
                    </View>
                    <View style={sTooltip.subTitle}>
                      <Texts.Label style={{ ...G.S.full, fontSize: 16, color:G.Colors().Foreground(0.7) }}>
                        {G.Functions.dateToText(d.date, "MMM Do")}
                      </Texts.Label>
                    </View>
                    {(d.steps.filter(s => s.isVisit === true)).length <= 0 ?
                      <View/>
                      :
                      <View style={[sTooltip.nbSteps, {left:0}]}>
                        <Texts.Label>
                          <Text style={sTooltip.nbStepsText}>
                            {(d.steps.filter(s => s.isVisit === true)).length}
                          </Text>
                        </Texts.Label>
                      </View>
                    }
                    {(d.steps.length - (d.steps.filter(s => s.isVisit === true)).length).length <= 0 || (d.steps.length - (d.steps.filter(s => s.isVisit === true)).length) == "0" ?
                      <View/>
                      :
                      <View style={[sTooltip.nbSteps, {right:0, backgroundColor:G.Colors().Foreground(), paddingBottom:0, paddingHorizontal:0}]}>
                        <View style={{...G.S.center, backgroundColor:G.Colors().Neutral(0.5), paddingBottom:1, paddingHorizontal:8}}>
                          <Texts.Label>
                            <Text style={sTooltip.nbStepsTextNeutral}>
                              {(d.steps.length - (d.steps.filter(s => s.isVisit === true)).length)}
                            </Text>
                          </Texts.Label>
                        </View>
                      </View>
                    }
                  </View>
                </View>
              </View>
            </MapView.Callout>
          </View>
        </MapView.Marker>
      );
    });
    return allMarkers;
  }

  return (
    <View style={s.container}>
      <View style={s.map} onLayout={(event) =>
        {
          setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width });
          setForceRefresh(true);
        }}
      >
        {getMap()}
      </View>
      {props.isOwner === true ?
        <View style={s.daysOrderButtonContainer}>
          <Buttons.Label
            center
            iconLeft
            contentForeground
            backgroundHighlight
            iconName="calendar-month"
            type="mci"
            style={s.buttonLabel}
            size={20}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.width(), paddingLeft:5, paddingBottom:2, borderWidth:1, borderColor:G.Colors().Foreground()}}
            iconStyle={{left:10}}
            onPress={() => props.setShowDaysPopup(true)}
          >
            Change days
          </Buttons.Label>
        </View>
        :
        <View/>
      }
    </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  map:
  {
    ...G.S.center,
    ...G.S.height(120),
    ...G.S.width(),
    marginTop:"-20%",
  },
  directionMarkerContainer:
  {
    width:35,
    aspectRatio:1,
    overflow:'visible',
  },
  marker:
  {
    ...G.S.center,
    width:45,
    aspectRatio:1,
  },
  markerIcon:
  {
    ...G.S.center,
    ...G.S.full,
  },
  markerTextContainer:
  {
    ...G.S.center,
    position:'absolute',
  },
  markerText:
  {
    fontSize:20,
    color:G.Colors().Foreground(),
    paddingBottom:3,
  },
  daysOrderButtonContainer:
  {
    ...G.S.center,
    ...G.S.width(50),
    aspectRatio:5,
    position:'absolute',
    bottom:20,
  },
});

let sTooltip = StyleSheet.create(
  {
    container:
    {
      ...G.S.center,
      height:100,
      aspectRatio:1,
      marginBottom:5,
    },
    content:
    {
      ...G.S.center,
      ...G.S.full,
      ...G.S.shadow(3),
      borderRadius: 100,
    },
    contentFrame:
    {
      ...G.S.center,
      ...G.S.full,
      paddingVertical:"20%",
      borderRadius: 100,
      borderWidth:2,
      borderColor:G.Colors().Foreground(),
      backgroundColor:G.Colors().Highlight(),
      overflow:'visible',
    },
    title:
    {
      ...G.S.center,
      ...G.S.width(),
      flex:1,
    },
    subTitle:
    {
      ...G.S.center,
      ...G.S.width(),
      flex:1,
      marginBottom:8,
    },
    nbSteps:
    {
      ...G.S.center,
      position:'absolute',
      bottom:0,
      borderWidth:1,
      borderColor:G.Colors().Foreground(),
      borderRadius:100,
      backgroundColor:G.Colors().Grant,
      paddingBottom:1,
      paddingHorizontal:8,
    },
    nbStepsText:
    {
      fontSize:18,
      color:G.Colors().Foreground(),
    },
    nbStepsTextNeutral:
    {
      fontSize:18,
      color:G.Colors().Foreground(0.8),
    },
  });