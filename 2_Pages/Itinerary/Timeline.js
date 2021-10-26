import React from "react";
import { StyleSheet, View, Linking, ScrollView, Animated, Text } from "react-native";
import SlidingUpPanel from 'rn-sliding-up-panel';
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Pickers from "../../Libs/Pickers";
// Components
import Step from "./Step";

export default function Timeline(props)
{
  const initPosition = 0.6;
  const slidingPanel = React.useRef(null);
  const [day, setDay] = React.useState(props.day);
  const [slidingPanelHeight, setSlidingPanelHeight] = React.useState(
    props.slidingPanelHeight !== 0 ? props.slidingPanelHeight : props.cardSize*initPosition);
  const [panelSlideEnded, setPanelSlideEnded] = React.useState(false);
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const [stepToEditName, setStepToEditName] = React.useState(null);
  const [stepToEditTime, setStepToEditTime] = React.useState(null);

  const routeOfDay = () =>
  {
    const steps = day.steps.filter(s => s.isVisit === true);
    if(typeof(steps) === 'undefined' || steps === null || steps.length <= 0)
    {
      props.displayMessage("Unable to display directions\nfor days without activities.", 2000, "information-outline");
    }
    else if(steps.length === 1)
    {
      const lat = day.steps[0].visit === null ? day.steps[0].latitude : day.steps[0].visit.place.latitude;
      const lon = day.steps[0].visit === null ? day.steps[0].longitude : day.steps[0].visit.place.longitude;
      let url = G.Constants.googlePlacesQuery + G.Functions.cleanCoordinate(lat) + "," + G.Functions.cleanCoordinate(lon);
      Linking.openURL(url);
    }
    else
    {
      let url = G.Constants.googleMultiDir;
      steps.forEach(s =>
      {
        const lat = s.visit === null ? s.latitude : s.visit.place.latitude;
        const lon = s.visit === null ? s.longitude : s.visit.place.longitude;
        url += G.Functions.cleanCoordinate(lat) + "," + G.Functions.cleanCoordinate(lon) + "/";
      });
      Linking.openURL(url);
    }
  };
  const directionsTo = () =>
  {
    const steps = day.steps.filter(s => s.isVisit === true);
    if(typeof(steps) === 'undefined' || steps === null || steps.length <= 0)
    {
      props.displayMessage("Unable to display directions\nfor days without activities.", 2000, "information-outline");
    }
    else
    {
      const indexOfDay = props.trip.itinerary.days.indexOf(day);
      const dayPosition = props.getDayPosition(day);
      const previousDay = props.trip.itinerary.days[indexOfDay - 1];
      const previousDayPosition = typeof(previousDay) === 'undefined' || previousDay === null ?
        null : props.getDayPosition(previousDay, true);
      
      let startLat = typeof(previousDayPosition) === 'undefined' || previousDayPosition === null ? 0 : previousDayPosition.latitude;
      let startLon = typeof(previousDayPosition) === 'undefined' || previousDayPosition === null ? 0 : previousDayPosition.longitude;
      let endLat = typeof(dayPosition) === 'undefined' || dayPosition === null ? 0 : dayPosition.latitude;
      let endLon = typeof(dayPosition) === 'undefined' || dayPosition === null ? 0 : dayPosition.longitude;
      let url = G.Constants.googleDirectionsToLatLonWithOrigin + startLat + "," + startLon + "&destination=";
      if(previousDayPosition === null)
        url = G.Constants.googleDirectionsToLatLon;
      Linking.openURL(url + endLat + "," + endLon);
    }
  };

  const getDayName = () =>
  {
    return day !== null && typeof(day.name) !== 'undefined' && day.name !== null && day.name.length > 0 ?
      day.name : props.defaultDayName;
  };

  const updateStep = (step) =>
  {
    setStepToEditName(null);
    setStepToEditTime(null);
    step.name = G.Functions.cleanText(step.name);
    props.updateStep(step);
  };

  const getCard = () =>
  {
    if(day === null || day.id !== props.day.id)
      return <View/>;
    return (dragHandler => (
      <View style={s.cardContainer}>
        <View style={s.card}>
          <Animated.View style={[s.cardFrame, {height:animation}]}>
            <View style={s.slidingBarContainer} {...dragHandler}>
              <View style={s.slidingBar}/>
              <Displayers.TouchableOverlay
                onPress={() => scrollTo(slidingPanelHeight === props.cardSize ? props.cardSize*initPosition : props.cardSize)}
              />
            </View>
            <View style={s.dayNameContainer} {...dragHandler}>
              <Displayers.Touchable onPress={props.showDayNamePopup}>
                <Texts.Label style={{}}>
                  <Text style={{fontSize: 12, color:G.Colors().Neutral(getDayName() === props.defaultDayName ? 0.5 : 0.7)}}>
                    {getDayName()}
                  </Text>
                </Texts.Label>
              </Displayers.Touchable>
            </View>
            <View style={s.actionLine} {...dragHandler}>
              <View style={s.actionLineButton}>
                <View style={s.buttonAndTitle}>
                  <View style={s.batButton}>
                    <Buttons.Round
                      noBackground
                      name="directions"
                      type="mci"
                      size={20}
                      color={G.Colors().Foreground()}
                      onPress={directionsTo}
                      containerStyle={{padding:0, paddingLeft:2}}
                      contentStyle={{}}
                    />
                  </View>
                  <View style={s.batTitle}>
                    <Displayers.Touchable onPress={directionsTo}>
                      <Texts.Label style={{...G.S.height()}} singleLine>
                        <Text style={{fontSize: 12, color:G.Colors().Highlight()}}>
                          {"Go to day " + (props.day.index + 1)}
                        </Text>
                      </Texts.Label>
                    </Displayers.Touchable>
                  </View>
                </View>
              </View>
              <View style={[s.actionLineButton, {...G.S.center, flex:0.5}]}>
                <View style={s.buttonActivities}>
                  <Buttons.Round
                    noBackground
                    name="menu"
                    type="mci"
                    size={20}
                    color={G.Colors().Foreground()}
                    onPress={() => props.setShowActivitiesPopup(true)}
                    containerStyle={{padding:0, paddingLeft:0}}
                    contentStyle={{}}
                  />
                </View>
              </View>
              <View style={[s.actionLineButton, {flexDirection:'row', justifyContent:'flex-end'}]}>
                <View style={s.buttonAndTitle}>
                  <View style={s.batTitle}>
                    <Displayers.Touchable onPress={routeOfDay}>
                      <Texts.Label style={{...G.S.height()}} singleLine>
                        <Text style={{...G.S.width(), fontSize: 12, color:G.Colors().Highlight()}}>
                          Day itinerary
                        </Text>
                      </Texts.Label>
                    </Displayers.Touchable>
                  </View>
                  <View style={[s.batButton, {marginRight:-1}]}>
                    <Buttons.Round
                      noBackground
                      name="map-marker-path"
                      type="mci"
                      size={20}
                      color={G.Colors().Foreground()}
                      onPress={routeOfDay}
                      containerStyle={{padding:0, paddingRight:2}}
                      contentStyle={{}}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={s.content}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={s.list}
                contentContainerStyle={{ ...G.S.center, paddingTop:G.Layout.window.width / 20 + 10, paddingBottom:5 }}
              >
                {getVisits()}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
        <Pickers.Multilines
          top={true}
          width={96}
          maxLength={500}
          show={stepToEditName !== null}
          hide={() => setStepToEditName(null)}
          value={stepToEditName === null ? "" : stepToEditName.name}
          icon="tag-text-outline"
          title={"Give this activity a memorable name"}
          save={(name) => updateStep({...stepToEditName, name:name})}
        />
        <Pickers.Time
          visible={stepToEditTime !== null}
          date={G.Functions.toMoment(stepToEditTime === null || typeof(stepToEditTime.time) === 'undefined' || stepToEditTime.time === null ? day.date : stepToEditTime.time)}
          onChange={(newTime) => {if (typeof(newTime?.nativeEvent?.timestamp) !== "undefined") updateStep({...stepToEditTime, time:newTime.nativeEvent.timestamp}); else setStepToEditTime(null);}}
        />
      </View>
      )
    );
  };

  const getVisits = () =>
  {
    let visits = [];
    const steps = day.steps.filter(s => s.isVisit === true);
    for(let i = 0; i < steps.length; i++)
    {
      visits.push(<Step
        key={i}
        step={steps[i]}
        isActive={steps[i].isVisit}
        isFirst={steps[i].index === 0}
        isLastActive={steps[i].isVisit === true && ((i + 1) === steps.length || steps[i + 1].isVisit === false)}
        isLast={(i + 1) === steps.length}
        setPlaceToDisplay={props.setPlaceToDisplay}
        setPersonnalToDisplay={props.setPersonnalToDisplay}
        setStepToEditName={setStepToEditName}
        setStepToEditTime={setStepToEditTime}
        setStepToZoom={props.setStepToZoom}
      />);
    }
    // visits.push(
    //   <View key={-1} style={s.suggestionsContainer}>
    //     <View style={s.suggestions}>
    //       <Texts.Label style={{...G.S.width()}}>
    //         <Text style={{...G.S.width(), fontSize: 12, color:G.Colors().Foreground()}}>
    //           {"Manage activities (" + day.steps.length +")"}
    //         </Text>
    //       </Texts.Label>
    //     </View>
    //     <Displayers.TouchableOverlay onPress={() => props.setShowActivitiesPopup(true)} />
    //   </View>
    // );
    return visits;
  };

  const scrollTo = (valueToScroll) =>
  {
    // To enable animation on slide up : velocity:valueToScroll === props.cardSize ? 0 : 1
    slidingPanel.current.show({toValue:valueToScroll, velocity:100});
    setSlidingPanelHeight(valueToScroll);
    setPanelSlideEnded(true);
  };

  React.useEffect(() =>
  {
    scrollTo(props.slidingPanelHeight === 0 ? props.cardSize * initPosition : props.slidingPanelHeight);
    return () => animation.stopAnimation();
  }, []);
  React.useEffect(() => { setDay(props.day); }, [props.day]);
  React.useEffect(() =>
  {
    Animated.timing(animation, { toValue: slidingPanelHeight + 5, duration: 100, }).start();
    props.setSlidingPanelHeight(slidingPanelHeight);
  }, [slidingPanelHeight]);
  React.useEffect(() =>
  {
    if(panelSlideEnded === true)
    {
      setPanelSlideEnded(false);
      props.setSlidingPanelHeightFinal(slidingPanelHeight);
    }
  }, [panelSlideEnded]);

  return (
    <SlidingUpPanel
      ref={slidingPanel}
      visible={true}
      height={props.cardSize}
      draggableRange={{top: props.cardSize, bottom: props.cardSize*0.2}}
      backdropOpacity={0}
      showBackdrop={false}
      allowMomentum={false}
      onDragStart={(pos) => setSlidingPanelHeight(props.cardSize)}
      onDragEnd={(pos) => { setSlidingPanelHeight(pos); setPanelSlideEnded(true); } }
      onMomentumDragEnd={(pos) => { setSlidingPanelHeight(pos); setPanelSlideEnded(true); }}
    >
      {getCard()}
    </SlidingUpPanel>
  );
}

const s = StyleSheet.create(
{
  cardContainer:
  {
    ...G.S.center,
    ...G.S.full,
  },
  card:
  {
    ...G.S.center,
    ...G.S.full,
    ...G.S.shadow(3),
    borderWidth:1.4,
    borderColor:G.Colors().Neutral(0.1),
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    backgroundColor:G.Colors().Foreground(),
    justifyContent:'flex-start',
  },
  cardFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:25,
    backgroundColor:G.Colors().Foreground(),
  },
  slidingBarContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    height:30,
    paddingVertical:5,
  },
  slidingBar:
  {
    ...G.S.center,
    height:4,
    ...G.S.width(25),
    borderRadius:5,
    backgroundColor:G.Colors().Neutral(0.2),
  },
  dayNameContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    paddingTop:5,
    paddingBottom:20,
  },
  actionLine:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    paddingHorizontal:"3%",
    flexDirection:'row',
    zIndex:2,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginVertical:5,
    marginTop:-G.Layout.window.width / 20,
    borderTopWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Background(),
    zIndex:1,
  },
  list:
  {
    ...G.S.full,
  },
  suggestionsContainer:
  {
    ...G.S.center,
    ...G.S.width(96),
    marginTop:5,
    marginBottom:10,
  },
  suggestions:
  {
    ...G.S.center,
    paddingTop:9,
    paddingBottom:10,
    paddingHorizontal:25,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  actionLineButton:
  {
    ...G.S.height(),
    flex:1,
  },
  buttonAndTitle:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:3.5,
    flexDirection:'row',
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  batButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    backgroundColor:G.Colors().Highlight(),
  },
  batTitle:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom:1,
  },
  buttonActivities:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
  },
});
