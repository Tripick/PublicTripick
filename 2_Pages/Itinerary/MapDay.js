import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline, Polygon } from "react-native-maps";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
// Components
import Step from "./Step";

export default function MapDay(props)
{
  const map = React.useRef(null);
  const [day, setDay] = React.useState(props.day);
  const [mapContainerSize, setMapContainerSize] = React.useState({ height:G.Layout.window.height, width:G.Layout.window.width });
  const [mapSize, setMapSize] = React.useState({ height:G.Layout.window.height, width:G.Layout.window.width });
  const [mapReady, setMapReady] = React.useState(false);
  const [region, setRegion] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(false);
  const [route, setRoute] = React.useState([]);
  const [routeDirections, setRouteDirections] = React.useState([]);
  const markerDayRefs = React.useRef([]);
  const markerStepRefs = React.useRef([]);
  const [selectedStep, setSelectedStep] = React.useState(null);

  React.useEffect(() =>
  {
    setMapSize({ height: Math.max(100, mapContainerSize.height - props.slidingPanelHeight + 20), width:G.Layout.window.width });
  }, [mapContainerSize, props.slidingPanelHeight]);
  React.useEffect(() =>
  {
    if(props.stepToZoom !== null)
    {
      const r = getRegion();
      const isPersonnal = typeof(props.stepToZoom.visit) === 'undefined' || props.stepToZoom.visit === null;
      map.current.animateToRegion(
      {
        latitude:isPersonnal === true ? props.stepToZoom.latitude : props.stepToZoom.visit.place.latitude,
        longitude:isPersonnal === true ? props.stepToZoom.longitude : props.stepToZoom.visit.place.longitude,
        latitudeDelta:Math.min(r.latitudeDelta, G.Constants.defaultMapPoint.latitudeDelta / 10),
        longitudeDelta:Math.min(r.longitudeDelta, G.Constants.defaultMapPoint.longitudeDelta / 10)
      });
      props.setStepToZoom(null);
    }
  }, [props.stepToZoom]);

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
    let lats = day.steps.map(s => typeof(s.visit) === 'undefined' || s.visit === null ? s.latitude : s.visit.place.latitude);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let deltaLat = maxLat - minLat;
    let lons = day.steps.map(s => typeof(s.visit) === 'undefined' || s.visit === null ? s.longitude : s.visit.place.longitude);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    let deltaLon = maxLon - minLon;
    let delta = Math.max(deltaLat, deltaLon);
    if (delta === 0) delta = 1;
    // Calculate route region
    let steps = day.steps.filter(step => step.isVisit === true);
    if(steps.length > 0)
    {
      lats = steps.map(s => typeof(s.visit) === 'undefined' || s.visit === null ? s.latitude : s.visit.place.latitude);
      minLat = Math.min(...lats);
      maxLat = Math.max(...lats);
      deltaLat = maxLat - minLat;
      lons = steps.map(s => typeof(s.visit) === 'undefined' || s.visit === null ? s.longitude : s.visit.place.longitude);
      minLon = Math.min(...lons);
      maxLon = Math.max(...lons);
      deltaLon = maxLon - minLon;
      delta = Math.max(deltaLat, deltaLon);
      if (delta === 0) delta = 1;
    }
    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLon + minLon) / 2,
      latitudeDelta: deltaLat * 4,
      longitudeDelta: deltaLon * 4,
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
    const r = getRegion();
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
        //mapPadding={{top: 0, right: 0, bottom:G.Layout.window.height, left: 0}}
      >
        {Platform.OS == "android" ? <MapView.UrlTile urlTemplate={G.Constants.tileProvider} /> : <View/>}
        {getDayMarkers()}
        {getDaysLink()}
        {getStepMarkers()}
        {getRouteLines()}
        {/* <MapView.Marker
          coordinate={{ latitude: r.latitude, longitude: r.longitude }}
          tracksViewChanges={true}
          style={{zIndex:2000}}
        /> */}
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
  
  const getDayMarkers = () =>
  {
    let allMarkers = [];
    props.trip?.itinerary?.days?.filter(d => d.id !== day.id).forEach((d, i) =>
    {
      const p = props.getDayPosition(d);
      allMarkers.push(
        <MapView.Marker
          key={i}
          ref={m => markerDayRefs.current[i] = m}
          coordinate={{ latitude: p.latitude, longitude: p.longitude }}
          tracksViewChanges={false}
          onPress={() => selectDayMarker(d.id)}
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
                  color={G.Colors().Highlight(0.3)}
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
  };

  const getDaysLink = () =>
  {
    let route = [];
    props.trip?.itinerary?.days?.forEach(d => { route.push(props.getDayPosition(d)); });
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
          strokeColor={G.Colors().Highlight(0.2)}
          strokeWidth={2}
          //lineDashPattern={[0]}
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
                color={G.Colors().Highlight(0.2)}
              />
            </View>
          </MapView.Marker>
        )}
      </View>
    );
  }

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
      return typeof(s.visit) === 'undefined' || s.visit === null ?
      { latitude: s.latitude, longitude: s.longitude }
      : 
      { latitude: s.visit.place.latitude, longitude: s.visit.place.longitude };
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
            tracksViewChanges={true}
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
    setSelectedStep(step.id);
    if(markerStepRefs !== null && markerStepRefs.current && markerStepRefs.current.length > 0)
      markerStepRefs.current[i].showCallout();
    if(map !== null && map.current)
    {
      map.current.animateToRegion(
      {
        latitude:typeof(step.visit) === 'undefined' || step.visit === null ? step.latitude : step.visit.place.latitude,
        longitude:typeof(step.visit) === 'undefined' || step.visit === null ? step.longitude : step.visit.place.longitude,
        latitudeDelta:(region === null ? getRegion() : region).latitudeDelta,
        longitudeDelta:(region === null ? getRegion() : region).longitudeDelta
      });
    }
  };

  const getStepMarkers = () =>
  {
    let allMarkers = [];
    day.steps.filter(x => x.isVisit === true).forEach((step, i) =>
    {
      allMarkers.push(
        <MapView.Marker
          key={i}
          ref={m => markerStepRefs.current[i] = m}
          coordinate={typeof(step.visit) === 'undefined' || step.visit === null ? 
            { latitude:step.latitude, longitude:step.longitude }
            :
            { latitude:step.visit === null ? step.latitude : step.visit.place.latitude, longitude:step.visit === null ? step.longitude : step.visit.place.longitude }}
          tracksViewChanges={false}
          onPress={() => selectMarker(step, i)}
          style={{zIndex:1000+i}}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View>
            <View style={s.marker}>
              <View style={s.markerIcon}>
                <Displayers.Icon
                  name="circle"
                  type="mci"
                  size={45}
                  color={step.isVisit === true ? G.Colors().Green(0.8) : G.Colors().Grey(0.8)}
                />
              </View>
              <View style={s.markerTextContainer}>
                <Texts.Label style={s.markerText}>
                  {step.isVisit === true ? (step.index + 1) : "?"}
                </Texts.Label>
              </View>
            </View>
            <MapView.Callout tooltip={true} onPress={() => typeof(step.visit) === 'undefined' || step.visit === null ? props.setPersonnalToDisplay(step) : props.setPlaceToDisplay(step.visit.place.id)}>
              <View style={sTooltip.stepContainer}>
                {/* <View style={sTooltip.content}>
                  <View style={sTooltip.contentFrame}>
                    <View style={sTooltip.title}>
                      <Texts.Label style={{ ...G.S.full, fontSize: 20, color:G.Colors().Foreground() }}>
                        Step {step.index + 1}
                      </Texts.Label>
                    </View>
                    <View style={sTooltip.subTitle}>
                      <Texts.Label style={{ ...G.S.full, fontSize: 16, color:G.Colors().Foreground(0.7) }}>
                        {G.Functions.dateToText(step.time, "HH:mm")}
                      </Texts.Label>
                    </View>
                  </View>
                </View> */}
                <Step
                  zoomed={true}
                  step={step}
                  isActive={step.isVisit}
                  isFirst={true}
                  isLastActive={true}
                  isLast={true}
                  setPlaceToDisplay={() => {}}
                  setPersonnalToDisplay={() => {}}
                />
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
      <View style={s.container}
        onLayout={(event) =>
        {
          setMapContainerSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width });
          //setForceRefresh(true);
        }}
      >
        <View style={[s.map, {height:mapSize.height}]}
        >
          {getMap()}
        </View>
      </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent:'flex-start',
    backgroundColor:G.Colors().Foreground(),
  },
  map:
  {
    ...G.S.center,
    ...G.S.width(),
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
  },
  markerText:
  {
    fontSize:20,
    color:G.Colors().Foreground(),
    paddingBottom:3,
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
      aspectRatio:5.5,
      marginBottom:5,
    },
  });