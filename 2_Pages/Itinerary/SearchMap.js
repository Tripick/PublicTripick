import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline, Polygon } from "react-native-maps";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Buttons from "../../Libs/Buttons";
// Components
import Step from "./Step";
import StepPlace from "./StepPlace";

export default function SearchMap(props)
{
  const map = React.useRef(null);
  const [day, setDay] = React.useState(props.day);
  const [mapSize, setMapSize] = React.useState({height: G.Layout.window.height, width:G.Layout.window.width });
  const [mapReady, setMapReady] = React.useState(false);
  const [region, setRegion] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(false);
  const [route, setRoute] = React.useState([]);
  const [routeDirections, setRouteDirections] = React.useState([]);
  const markerDayRefs = React.useRef([]);
  const markerStepRefs = React.useRef([]);
  const [selectedStep, setSelectedStep] = React.useState(null);

  const getRegion = () =>
  {
    if(day.steps === null || day.steps.length === 0)
    {
      return {
        latitude: props.trip.endLatitude,
        longitude: props.trip.endLongitude,
        latitudeDelta: props.trip.endLatitudeDelta,
        longitudeDelta: props.trip.endLongitudeDelta,
      };
    }
    // Calculate delta
    let lats = day.steps.map(s => s.visit === null ? s.latitude : s.visit.place.latitude);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let deltaLat = maxLat - minLat;
    let lons = day.steps.map(s => s.visit === null ? s.longitude : s.visit.place.longitude);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    let deltaLon = maxLon - minLon;
    let delta = Math.max(deltaLat, deltaLon);
    if (delta === 0) delta = 1;
    // Calculate route region
    let steps = day.steps.filter(step => step.isVisit === true);
    if(steps.length > 0)
    {
      lats = steps.map(s => s.visit === null ? s.latitude : s.visit.place.latitude);
      minLat = Math.min(...lats);
      maxLat = Math.max(...lats);
      deltaLat = maxLat - minLat;
      lons = steps.map(s => s.visit === null ? s.longitude : s.visit.place.longitude);
      minLon = Math.min(...lons);
      maxLon = Math.max(...lons);
      deltaLon = maxLon - minLon;
      delta = Math.max(deltaLat, deltaLon);
      if (delta === 0) delta = 1;
    }
    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLon + minLon) / 2,
      latitudeDelta: delta * 3,
      longitudeDelta: delta * 3,
    };
  };

  const getMap = () =>
  {
    if(day.id !== props.day.id) return <View/>;
    else if(forceRefresh === true)
    {
      setForceRefresh(false);
      loadMap();
      return <View/>;
    }
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
        {getStepMarkers(day.steps.filter(x => x.isVisit === true))}
        {getRouteLines()}
        {getStepMarkers(props.suggestions, true)}
      </MapView>
    );
  };

  const selectDayMarker = (id) =>
  {
    const days = props.trip.itinerary.days.filter(d => d.id !== day.id);
    const dayIndex = days.indexOf(days.filter(d => d.id === id)[0]);
    const sDay = days[dayIndex];
    if(markerDayRefs !== null && markerDayRefs.current && markerDayRefs.current.length > 0)
      markerDayRefs.current[dayIndex].showCallout();
    if(map !== null && map.current)
    {
      const p = props.getDayPosition(sDay);
      map.current.animateToRegion(
      {
        latitude:p.latitude,
        longitude:p.longitude,
        latitudeDelta:(region === null ? props.trip.region : region).latitudeDelta,
        longitudeDelta:(region === null ? props.trip.region : region).longitudeDelta
      });
    }
  };

  const loadMap = () =>
  {
    const newRegion = getRegion();
    if(map !== null && map.current)
    {
      map.current.animateToRegion(
      {
        latitude:newRegion.latitude,
        longitude:newRegion.longitude,
        latitudeDelta:newRegion.latitudeDelta,
        longitudeDelta:newRegion.longitudeDelta
      });
    }

    let r = day.steps.filter(s => s.isVisit === true).map(s =>
    {
      return { latitude: s.visit === null ? s.latitude : s.visit.place.latitude, longitude: s.visit === null ? s.longitude : s.visit.place.longitude };
    });
    let rd = [];
    for (let i = 1; i < r.length; i++)
    {
      let angle = 0;
      if(i !== -1)
      {
        const latS = r[i-1].latitude;
        const latE = r[i].latitude;
        const lonS = r[i-1].longitude;
        const lonE = r[i].longitude;
        if(lonE <= lonS && latE >= latS)
          angle = -Math.atan((lonS - lonE) / (latE - latS)) * 180 / Math.PI;
        else if(lonE <= lonS && latE <= latS)
          angle = -Math.atan((latS - latE) / (lonS - lonE)) * 180 / Math.PI - 90;
        else if(lonE >= lonS && latE <= latS)
          angle = 90 + Math.atan((latS - latE) / (lonE - lonS)) * 180 / Math.PI;
        else if(lonE >= lonS && latE >= latS)
          angle = Math.atan((lonE - lonS) / (latE - latS)) * 180 / Math.PI;
      }
      rd.push(
      {
        latitude:(r[i-1].latitude + r[i].latitude) / 2,
        longitude:(r[i-1].longitude + r[i].longitude) / 2,
        angle:angle
      });
    }
    setRoute(r);
    setRouteDirections(rd);
  };

  const getRouteLines = () =>
  {
    return (
      <View>
        <Polyline
          style={{zIndex:10}}
          coordinates={route}
          strokeColor={G.Colors().Green()}
          strokeWidth={5}
          lineDashPattern={[0]}
        />
        {routeDirections.map((rd, rdIndex) => 
          <MapView.Marker
            key={rdIndex}
            coordinate={{ latitude: rd.latitude, longitude: rd.longitude }}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={[s.directionMarkerContainer, {transform:[{ rotateZ:(rd.angle + "deg")}]}]}>
              <Displayers.Icon
                name="chevron-up"
                type="mci"
                size={35}
                color={G.Colors().Green()}
              />
            </View>
          </MapView.Marker>
        )}
      </View>
    );
  };

  const selectMarker = (step, i) =>
  {
    if(markerStepRefs !== null && markerStepRefs.current && markerStepRefs.current.length > 0)
      markerStepRefs.current[i].showCallout();
    if(map !== null && map.current)
    {
      map.current.animateToRegion(
      {
        latitude:step.visit === null ? step.latitude : step.visit.place.latitude,
        longitude:step.visit === null ? step.longitude : step.visit.place.longitude,
        latitudeDelta:(region === null ? getRegion() : region).latitudeDelta,
        longitudeDelta:(region === null ? getRegion() : region).longitudeDelta
      });
    }
  };

  const selectPlace = (place, i) =>
  {
    setSelectedStep(place);
    if(markerStepRefs !== null && markerStepRefs.current && markerStepRefs.current.length > 0)
      markerStepRefs.current[i].showCallout();
    if(map !== null && map.current)
    {
      map.current.animateToRegion(
      {
        latitude:place.latitude,
        longitude:place.longitude,
        latitudeDelta:(region === null ? getRegion() : region).latitudeDelta,
        longitudeDelta:(region === null ? getRegion() : region).longitudeDelta
      });
    }
  };

  const getStepMarkers = (source, isSuggestion = false) =>
  {
    let allMarkers = [];
    source.forEach((step, i) =>
    {
      const place = isSuggestion === false && step.visit !== null ? step.visit.place : step;
      const isSelected = isSuggestion === true && selectedStep !== null && selectedStep.id === place.id;
      const offset = isSuggestion === true ? day.steps.filter(x => x.isVisit === true).length : 0;
      allMarkers.push(
        <MapView.Marker
          key={offset+i}
          ref={m => markerStepRefs.current[offset+i] = m}
          coordinate={{ latitude:place.latitude, longitude:place.longitude }}
          tracksViewChanges={false}
          anchor={{ x: 0.5, y:isSuggestion === true ? 1 : 0.5 }}
          onPress={() => isSuggestion === true ? selectPlace(place, offset+i) : selectMarker(step, offset+i)}
        >
          <View>
            <View style={s.marker}>
              <View style={s.markerIcon}>
                <Displayers.Icon
                  name={isSuggestion === true ? "map-marker" : "circle"}
                  type="mci"
                  size={45}
                  color={isSuggestion === false ? G.Colors().Green() : (isSelected === true ? G.Colors().Highlight() : G.Colors().Fatal)}
                />
              </View>
              {isSuggestion === true ? <View/> :
                <View style={[
                  s.markerTextContainer,
                  {backgroundColor:(isSuggestion === false ? G.Colors().Green() : G.Colors().Highlight())}]}
                >
                  <Texts.Label style={s.markerText}>
                    {isSuggestion === false ? (step.index + 1) : " "}
                  </Texts.Label>
                </View>
              }
            </View>
            <MapView.Callout tooltip={true} onPress={() => props.setPlaceToDisplay(place.id)}>
              <View style={sTooltip.stepContainer}>
                {
                  isSuggestion === true ?
                  <StepPlace
                    zoomed={true}
                    place={place}
                    setPlaceToDisplay={() => {}}
                  />
                  :
                  <Step
                    zoomed={true}
                    step={step}
                    isActive={step.isVisit}
                    isFirst={true}
                    isLastActive={true}
                    isLast={true}
                    setPlaceToDisplay={() => {}}
                  />
                }
              </View>
            </MapView.Callout>
          </View>
        </MapView.Marker>
      );
    });
    return allMarkers;
  }

  React.useEffect(() => { setForceRefresh(true); }, [mapSize, props.day.steps]);
  React.useEffect(() => { setForceRefresh(false); }, [forceRefresh]);
  React.useEffect(() =>
  {
    setForceRefresh(!forceRefresh);
    setDay(props.day);
  }, [props.day]);
  React.useEffect(() => { loadMap(); }, [day]);
  
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
      <View style={[s.buttonContainer, {top:10}]}>
        <Buttons.Label
          alignWidth
          center
          backgroundBright
          color={G.Colors().Highlight()}
          iconName="map-search-outline"
          type="mci"
          size={20}
          containerStyle={{...G.S.width()}}
          contentStyle={{...G.S.center, ...G.S.width(), paddingVertical:10, paddingLeft:30, paddingRight:5, justifyContent:'flex-start'}}
          iconStyle={{left:10}}
          onPress={() => props.search(region)}
        >
          Search in this area
        </Buttons.Label>
      </View>
      {selectedStep === null ? <View/> :
        <View style={[s.buttonContainer, {bottom:10}]}>
          <Buttons.Label
            alignWidth
            center
            contentForeground
            backgroundHighlight
            iconName="check"
            type="mci"
            size={20}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.center, ...G.S.width(), paddingVertical:10, paddingLeft:30, paddingRight:10, justifyContent:'flex-start'}}
            iconStyle={{left:10}}
            onPress={() => props.import(selectedStep)}
          >
            Import selected activity
          </Buttons.Label>
        </View>
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
    justifyContent:'flex-end'
  },
  map:
  {
    ...G.S.center,
    ...G.S.full,
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
    height:45,
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
    borderRadius:50,
    backgroundColor:G.Colors().Highlight(),
    paddingHorizontal:5,
  },
  markerText:
  {
    fontSize:18,
    color:G.Colors().Foreground(),
  },
  buttonContainer:
  {
    ...G.S.center,
    position:'absolute',
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
    stepContainer:
    {
      ...G.S.center,
      height:100,
      aspectRatio:5,
    },
  });