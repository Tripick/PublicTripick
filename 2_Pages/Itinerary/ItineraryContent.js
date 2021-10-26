import React from "react";
import {StyleSheet, View, Animated, ActivityIndicator} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
// Components
import Title from "./Title";
import BookmarksSlider from "./BookmarksSlider";
import CardsSlider from "./CardsSlider";
import PlacePopup from "./PlacePopup";
import DaysPopup from "./DaysPopup";
import MoveToDayPopup from "./MoveToDayPopup";

export default function ItineraryContent(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const [currentDayId, setCurrentDayId] = React.useState(-1);

  // Message popup
  const [messagePopup, setMessagePopup] = React.useState("");
  const [showMessagePopup, setShowMessagePopup] = React.useState(false);
  const [messagePopupDuration, setMessagePopupDuration] = React.useState(1500);
  const [messagePopupIcon, setMessagePopupIcon] = React.useState("check");
  const displayMessage = (message, duration = 1500, icon = "check") =>
  {
    setMessagePopupIcon(icon);
    setMessagePopup(message);
    setMessagePopupDuration(duration);
    setShowMessagePopup(true);
  };

  // Cards
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const [animationDirty, setAnimationDirty] = React.useState(false);
  const [animationReload, setAnimationReload] = React.useState(false);
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

  // Itinerary
  const getItinerary = () =>
  {
    console.log("Getting itinerary...");
    if(props.trip.itinerary === null)
    {
      console.log("Itinerary is null. Generating...");
      setBackPage("Homepage");
      setContext({ ...context, ordersQueue:[...context.ordersQueue,
      {
        id:G.Functions.newGUID(),
        actionName:"itinerary_get",
        isRetribution:false,
        data:{ idTrip:props.trip.id }
      }]});
    }
  };

  // Steps
  const [stepToMove, setStepToMove] = React.useState(null);
  const [showMovePopup, setShowMovePopup] = React.useState(false);
  React.useEffect(() => { setShowMovePopup(stepToMove !== null); }, [stepToMove]);
  const saveSteps = async (idDay, steps) =>
  {
    console.log("Saving day steps...");
    // If there's new steps (steps with id not set yet) -> wait for the server's response to get the created ids
    if(steps.filter(step => step.id < 0).length > 0)
      saveStepsWithNewSteps(idDay, steps);
    else
      saveStepsAsync(idDay, steps);
  };
  const saveStepsWithNewSteps = async (idDay, steps) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_saveSteps",
      isRetribution:false,
      data:{ idTrip:props.trip.id, idDay:idDay, steps:steps }
    }]});
  };
  const saveStepsAsync = async (idDay, steps) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_saveStepsAsync",
      isRetribution:false,
      data:{ idTrip:props.trip.id, idDay:idDay, steps:steps }
    }]});
  };

  const moveStep = async (idSelectedDay, step) =>
  {
    console.log("Moving step...");
    setStepToMove(null);
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_moveStep",
      isRetribution:false,
      data:{ idTrip:props.trip.id, idDay:step.idDay, idSelectedDay:idSelectedDay, idStep:step.id }
    }]});
  };

  // Place
  const [placeToDisplay, setPlaceToDisplay] = React.useState(-1);
  const [showPlacePopup, setShowPlacePopup] = React.useState(false);
  React.useEffect(() => { setShowPlacePopup(placeToDisplay !== -1); }, [placeToDisplay]);

  // Days
  const [showDaysPopup, setShowDaysPopup] = React.useState(false);
  const saveDays = async (days) =>
  {
    setShowDaysPopup(false);
    console.log("Saving days...");
    // If there's new days (days with id not set yet) -> wait for the server's response to get the created ids
    if(days.filter(day => day.id < 0).length > 0)
      saveDaysWithNewDays(days);
    else
      saveDaysAsync(days);
  }
  const saveDaysWithNewDays = async (days) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_saveDays",
      isRetribution:false,
      data:{ idTrip:props.trip.id, days:days }
    }]});
  }
  const saveDaysAsync = async (days) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_saveDaysAsync",
      isRetribution:false,
      data:{ idTrip:props.trip.id, days:days }
    }]});
  }

  const updateDayName = async (idDay, name) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_editDayName",
      isRetribution:false,
      data:{ idTrip:props.trip.id, idDay:idDay, name:name }
    }]});
  };

  const updateStep = async (step) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_updateStep",
      isRetribution:false,
      data:{ idTrip:props.trip.id, idDay:step.idDay, step:step }
    }]});
  };

  const getDayPosition = (day, endOfDay = false) =>
  {
    const daySteps = day.steps.filter(s => s.isVisit === true);
    if(typeof(daySteps) === 'undefined' || daySteps === null || daySteps.length <= 0)
    {
      const indexOfDay = props.trip.itinerary.days.indexOf(day);
      if(day.index === props.trip.itinerary.days.length - 1)
        return { latitude:props.trip.endLatitude, longitude:props.trip.endLongitude };
      for (let i = (indexOfDay - 1); i > 0; i--)
      {
        const iDay = props.trip.itinerary.days[i];
        if(typeof(iDay.steps) !== 'undefined' && iDay.steps !== null && iDay.steps.length > 0)
        {
          const indexOfStep = endOfDay === true ? iDay.steps.length - 1 : 0;
          return iDay.steps[indexOfStep].visit === null ? iDay.steps[indexOfStep] : iDay.steps[indexOfStep].visit?.place;
        }
      }
      return { latitude:props.trip.startLatitude, longitude:props.trip.startLongitude };
    }
    const indexOfStep = endOfDay === true ? daySteps.length - 1 : 0;
    const pos = daySteps[indexOfStep].visit === null ?
      { latitude:daySteps[indexOfStep].latitude, longitude:daySteps[indexOfStep].longitude }
      :
      { latitude:daySteps[indexOfStep].visit?.place.latitude, longitude:daySteps[indexOfStep].visit?.place.longitude };
    return pos
  };

  // Use effects
  React.useEffect(() =>
  {
    if(props.trip.isItineraryGenerated !== true || typeof(props.trip.itinerary) === 'undefined' || props.trip.itinerary === null)
      getItinerary();
  }, []);

  const getLoading = () =>
  {
    return (
      <View style={s.content}>
        <View style={{...G.S.center, flex:1}}>
          <ActivityIndicator size="small" color={G.Colors().Highlight()} />
        </View>
      </View>
    );
  };
  
  const getContent = () =>
  {
    return(
      <View style={s.content}>
        <BookmarksSlider
          currentDayId={currentDayId}
          trip={props.trip}
          selectDay={setCurrentDayId}
        />
        <CardsSlider
          navigation={props.navigation}
          currentDayId={currentDayId}
          trip={props.trip}
          selectDay={setCurrentDayId}
          saveSteps={saveSteps}
          setPlaceToDisplay={setPlaceToDisplay}
          setShowDaysPopup={setShowDaysPopup}
          setStepToMove={setStepToMove}
          updateDayName={updateDayName}
          updateStep={updateStep}
          goTo={props.goTo}
          goBack={props.goBack}
          updateTrip={props.updateTrip}
          saveTravelers={props.saveTravelers}
          showDescriptionInput={props.showDescriptionInput}
          setShowDescriptionInput={props.setShowDescriptionInput}
          lightMode={props.lightMode}
          showMenuPopup={props.showMenuPopup}
          displayMessage={displayMessage}
          getDayPosition={getDayPosition}
          isOwner={props.isOwner}
        />
        <PlacePopup
          show={showPlacePopup}
          hide={() => setPlaceToDisplay(-1)}
          placeId={placeToDisplay}
          navigation={props.navigation}
        />
        <DaysPopup
          show={showDaysPopup}
          hide={() => setShowDaysPopup(false)}
          days={props.trip.itinerary.days}
          setPlaceToDisplay={setPlaceToDisplay}
          save={saveDays}
        />
        {stepToMove === null ? <View/> : 
          <MoveToDayPopup
            show={showMovePopup}
            hide={() => setShowMovePopup(false)}
            days={props.trip.itinerary.days}
            step={stepToMove}
            setPlaceToDisplay={setPlaceToDisplay}
            save={moveStep}
          />
        }
      </View>
    );
  };

  return (
    <View style={s.container}>
        <View style={s.visibleFrame}>
          <View style={s.headerContainer}>
            <Title
              goBack={props.goBack}
              title={props.trip.name}
              showMenu={props.showMenuPopup}
            />
          </View>
          {props.trip === null || typeof(props.trip.itinerary) === 'undefined' || props.trip.itinerary === null ? getLoading() : getContent() }
        </View>
      <Popups.PopupTemporary time={messagePopupDuration} visible={showMessagePopup} hide={() => setShowMessagePopup(false)} message={messagePopup} icon={messagePopupIcon} />
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop:-5,
  },
  visibleFrame:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
  },
  headerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 6,
  },
});
