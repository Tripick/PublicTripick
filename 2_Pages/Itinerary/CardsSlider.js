import React from "react";
import {StyleSheet, View, Animated} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Pickers from "../../Libs/Pickers";
// Components
import Map from "./Map";
import MapDay from "./MapDay";
import Timeline from "./Timeline";
import ActivityPopup from "./ActivityPopup";
import TripContent from "../Trip/TripContent";
import PersonnalActivityPopupReadOnly from "./PersonnalActivityPopupReadOnly";

export default function CardsSlider(props)
{
  const [currentDayId, setCurrentDayId] = React.useState(props.currentDayId);
  const [currentDay, setCurrentDay] = React.useState(
    props.currentDayId <= -1 ? null : props.trip.itinerary.days.filter(d => d.id === props.currentDayId)[0]);
  const [cardSize, setCardSize] = React.useState(0);
  const [selectedStep, setSelectedStep] = React.useState(null);
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const [animationDirty, setAnimationDirty] = React.useState(false);
  const [animationReload, setAnimationReload] = React.useState(false);
  const [slidingPanelHeight, setSlidingPanelHeight] = React.useState(0);
  const [slidingPanelHeightFinal, setSlidingPanelHeightFinal] = React.useState(0);
  const [showActivitiesPopup, setShowActivitiesPopup] = React.useState(false);
  const [showNameInput, setShowNameInput] = React.useState(false);
  const [personnalToDisplay, setPersonnalToDisplay] = React.useState(null);
  const [stepToZoom, setStepToZoom] = React.useState(null);
  
  const defaultDayName = "Describe this day in a few words...";
  const getDayName = () =>
  {
    return currentDay !== null && typeof(currentDay.name) !== 'undefined' &&
      currentDay.name !== null && currentDay.name.length > 0 ? currentDay.name : "";
  };
  const updateDayName = (newName) =>
  {
    setShowNameInput(false);
    props.updateDayName(currentDay.id, newName);
  };
  
  const snap = async () =>
  {
    if(props.currentDayId !== currentDayId)
    {
      let animDirection = 1;
      if(props.currentDayId <= -1)
        animDirection = currentDayId < props.currentDayId ? -1 : 1;
      else
      {
        const oldDayIndex = props.trip.itinerary.days.indexOf(props.trip.itinerary.days.filter(d => d.id === currentDayId)[0]);
        const newDayIndex = props.trip.itinerary.days.indexOf(props.trip.itinerary.days.filter(d => d.id === props.currentDayId)[0]);
        animDirection = (oldDayIndex < newDayIndex ? -1 : 1);
      }
      Animated.timing(animation, { toValue: animDirection, duration: 500, }).start(() =>
      {
        setCurrentDayId(-3);
        setCurrentDay(null);
        animation.setValue(-animDirection);
        setAnimationDirty(true);
      });
    }
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
        setCurrentDayId(props.currentDayId);
        setAnimationReload(false);
      });
    }
    return () => { animation.stopAnimation() };
  }, [animationReload]);
  const animateSnapPosition = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-G.Layout.window.width * 2, 0, G.Layout.window.width * 2],
  });
  React.useEffect(() =>
  {
    snap();
  }, [props.currentDayId]);
  React.useEffect(() =>
  {
    if(currentDayId >= -2)
      setCurrentDay(currentDayId <= -1 ? null : props.trip.itinerary.days.filter(d => d.id === currentDayId)[0]);
  }, [props.trip, currentDayId]);

  const selectStep = (id) =>
  {
    setSelectedStep(currentDay.steps.filter(s => s.id === id)[0]);
  };

  const saveSteps = (idDay, steps) =>
  {
    setShowActivitiesPopup(false);
    props.saveSteps(idDay, steps);
  };

  const getDay = () =>
  {
    if(currentDayId <= -1 || currentDay === null) return <View/>;
    return (
      <View style={s.day} onLayout={(event) => setCardSize(event.nativeEvent.layout.height)}>
        <MapDay
          trip={props.trip}
          day={currentDay}
          selectDay={props.selectDay}
          selectStep={selectStep}
          setPlaceToDisplay={props.setPlaceToDisplay}
          slidingPanelHeight={slidingPanelHeightFinal}
          setPersonnalToDisplay={setPersonnalToDisplay}
          stepToZoom={stepToZoom}
          setStepToZoom={setStepToZoom}
          getDayPosition={props.getDayPosition}
          isOwner={props.isOwner}
        />
        {cardSize === 0 ? <View/> :
          <Timeline
            trip={props.trip}
            day={currentDay}
            daysCount={props.trip?.itinerary?.days?.length}
            cardSize={cardSize}
            slidingPanelHeight={slidingPanelHeight}
            setSlidingPanelHeight={setSlidingPanelHeight}
            setSlidingPanelHeightFinal={setSlidingPanelHeightFinal}
            setShowActivitiesPopup={setShowActivitiesPopup}
            setPlaceToDisplay={props.setPlaceToDisplay}
            defaultDayName={defaultDayName}
            showDayNamePopup={() => setShowNameInput(true)}
            displayMessage={props.displayMessage}
            getDayPosition={props.getDayPosition}
            updateStep={props.updateStep}
            setPersonnalToDisplay={setPersonnalToDisplay}
            setStepToZoom={setStepToZoom}
            isOwner={props.isOwner}
          />
        }
        {currentDay === null ? <View/> :
          <ActivityPopup
            show={showActivitiesPopup}
            hide={() => setShowActivitiesPopup(false)}
            trip={props.trip}
            day={currentDay}
            save={saveSteps}
            import={props.saveSteps}
            setPlaceToDisplay={props.setPlaceToDisplay}
            setStepToMove={props.setStepToMove}
            navigation={props.navigation}
            getDayPosition={props.getDayPosition}
            displayMessage={props.displayMessage}
            isOwner={props.isOwner}
          />
        }
        <Pickers.Multilines
          top={true}
          width={96}
          maxLength={500}
          show={showNameInput}
          hide={() => setShowNameInput(false)}
          value={getDayName()}
          icon="calendar-month"
          title={currentDay === null ? "" : ("Day " + (currentDay.index + 1) + "\n" + G.Functions.dateToText(currentDay.date))}
          save={updateDayName}
        />
        <PersonnalActivityPopupReadOnly
          show={personnalToDisplay !== null}
          hide={() => setPersonnalToDisplay(null)}
          activity={personnalToDisplay}
          day={currentDay}
          getDayPosition={props.getDayPosition}
        />
      </View>
    );
  };

  const getCard = () =>
  {
    return (
      <View style={s.cardContent}>
        <View style={s.cardContentFrame}>
          {currentDayId === -2 ? getSettings() : currentDayId === -1 ? getMap() : getDay()}
        </View>
      </View>
    );
  };

  const getSettings = () =>
  {
    return (
      <TripContent
        goTo={props.goTo}
        goBack={props.goBack}
        trip={props.trip}
        updateTrip={props.updateTrip}
        saveTravelers={props.saveTravelers}
        showDescriptionInput={props.showDescriptionInput}
        setShowDescriptionInput={props.setShowDescriptionInput}
        lightMode={true}
        showMenuPopup={props.showMenuPopup}
        isOwner={props.isOwner}
      />
    );
  };

  const getMap = () =>
  {
    return (
      <Map
        trip={props.trip}
        selectDay={props.selectDay}
        setShowDaysPopup={props.setShowDaysPopup}
        getDayPosition={props.getDayPosition}
        isOwner={props.isOwner}
      />
    );
  };

  return(
    <View style={s.container}>
      <Animated.View style={[s.card, {marginLeft:animateSnapPosition}]}>
        {getCard()}
      </Animated.View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    zIndex:1,
  },
  card:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  cardContent:
  {
    ...G.S.center,
    ...G.S.full,
    ...G.S.shadow(3),
  },
  cardContentFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  day:
  {
    ...G.S.center,
    ...G.S.full,
  },
});
