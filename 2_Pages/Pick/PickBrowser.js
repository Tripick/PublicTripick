import React from "react";
import { StyleSheet, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import NoPick from "./NoPick";
import PickSlider from "./PickSlider";
import AddFlagPopup from "./AddFlagPopup";
import GenerateItineraryPopup from "./GenerateItineraryPopup";

export default function PickBrowser({ navigation })
{
  const quantityToLoad = 10;
  const load = () =>
  {
    const loadedTrip = [...context.userContext.trips].filter((t) => t.id === context.currentTripId)[0];
    return loadedTrip;
  };
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [showItineraryPopup, setShowItineraryPopup] = React.useState(false);
  const [previousPageName, setPreviousPageName] = React.useState(context.previousPageName);
  const [trip, setTrip] = React.useState(load());
  const [picksLoaded, setPicksLoaded] = React.useState(false);
  const [waitingForPicksResponse, setWaitingForPicksResponse] = React.useState(false);
  const [selectedPickIndex, setSelectedPickIndex] = React.useState(0);
  const [picks, setPicks] = React.useState([]);
  const [globalPicksCount, setGlobalPicksCount] = React.useState(0);
  const [existingPicksCount, setExistingPicksCount] = React.useState(0);
  const [nbDays, setNbDays] = React.useState(0);
  const [itineraryPercentIndicator, setItineraryPercentIndicator] = React.useState(0);
  const goTo = (pageName) => { context.navigate(navigation, pageName); }
  const goBack = () => { context.navigate(navigation, previousPageName); }
  
  const getNexts = () =>
  {
    const alreadyLoaded = picks.map(p => p.idPlace);
    setWaitingForPicksResponse(true);
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"pick_nexts",
      isRetribution:false,
      data:{ idTrip:context.currentTripId, quantityToLoad:quantityToLoad, alreadyLoaded:alreadyLoaded, picksLength:picks.length },
      callback:getNextOnSuccess
    }]});
  };
  const getNextOnSuccess = (response) =>
  {
    setPicks(typeof(picks) === 'undefined' || picks === null ? [...response.picks] : [...picks, ...response.picks]);
    setExistingPicksCount(response.existingPicksCount);
    setGlobalPicksCount(response.count);
    const numberOfDays = Math.abs(G.Functions.daysBetween(trip.startDate, trip.endDate));
    setNbDays(numberOfDays);
    setItineraryPercentIndicator(Math.min(100, (response.existingPicksCount * 100) / numberOfDays));
    setPicksLoaded(true);
    setWaitingForPicksResponse(false);
  };
  React.useEffect(() => { getNexts(); }, []);

  const savePick = (idTrip, idPlace, rating) =>
  {
    const onSuccessSavePick = (response) =>
    {
      let tempPicks = [...picks];
      let currentPick = tempPicks[tempPicks.indexOf(tempPicks.filter(p => p.idPlace === idPlace)[0])];
      currentPick.rating = rating;
      setExistingPicksCount(response);
      const numberOfDays = Math.abs(G.Functions.daysBetween(trip.startDate, trip.endDate));
      setNbDays(numberOfDays);
      setItineraryPercentIndicator(Math.min(100, (response * 100) / numberOfDays));
      setPicks(tempPicks);
    };
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"pick_save",
      isRetribution:false,
      data:{ idTrip:idTrip, idPlace:idPlace, rating:rating },
      callback:onSuccessSavePick
    }]});
  };

  // Filters
  const [showFiltersPopup, setShowFiltersPopup] = React.useState(false);
  const [filterFlags, setFilterFlags] = React.useState(typeof(trip.filters) !== 'undefined' && trip.filters !== null ? trip.filters : []);
  const saveFlag = (flag) =>
  {
    const indexOfFlag = filterFlags.filter((t) => t.config.id === flag.config.id).length <= 0 ? -1 :
      filterFlags.indexOf(filterFlags.filter((t) => t.config.id === flag.config.id)[0]);
    if(indexOfFlag === -1) setFilterFlags([...filterFlags, flag]);
    else
    {
      filterFlags[indexOfFlag].value = flag.value;
      filterFlags[indexOfFlag].maxValue = flag.maxValue;
    }
  };
  const deleteFlag = (flag) =>
  {
    const indexOfFlag = filterFlags.filter((t) => t.config.id === flag.config.id).length <= 0 ? -1 :
      filterFlags.indexOf(filterFlags.filter((t) => t.config.id === flag.config.id)[0]);
    if(indexOfFlag !== -1)
    {
      let flagsTemp = [...filterFlags];
      flagsTemp.splice(indexOfFlag, 1);
      setFilterFlags([...flagsTemp]);
    }
  };
  const applyFilters = () =>
  {
    setShowFiltersPopup(false);
    saveFilters(filterFlags);
  };
  const saveFilters = (filters) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_saveFilters",
      isRetribution:false,
      data:{ idTrip:trip.id, filters:filters, quantityToLoad:quantityToLoad },
      callback:saveFiltersOnSuccess
    }]});
  };
  const saveFiltersOnSuccess = (response) =>
  {
    setPicks([...response.picks]);
    setExistingPicksCount(response.existingPicksCount);
    setPicksLoaded(true);
  };
  
  const getNoPickPage = () =>
  {
    if(picksLoaded === false)
      return <View />;
    else
    {
      return (
        <NoPick
          showFilters={() => setShowFiltersPopup(true)}
          goToPicksList={() => goTo("PicksList")}
          goToItinerary={() => goTo("Itinerary")}
          goToTrip={goBack}
        />
      );
    }
  };
  
  const onIndexChange = (newIndex) =>
  {
    if(waitingForPicksResponse === false && newIndex > (picks.length - quantityToLoad/2))
    {
      console.log("Getting new set of picks...");
      getNexts();
    }
  };

  return (
    <Wrappers.AppFrame loading={loading}>
      <View style={s.container}>
        <View style={s.content}>
          {picks !== null && picks.length > 0 ?
            <PickSlider
              navigation={navigation}
              trip={trip}
              picks={picks}
              index={selectedPickIndex}
              onIndexChange={onIndexChange}
              goBack={goBack}
              existingPicksCount={existingPicksCount}
              globalPicksCount={globalPicksCount}
              totalPicksCount={picks.length}
              savePick={savePick}
              setShowFiltersPopup={setShowFiltersPopup}
              setShowItineraryPopup={setShowItineraryPopup}
              itineraryPercentIndicator={itineraryPercentIndicator}
            />
            :
            getNoPickPage()
          }
        </View>
      </View>
      <AddFlagPopup
        icon="filter"
        title={"Filter places by:"}
        isRange={true}
        show={showFiltersPopup}
        hide={() =>
        {
          setFilterFlags(typeof(trip.filters) !== 'undefined' && trip.filters !== null ? trip.filters : []);
          setShowFiltersPopup(false);
        }}
        existingFlags={filterFlags}
        selectedFlag={null}
        save={saveFlag}
        delete={deleteFlag}
        applyFilters={applyFilters}
      />
      <GenerateItineraryPopup
        show={showItineraryPopup}
        hide={() => setShowItineraryPopup(false)}
        goToItinerary={() => { setShowItineraryPopup(false); goTo("Itinerary"); }}
        itineraryPercentIndicator={itineraryPercentIndicator}
        existingPicksCount={existingPicksCount}
        nbDays={nbDays}
        isOwner={trip.idOwner === context.userContext.user.id}
      />
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
  },
  list:
  {
    ...G.S.full,
  },
});