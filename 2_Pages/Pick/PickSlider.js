import React from "react";
import {StyleSheet, View, Linking, Text, Animated, Image, ActivityIndicator, ScrollView} from "react-native";
import { WebView } from "react-native-webview";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline } from "react-native-maps";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Buttons from "../../Libs/Buttons";
import * as Popups from "../../Libs/Popups";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import Rater from "./Rater";
import Place from "./Place";
import Title from "./Title";

const markerSize = 50;

export default function PickSlider(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = props.goBack ? props.goBack : () => { context.navigate(props.navigation, backPage); };
  const [index, setIndex] = React.useState(props.index ? props.index : 0);
  const [showMenuPopup, setShowMenuPopup] = React.useState(false);
  const [activePresentation, setActivePresentation] = React.useState(
    props.picks[index].place.reviews === null || props.picks[index].place.reviews.length <= 0 ? 1 : 0);
  React.useEffect(() =>
  {
    if(activePresentation !== 0 && activePresentation !== 1)
      setActivePresentation(props.picks[index].place.reviews === null || props.picks[index].place.reviews.length <= 0 ? 1 : 0);
  }, [activePresentation]);
  
  const [searchByCoordinates, setSearchByCoordinates] = React.useState(false);
  
  ////////////////////////////////////// Pick display
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const [animationDirty, setAnimationDirty] = React.useState(false);
  const [animationReload, setAnimationReload] = React.useState(false);
  const snapToNext = async () =>
  {
    Animated.timing(animation, { toValue: -1, duration: 500, }).start(() =>
    {
      setIndex(Math.min(props.picks.length - 1, index + 1));
      animation.setValue(1);
      setAnimationDirty(true);
    });
  };
  const snapToPrevious = async () =>
  {
    Animated.timing(animation, { toValue: 1, duration: 500, }).start(() =>
    {
      setIndex(Math.max(0, index - 1));
      animation.setValue(-1);
      setAnimationDirty(true);
    });
  };
  React.useEffect(() =>
  {
    if(animationDirty === true)
    {
      setAnimationReload(true);
      setAnimationDirty(false);
    }
  }, [animationDirty]);
  React.useEffect(() =>
  {
    if(animationReload === true)
    {
      Animated.timing(animation, { toValue: 0, duration: 500, }).start(() =>
      {
        setAnimationReload(false);
      });
    }
    return () => { animation.stopAnimation() };
  }, [animationReload]);
  const animateSnapPosition = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-G.Layout.window.width * 2, 0, G.Layout.window.width * 2],
  });


  ////////////////////////////////////// Rating
  const [rateLoading, setRateLoading] = React.useState(false);
  const [newRating, setNewRating] = React.useState(-1);
  const onRate = (newRating) =>
  {
    if(props.picks[index].rating === newRating)
      snapToNext();
    else
    {
      setRateLoading(true);
      setNewRating(newRating);
    }
  };
  React.useEffect(() =>
  {
    if(newRating !== -1)
    {
      props.savePick(props.trip?.id, props.picks[index].idPlace, newRating);
      setNewRating(-1);
      snapToNext();
    }
  }, [newRating]);
  React.useEffect(() =>
  {
    setRateLoading(false);
  }, [props.picks]);

  ////////////////////////////////////// Menu popup
  let actions = [];
  if(props.mode === "Place") actions.push({ label:"Modify this place", icon:"pencil-outline", type:"mci", action:() => { setShowMenuPopup(false); modifyPlace();}});
  actions.push({ label:"Search by " + (searchByCoordinates === false ? "coordinates" : "name"), icon:"map-marker-question-outline", type:"mci", action:() => { setShowMenuPopup(false); setSearchByCoordinates(!searchByCoordinates); }});
  actions.push({ label:"Reload page", icon:"reload", type:"mci", action:() => { setShowMenuPopup(false); setActivePresentation(2); }});
  actions.push({ label:"Web search", icon:"web", type:"mci", action:() => { setShowMenuPopup(false); Linking.openURL(G.Constants.googleSearchWeb + props.picks[index].place?.country + '+' + props.picks[index].place?.name); }});
  actions.push({ label:"Report a problem", icon:"alert", type:"mci", color:G.Colors().Fatal, backgroundColor:G.Colors().Foreground(), action:() => { setShowMenuPopup(false); console.log("Report!");}});
  
  const getMenuPopup = () =>
  {
    const place = props.picks[index].place;
    return (
      <Popups.Popup
        transparent={true}
        containerStyle={{ ...G.S.width(85) }}
        visible={showMenuPopup}
        hide={() => setShowMenuPopup(false)}
      >
        <View style={sPopup.container}>
          <View style={sPopup.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name="map-marker-outline"
              type="mci"
              size={40}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={sPopup.pickStats}>
            <Texts.Label>
              <Text style={{ fontSize: 20, color:G.Colors().Neutral() }}>
                {place?.nameTranslated + "\n\n"}
              </Text>
              <Text style={{ fontSize: 11, color:G.Colors().Neutral(0.6) }}>
                Pick number {props.existingPicksCount + index}
              </Text>
            </Texts.Label>
          </View>
          <View style={sPopup.actionsList}>
            {actions.map((action, index) => getAction(action, index))}
          </View>
        </View>
      </Popups.Popup>
    );
  };
  const getAction = (action, i) =>
  {
    return(
      <View key={i} style={sAction.container}>
        <Displayers.Touchable onPress={action.action}>
          <View style={[sAction.content, action.backgroundColor ? {backgroundColor:action.backgroundColor} : {}]}>
            <View style={sAction.icon}>
              {action.image ?
                <Image
                  source={action.image}
                  style={{ height: 28, width: 28 }}
                  imageStyle={{ resizeMode: "contain" }}
                /> :
                <Displayers.Icon
                  alignWidth
                  dark
                  noBackground
                  name={action.icon}
                  type={action.type}
                  size={25}
                  color={action.color ? action.color : G.Colors().Foreground()}
                />
              }
            </View>
            <View style={sAction.label}>
              <Texts.Label left style={{ ...G.S.width(), fontSize: 14, color: action.color ? action.color : G.Colors().Foreground() }}>
                {action.label}
              </Texts.Label>
            </View>
            <View style={sAction.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={action.color ? action.color : G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const modifyPlace = () =>
  {
    const place = props.picks[index].place;
    setContext(
    {
      ...context,
      previousPageName:"Place",
      currentPlace:{...place, reviews: [...place.reviews]},
    });
    context.navigate(props.navigation, "ModifyPlace");
  };

  ////////////////////////////////////// Use effects
  React.useEffect(() => { setIndex(props.index); }, [props.index]);
  React.useEffect(() => { props.onIndexChange(index) }, [index]);
  React.useEffect(() =>
  {
    if(props.picks === null || props.picks.length === 0 || index >= props.totalPicksCount)
      props.goBack();
  }, [props.picks, index, props.totalPicksCount]);

  const [webViewSize, setWebViewSize] = React.useState(0);
  const getTripickView = () =>
  {
    return (
      <View style={s.pickContainer}>
        <View style={s.pickContainerFrame}>
          <Place
            mode={"Pick"}
            index={index}
            currentIndex={index}
            active={true}
            trip={props.trip}
            place={props.picks[index].place}
            goBack={goBack}
            existingPicksCount={props.existingPicksCount+1}
            totalPicksCount={props.totalPicksCount}
          />
        </View>
      </View>
    );
  };
  const getWebView = () =>
  {
    let uri = G.Constants.googlePlacesQuery;
    if(searchByCoordinates === true || typeof(props.picks[index].place.address) === 'undefined' || props.picks[index].place.address === null)
    {
      uri += G.Functions.cleanCoordinate(props.picks[index].place.latitude);
      uri += "," + G.Functions.cleanCoordinate(props.picks[index].place.longitude);
    }
    else
    {
      uri += '"' + props.picks[index].place.name + '"';
      uri += '+' + props.picks[index].place.country;
      uri += '+' + G.Functions.cleanAddress(props.picks[index].place.address);
    }
    return (
      <View style={s.webView}>
        <View style={s.webViewContainer} onLayout={(event) => setWebViewSize(event.nativeEvent.layout.width)}>
          <View style={s.webViewContainerFrame}>
            <View style={s.webViewFrameAjuster}>
              <WebView
                source={{ uri: uri }}
                style={[s.webViewContent, {width:webViewSize*1.25+1}]}
                javaScriptEnabled={true}
                // onShouldStartLoadWithRequest={event =>
                // {
                //   Linking.openURL(event.url);
                //   return false;    
                // }}
              />
            </View>
          </View>
        </View>
        <View style={s.legendContainer}>
          <View style={s.googleProperty}>
            <Image source={G.Images.googleTrademark} style={{...G.S.height(45)}} resizeMode="contain" />
          </View>
          <Displayers.TouchableOverlay onPress={() => Linking.openURL(uri)} />
        </View>
      </View>
    );
  };
  const getMap = (mSize) =>
  {
    return (
      <MapView
        style={{ ...G.S.mapHd(mSize)}}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.NONE}
        initialRegion={getRegion()}
        rotateEnabled={false}
        pitchEnabled={false}
        onMapReady={() => setTimeout(() => setMapReady(true), 500)}
      >
        {Platform.OS == "android" ? <MapView.UrlTile urlTemplate={G.Constants.tileProvider} /> : <View/>}
        {props.trip !== null && typeof(props.trip?.polygon) !== 'undefined'  && props.trip?.polygon !== null ?
          <Polyline
            style={{zIndex:10}}
            coordinates={props.trip?.polygon}
            strokeColor={G.Colors().Highlight()}
            strokeWidth={3}
            lineDashPattern={[1]}
          />
          :
          <View/>
        }
        {getAllMarkers()}
      </MapView>
    );
  };
  const getMapView = () =>
  {
    return (
      <View style={sMap.mapFrame}>
        <View style={sMap.mapContainer} onLayout={(event) =>
          {
            setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width });
            setForceRefresh(true);
          }}
        >
          {mapSize !== null ? getMap(mapSize) : getMap({height: G.Layout.window.height, width:G.Layout.window.width })}
        </View>
      </View>
    );
  };

  let presentations = [];
  presentations.push({ index:0, label:"Tripick", icon:"rocket-outline", type:"mci", image:G.Images.logoLightTiny });
  presentations.push({ index:1, label:"Google", icon:"web", type:"mci", image:G.Images.googleMapsIcon });
  const getPickPage = () =>
  {
    return (
      <View style={s.pickCardContent}>
        <View style={s.pickCardContentFrame}>
          {
            activePresentation >= presentations.length ? <View/> :
            presentations[activePresentation].label === "Google" ? getWebView() :
            getTripickView()
          }
        </View>
      </View>
    );
  };

  const [mapSize, setMapSize] = React.useState(null);
  const [mapReady, setMapReady] = React.useState(false);
  const [selectedMarker, setSelectedMarker] = React.useState(null);
  const [forceRefresh, setForceRefresh] = React.useState(false);
  React.useEffect(() => { setForceRefresh(true); }, [mapSize]);
  React.useEffect(() => { setForceRefresh(false); }, [forceRefresh]);
  React.useEffect(() => { setForceRefresh(!forceRefresh); }, [props.picks, index]);
  const getRegion = () =>
  {
    const delta = Math.min(props.trip === null ? G.Constants.defaultMapPoint.latitudeDelta : props.trip?.region.latitudeDelta, 30);
    return {
      latitude: props.picks[index].place.latitude,
      longitude: props.picks[index].place.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta
    };
  };
  const getAllMarkers = () =>
  {
    const nameMaxLength = 30;
    let allMarkers = [];
    props.picks.forEach(p =>
    {
      allMarkers.push(
        <MapView.Marker
          key={p.idPlace}
          coordinate={{ latitude: p.place.latitude, longitude: p.place.longitude }}
          style={[sMap.markerContainer, p.idPlace === props.picks[index].idPlace || p.idPlace === selectedMarker ? {zIndex: 2} : {zIndex: 1}]}
          opacity={p.idPlace === props.picks[index].idPlace ? 1 : 0.7}
          tracksViewChanges={true}
          onPress={() => onSelectMarker(p.idPlace)}
          icon={p.idPlace === props.picks[index].idPlace ? G.Images.pickPoint : (p.idPlace === selectedMarker ? G.Images.pickPointSelected : G.Images.pickPointInactive)}
        >
          <MapView.Callout tooltip={true} onPress={() => onGoToMarker(p.idPlace)}>
            <View style={sTooltip.container}>
              <View style={sTooltip.content}>
                <View style={sTooltip.contentFrame}>
                  <View style={sTooltip.title}>
                    <Texts.Label style={{ ...G.S.full, fontSize: 20, color:G.Colors().Foreground() }}>
                      {p.place.nameTranslated.substring(0, nameMaxLength) + (p.place.nameTranslated.length > nameMaxLength ? "..." : "")}
                    </Texts.Label>
                  </View>
                  <View style={sTooltip.rating}>
                    {Platform.OS == "android" ? 
                      <Displayers.Rating
                        iconSize={p.rating >= 0 ? 30 : 25}
                        votes={p.rating >= 0 ? -1 : p.place.nbRating}
                        value={p.rating >= 0 ? p.rating : p.place.rating}
                        color={G.Colors().Foreground()}
                        labelStyle={{fontSize:18, paddingTop:3}}
                        activeImage={p.rating >= 0 ? G.Images.picksIconMini : G.Images.star}
                        inactiveImage={p.rating >= 0 ? G.Images.picksIconDisabledMini : G.Images.starDisabled}
                      />
                      :
                      <Displayers.RatingIos
                        iconSize={p.rating >= 0 ? 30 : 25}
                        votes={p.rating >= 0 ? -1 : p.place.nbRating}
                        value={p.rating >= 0 ? p.rating : p.place.rating}
                        color={G.Colors().Foreground()}
                        labelStyle={{fontSize:18, paddingTop:3}}
                        activeImage={p.rating >= 0 ? G.Images.picksIconMini : G.Images.star}
                        inactiveImage={p.rating >= 0 ? G.Images.picksIconDisabledMini : G.Images.starDisabled}
                      />
                    }
                  </View>
                  <View style={sTooltip.chevron}>
                    <Displayers.Icon
                      alignWidth
                      name="chevron-right"
                      type="mci"
                      size={25}
                      color={G.Colors().Highlight()}
                    />
                  </View>
                </View>
              </View>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
    return allMarkers;
  }
  const onSelectMarker = (id) =>
  {
    setSelectedMarker(id);
  };
  const onGoToMarker = (id) =>
  {
    const selectedPick = props.picks.filter(p => p.idPlace === id)[0];
    setIndex(props.picks.indexOf(selectedPick));
    const presToDisplay = selectedPick.place.reviews === null || selectedPick.place.reviews.length <= 0 ? 1 : 0
    switchView(presToDisplay);
  };

  const switchView = (i) =>
  {
    setActivePresentation(i);
  };

  return (
    <Wrappers.AppFrame loading={loading}>
      <View style={s.container}>
        <View style={s.visibleFrame}>
          <View style={s.pickPageContainer}>
            <View style={s.headerContainer}>
              <Title
                mode={"Pick"}
                place={props.picks[index].place}
                goBack={goBack}
                showMenuPopup={() => setShowMenuPopup(true)}
                loading={rateLoading}
                stopLoading={() => setRateLoading(false)}
                currentRating={props.picks[index].rating}
              />
            </View>
            {props.trip === null ? <View/> :
              typeof(props.trip.reviews) === 'undefined' || props.trip.reviews === null || props.trip.reviews.length === 0 ?
                <View style={s.actionLineContainer}>
                  <View style={s.sideActionContainer}>
                    <View style={s.buttonAndTitle}>
                      <View style={s.batButton}>
                        <Buttons.Round
                          backgroundBright
                          name="filter"
                          type="mci"
                          size={20}
                          color={G.Colors().Highlight()}
                          onPress={() => {}}
                          containerStyle={{padding:2}}
                          contentStyle={{}}
                        />
                      </View>
                      <View style={s.batTitle}>
                        <Texts.Label>
                          <Text style={{ fontSize: 14, color:G.Colors().Foreground()}}>
                            Filter places
                          </Text>
                        </Texts.Label>
                      </View>
                      <Displayers.TouchableOverlay onPress={() => props.setShowFiltersPopup(true)} />
                    </View>
                  </View>
                  <View style={[s.sideActionContainer, {justifyContent:'flex-end'}]}>
                    <View style={[s.buttonAndTitle, {marginLeft:0, marginRight:5}]}>
                      <View style={[s.batTitle, {marginLeft:0, marginRight:-10}]}>
                        <Texts.Label>
                          <Text style={{ fontSize: 14, color:G.Colors().Foreground()}}>
                            My itinerary
                          </Text>
                        </Texts.Label>
                      </View>
                      <View style={s.batButton}>
                        <Wrappers.CircleOverlay
                          size={20}
                          name="go-kart-track"
                          type="mci"
                          iconColor={G.Colors().Highlight()}
                          backgroundColor={G.Colors().Foreground()}
                          fogColor={G.Colors().Highlight(0.8)}
                          percent={props.itineraryPercentIndicator}
                          containerStyle={{...G.S.height(), margin:0}}
                        />
                      </View>
                      <Displayers.TouchableOverlay onPress={() => props.setShowItineraryPopup(true)} />
                    </View>
                  </View>
                </View>
                :
                <View style={s.actionLineContainer}>
                  <View style={s.sideActionContainer}>
                    <Buttons.Round
                      shadow
                      backgroundBright
                      name="filter"
                      type="mci"
                      size={20}
                      color={G.Colors().Highlight()}
                      onPress={() => props.setShowFiltersPopup(true)}
                      containerStyle={{}}
                      contentStyle={{}}
                    />
                  </View>
                  <View style={s.switchContainer}>
                    <View style={[s.halfView, activePresentation === 0 ? s.halfViewActive : {}]}>
                      <Texts.Label>
                        <Text style={{ fontSize: 14, color:(activePresentation === 0 ? G.Colors().Highlight() : G.Colors().Foreground())}}>
                          Tripick
                        </Text>
                      </Texts.Label>
                    </View>
                    <View style={[s.halfView, activePresentation === 1 ? s.halfViewActive : {}]}>
                      <Texts.Label>
                        <Text style={{ fontSize: 14, color:(activePresentation === 1 ? G.Colors().Highlight() : G.Colors().Foreground())}}>
                          Google
                        </Text>
                      </Texts.Label>
                    </View>
                    <Displayers.TouchableOverlay onPress={() => setActivePresentation(activePresentation === 1 ? 0 : 1)} />
                  </View>
                  <View style={[s.sideActionContainer, {justifyContent:'flex-end'}]}>
                    <Wrappers.CircleOverlay
                      size={20}
                      name="go-kart-track"
                      type="mci"
                      iconColor={G.Colors().Highlight()}
                      backgroundColor={G.Colors().Foreground()}
                      fogColor={G.Colors().Highlight(0.8)}
                      percent={props.itineraryPercentIndicator}
                    />
                    <Displayers.TouchableOverlay onPress={() => props.setShowItineraryPopup(true)} />
                  </View>
                </View>
            }
            <Animated.View style={[s.pickCard, {marginLeft:animateSnapPosition}]}>
              {getPickPage()}
            </Animated.View>
            {props.noRater === true ?
              <View style={{...G.S.width(), height:10 }}/>
              :
              <View style={s.raterContainer}>
                {rateLoading === true ?
                  <View style={{...G.S.center, ...G.S.full}}>
                    <View style={{...G.S.center, flex:1}}>
                      <ActivityIndicator size="small" color={G.Colors().Foreground()} />
                    </View>
                    <View style={{...G.S.center, flex:1.3, justifyContent:"flex-start"}}>
                      <Texts.Label style={{color:G.Colors().Foreground()}}>Saving...</Texts.Label>
                    </View>
                  </View>
                  :
                  <Rater
                    showRater={true}
                    onRate={onRate}
                    snapToPrevious={snapToPrevious}
                    snapToNext={snapToNext}
                    existingPicksCount={props.existingPicksCount}
                    index={index+1}
                    totalPicksCount={props.totalPicksCount}
                  />
                }
              </View>
            }
            {props.noRater === true ?
              <View/>
              :
              <View style={s.totals}>
                <Texts.Label style={{fontSize:10, color:G.Colors().Foreground()}}>
                  {props.existingPicksCount + " / " + props.globalPicksCount}
                </Texts.Label>
              </View>
            }
            {getMenuPopup()}
          </View>
        </View>
      </View>
    </Wrappers.AppFrame>
  );
}

const borderRadius = 20;
let s = StyleSheet.create(
{
  container:
  {
    ...G.S.full,
    backgroundColor:G.Colors().Highlight()
  },
  visibleFrame:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Highlight(),
  },
  headerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 5,
  },
  actionLineContainer:
  {
    ...G.S.center,
    ...G.S.width(96),
    aspectRatio: 8,
    flexDirection:'row',
    marginTop:-5,
  },
  switchContainer:
  {
    ...G.S.center,
    ...G.S.height(75),
    flex:4,
    flexDirection:'row',
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    padding:3,
  },
  halfView:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    borderRadius:100,
  },
  halfViewActive:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(),
  },
  sideActionContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  buttonAndTitle:
  {
    ...G.S.center,
    ...G.S.height(80),
    flexDirection:'row',
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    marginLeft:5,
  },
  batButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
  },
  batTitle:
  {
    ...G.S.center,
    ...G.S.height(),
    paddingHorizontal:20,
    marginLeft:-10,
  },
  pickCard:
  {
    ...G.S.center,
    ...G.S.width(96),
    flex:1,
    padding:5,
  },
  pickCardContent:
  {
    ...G.S.center,
    ...G.S.full,
    ...G.S.shadow(3),
    borderRadius:borderRadius,
    //borderWidth:2,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Foreground(),
  },
  pickCardContentFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:borderRadius-3,
    backgroundColor:G.Colors().Foreground(),
  },
  pickContainer:
  {
    ...G.S.center,
    flex:1,
  },
  raterContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    //overflow: "visible",
    zIndex:1001,
  },
  totals:
  {
    ...G.S.center,
    ...G.S.width(),
    marginBottom:5
  },
  pickPageContainer:
  {
    ...G.S.center,
    ...G.S.full,
  },
  webView:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    overflow: "visible",
  },
  webViewContainer:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.width(),
    flex:1,
    borderBottomLeftRadius:borderRadius,
    borderBottomRightRadius:borderRadius,
    zIndex:3,
    backgroundColor:G.Colors().Background(),
  },
  webViewContainerFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderBottomLeftRadius:borderRadius-3,
    borderBottomRightRadius:borderRadius-3,
    zIndex:4,
  },
  webViewFrameAjuster:
  {
    ...G.S.height(125),
    ...G.S.width(125),
    transform: [{ scale: 0.8 }],
  },
  webViewContent:
  {
    ...G.S.center,
  },
  legendContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    paddingTop:borderRadius,
    marginTop:-borderRadius,
    backgroundColor:G.Colors().Background(),
    overflow:'visible',
    zIndex:2,
  },
  googleProperty:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(),
    flexDirection:'row',
  },
});

let sPopup = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:4,
    paddingTop:"5%",
    paddingBottom:15,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  pickStats:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:20,
  },
  actionsList:
  {
    ...G.S.center,
    ...G.S.width(),
  },
});

let sAction = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:5,
    marginTop:5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(90),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
    marginTop:0,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
    overflow:'visible'
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    paddingLeft:5,
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom: 2,
    paddingLeft:5,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: "3%",
    position:'absolute',
    right:0,
  },
});

let sMap = StyleSheet.create({
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

let sTooltip = StyleSheet.create(
  {
    container:
    {
      ...G.S.center,
      height:75,
      width:350,
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
      borderRadius: 100,
      borderWidth:2,
      borderColor:G.Colors().Foreground(),
      backgroundColor:G.Colors().Highlight(),
    },
    title:
    {
      ...G.S.center,
      ...G.S.width(),
      maxWidth:"100%",
      flex:1.5,
    },
    rating:
    {
      ...G.S.center,
      ...G.S.width(),
      flex:1,
      marginTop:-7,
      marginBottom:7,
    },
    chevron:
    {
      ...G.S.center,
      position:'absolute',
      right:10,
      paddingLeft:1,
      borderRadius:100,
      backgroundColor:G.Colors().Foreground(),
    },
  });