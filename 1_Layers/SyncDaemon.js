import React from "react";
// Context
import { AppContext } from "../AppContext";
// Libs
import * as G from "../Libs/Globals";
import * as Events from "../Libs/Events";

export default function SyncDaemon(props)
{
  const showLog = true;
  const log = (message) => { if(showLog === true) console.log(message); }

  const [context, setContext] = React.useContext(AppContext);
  const [requester, setRequester] = React.useState(null);
  const [queue, setQueue] = React.useState([]);
  const [actionDone, setActionDone] = React.useState(null);

  const apply = async (newContext) =>
  {
    await G.Functions.saveStore("context" + context.userContext.user.userName, newContext);
    setContext(newContext);
  };

  const extractRetributions = async (response, requestData) =>
  {
    // TODO : add the retributions in the queue
  };

  const handleOrder = async (order, before, request, after, callback) =>
  {
    await before(order.data);
    setActionDone(order.id);
    const onRequestSuccess = async (response, requestData) =>
    {
      if(typeof(response) !== 'undefined' && response !== null && response === "Authentication keys invalid or expired.")
      {
        log("Authentication token expired. Logging out...");
        context.functions.logout(context.userContext.user.userName);
      }
      await extractRetributions(response, requestData);
      await after(response, requestData);
      if(typeof(callback) !== 'undefined' && callback) callback(response);
      setActionDone(order.id);
    };
    request(order.data, onRequestSuccess);
  };
  const handleRetribution = async (order, requestData, before, after) =>
  {
    await before(order.data);
    await extractRetributions(order.data, requestData);
    await after(order.data, requestData);
    setActionDone(order.id);
  };

  // const action_name = {
  //   name:"action_name",
  //   before:async ({ ... }) =>
  //   {
  //      
  //   },
  //   request:async ({ ... }, after) =>
  //   {
  //      
  //   },
  //   after:async (response, requestData) =>
  //   {
  //      
  //   }
  // };

  const context_get = {
    name:"context_get",
    before:async ({ }) => {},
    request:async ({ }, after) =>
    {
      setRequester({ url:"userContext/get", data:null, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      log("User context received from server.");
      await apply({ ...context, config:{ flags: response.configuration.flags },
        userContext:{ ...context.userContext, friends: response.friends, trips: response.trips, guides: response.recommendedGuides }});
    }
  };

  const wizard_createTrip = {
    name:"wizard_createTrip",
    before:async ({ }) => { },
    request:async ({ name, photo }, after) =>
    {
      setRequester({ url:"trip/create", data:{ Name:name, Photo:photo }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      await apply({ ...context, previousPageName: "Homepage", currentTripId: response.id, userContext:{ ...context.userContext, trips: [response, ...context.userContext.trips]}});
    }
  };

  const wizard_update = {
    name:"wizard_update",
    before:async ({ trip, tripUpdated }) =>
    {
      log("Wizard updating trip...");
      const newTrip = {
        id: trip.id,
        name: tripUpdated.name,
        startDate: tripUpdated.startDate,
        startLatitude: tripUpdated.startLatitude,
        startLongitude: tripUpdated.startLongitude,
        startLatitudeDelta: tripUpdated.startLatitudeDelta,
        startLongitudeDelta: tripUpdated.startLongitudeDelta,
        endDate: tripUpdated.endDate,
        endLatitude: tripUpdated.endLatitude,
        endLongitude: tripUpdated.endLongitude,
        endLatitudeDelta: tripUpdated.endLatitudeDelta,
        endLongitudeDelta: tripUpdated.endLongitudeDelta,
        region: tripUpdated.region,
        polygon: tripUpdated.polygon,
        tiles: tripUpdated.tiles,
      };
      let updatedTrips = [...context.userContext.trips];
      const indexOfTrip = updatedTrips.indexOf(updatedTrips.filter((t) => t.id === tripUpdated.id)[0]);
      log("tripUpdated.tiles = " + (tripUpdated.tiles !== null ? tripUpdated.tiles.length : 0));
      updatedTrips[indexOfTrip] = { ...trip, ...newTrip };
      log("updatedTrips[indexOfTrip].tiles = " + (updatedTrips[indexOfTrip].tiles !== null ? updatedTrips[indexOfTrip].tiles.length : 0));
      const newContext = { ...context, userContext:{ ...context.userContext, trips:[...updatedTrips] }};
      await apply(newContext);
    },
    request:async ({ trip, tripUpdated }, after) =>
    {
      const newTrip = {
        Id: trip.id,
        Name: tripUpdated.name,
        StartDate: tripUpdated.startDate,
        StartLatitude: tripUpdated.startLatitude,
        StartLongitude: tripUpdated.startLongitude,
        StartLatitudeDelta: tripUpdated.startLatitudeDelta,
        StartLongitudeDelta: tripUpdated.startLongitudeDelta,
        EndDate: tripUpdated.endDate,
        EndLatitude: tripUpdated.endLatitude,
        EndLongitude: tripUpdated.endLongitude,
        EndLatitudeDelta: tripUpdated.endLatitudeDelta,
        EndLongitudeDelta: tripUpdated.endLongitudeDelta,
        Region: tripUpdated.region,
        Polygon: tripUpdated.polygon,
        Tiles: tripUpdated.tiles,
      };
      setRequester({ url:"trip/update", data:{ Trip: newTrip }, onSuccess:after, noLoader:true });
    },
    after:async (updatedTrip, requestData) =>
    {
      log("Wizard trip updated.");
    }
  };
  
  const trip_create = {
    name:"trip_create",
    before:async ({ }) => {},
    request:async ({ }, after) =>
    {
      setRequester({ url:"trip/create", data:null, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      await apply({...context, currentTripId: response.id, userContext:{ ...context.userContext, trips: [response, ...context.userContext.trips]}});
    }
  };
  
  const trip_get = {
    name:"trip_get",
    before:async ({ }) => {},
    request:async ({ idTrip }, after) =>
    {
      setRequester({ url:"trip/get", data:{ Id:idTrip }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      await apply({...context, userContext:{ ...context.userContext, trips:[response, ...context.userContext.trips.filter(t => t.id !== response.id)]}});
    }
  };
  
  const trip_getAll = {
    name:"trip_getAll",
    before:async ({ }) => {},
    request:async ({ pageIndex, pageSize }, after) =>
    {
      setRequester({ url:"trip/getAll", data:{ PageIndex:pageIndex, PageSize:pageSize }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      await apply({...context, userContext:{ ...context.userContext, trips:response}});
    }
  };

  const trip_update = {
    name: "trip_update",
    before: async ({ trip, tripUpdated }) =>
    {
      let newEndDate = tripUpdated.endDate;
      if(G.Functions.daysBetween(tripUpdated.startDate, newEndDate) > G.Constants.maxTripLength)
        newEndDate = G.Functions.addDays(tripUpdated.startDate, 59);
      const newTrip = {
        id: tripUpdated.id,
        isPublic: tripUpdated.isPublic,
        name: tripUpdated.name,
        description: tripUpdated.description,
        note: tripUpdated.note,
        startDate: tripUpdated.startDate,
        startLatitude: tripUpdated.startLatitude,
        startLongitude: tripUpdated.startLongitude,
        startLatitudeDelta: tripUpdated.startLatitudeDelta,
        startLongitudeDelta: tripUpdated.startLongitudeDelta,
        endDate: newEndDate,
        endLatitude: tripUpdated.endLatitude,
        endLongitude: tripUpdated.endLongitude,
        endLatitudeDelta: tripUpdated.endLatitudeDelta,
        endLongitudeDelta: tripUpdated.endLongitudeDelta,
        filtersSet: tripUpdated.filtersSet,
        filterIntense: tripUpdated.filterIntense,
        filterSportive: tripUpdated.filterSportive,
        filterCity: tripUpdated.filterCity,
        filterFamous: tripUpdated.filterFamous,
        filterFar: tripUpdated.filterFar,
        filterExpensive: tripUpdated.filterExpensive,
        region: tripUpdated.region,
        polygon: tripUpdated.polygon,
        tiles: tripUpdated.tiles,
      };
      let updatedTrips = [...context.userContext.trips];
      const indexOfTrip = updatedTrips.indexOf(updatedTrips.filter((t) => t.id === trip.id)[0]);
      updatedTrips[indexOfTrip] = {...trip, ...newTrip};
      const newContext = { ...context, userContext: { ...context.userContext, trips: [...updatedTrips] }};
      await apply(newContext);
    },
    request: async ({ tripUpdated, updateArea }, after) =>
    {
      let newEndDate = tripUpdated.endDate;
      if(G.Functions.daysBetween(tripUpdated.startDate, newEndDate) > G.Constants.maxTripLength)
        newEndDate = G.Functions.addDays(tripUpdated.startDate, 59);
      const newTrip = {
        id: tripUpdated.id,
        isPublic: tripUpdated.isPublic,
        name: tripUpdated.name,
        description: tripUpdated.description,
        note: tripUpdated.note,
        startDate: tripUpdated.startDate,
        startLatitude: tripUpdated.startLatitude,
        startLongitude: tripUpdated.startLongitude,
        startLatitudeDelta: tripUpdated.startLatitudeDelta,
        startLongitudeDelta: tripUpdated.startLongitudeDelta,
        endDate: newEndDate,
        endLatitude: tripUpdated.endLatitude,
        endLongitude: tripUpdated.endLongitude,
        endLatitudeDelta: tripUpdated.endLatitudeDelta,
        endLongitudeDelta: tripUpdated.endLongitudeDelta,
        filtersSet: tripUpdated.filtersSet,
        filterIntense: tripUpdated.filterIntense,
        filterSportive: tripUpdated.filterSportive,
        filterCity: tripUpdated.filterCity,
        filterFamous: tripUpdated.filterFamous,
        filterFar: tripUpdated.filterFar,
        filterExpensive: tripUpdated.filterExpensive,
        region: tripUpdated.region,
        polygon: tripUpdated.polygon,
        tiles: tripUpdated.tiles,
      };
      setRequester({
        url:"trip/update",
        data:{ Trip: updateArea === true ? newTrip : {...newTrip, polygon: null, tiles: null} },
        onSuccess:after,
        noLoader:true
      });
    },
    after: async (data, requestData) =>
    {
      log("Trip updated successfully.");
    }
  };

  const trip_delete = {
    name:"trip_delete",
    before:async ({ trip }) =>
    {
      let updatedTrips = context.userContext.trips.filter((t) => t.id !== trip.id);
      await apply({ ...context, userContext: { ...context.userContext, trips: [...updatedTrips] }});
    },
    request:async ({ trip }, after) =>
    {
      setRequester({ url:"trip/delete", data:{ Id: trip.id }, onSuccess:after, noLoader:true });
    },
    after:async (data, requestData) =>
    {
      log("Trip deleted.")
    }
  };

  const trip_saveCover = {
    name:"trip_saveCover",
    before:async ({ trip, cover }) =>
    {
      const indexOfTrip = context.userContext.trips.indexOf(context.userContext.trips.filter((t) => t.id === trip.id)[0]);
      let updatedTrip = context.userContext.trips[indexOfTrip];
      updatedTrip.coverImage = cover;
      let updatedTrips = [...context.userContext.trips];
      updatedTrips[indexOfTrip] = updatedTrip;
      await apply({ ...context, userContext: { ...context.userContext, trips: [...updatedTrips] }});
    },
    request:async ({ trip, cover }, after) =>
    {
      setRequester({ url:"trip/saveCover", data:{ IdTrip:trip.id, Cover:cover }, onSuccess:after, noLoader:true });
    },
    after:async ({ }, { }) =>
    {
      log("Cover saved.");
    }
  };

  const trip_saveFilters = {
    name:"trip_saveFilters",
    before:async ({ }) => {},
    request:async ({ idTrip, filtersData, quantityToLoad }, after) =>
    {
      setRequester({ url:"trip/saveFilters", data:{ IdTrip:idTrip, Filters:filtersData, QuantityToLoad: quantityToLoad }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      let newTrips = [...context.userContext.trips];
      const indexOfTrip = newTrips.indexOf(newTrips.filter((t) => t.id === context.currentTripId)[0]);
      newTrips[indexOfTrip].filters = response;
      await apply({ ...context, userContext:{ ...context.userContext, trips: [...newTrips] }});
    }
  };
  
  const traveler_save = {
    name:"traveler_save",
    before:async ({ trip, travelers }) =>
    {
      let updatedTrip = { ...trip };
      const newTravelers = context.userContext.friends.filter(f => travelers.indexOf(f.id) >= 0);
      updatedTrip.travelers = newTravelers.map(f =>
      {
        return { id:f.id, userName:f.userName, firstName:f.firstName, lastName:f.lastName, photo:f.photo };
      });
      let updatedTrips = [...context.userContext.trips];
      const indexOfTrip = updatedTrips.indexOf(updatedTrips.filter((t) => t.id === trip.id)[0]);
      updatedTrips[indexOfTrip] = updatedTrip;
      const newFriends = [...context.userContext.friends];
      newFriends.forEach(nf =>
      {
        let newSharedTrips = newTravelers.filter(nt => nt.id === nf.id).length > 0 ? [trip] : []; // If the friend is sharing the current trip
        if(typeof(nf.sharedTrips) !== 'undefined' && nf.sharedTrips !== null)
          newSharedTrips = [...newSharedTrips, ...nf.sharedTrips.filter(st => st.id !== trip.id)];
        nf.sharedTrips = newSharedTrips;
      });
      await apply({ ...context, userContext: { ...context.userContext, friends:newFriends, trips: [...updatedTrips] }});
    },
    request:async ({ trip, travelers }, after) =>
    {
      setRequester({ url:"traveler/save", data:{ IdTrip:trip.id, IdsFriends:travelers }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) =>
    {
      log("Travelers saved.");
    }
  };

  const itinerary_get = {
    name:"itinerary_get",
    before:async ({ }) => {},
    request:async ({ idTrip }, after) =>
    {
      setRequester({ url:"itinerary/get", data:{ IdTrip:idTrip, ForceRegeneration: false }, onSuccess:after, noLoader:true });
    },
    after:async (response, { IdTrip }) =>
    {
      log("Itinerary received.");
      let allTrips = [...context.userContext.trips];
      const indexOfTrip = allTrips.indexOf(allTrips.filter((t) => t.id === IdTrip)[0]);
      allTrips[indexOfTrip].itinerary = response;
      allTrips[indexOfTrip].isItineraryGenerated = true;
      await apply({...context, userContext:{...context.userContext, trips: [...allTrips]}});
    }
  };

  const itinerary_delete = {
    name:"itinerary_delete",
    before:async ({ trip }) =>
    {
      log("Deleting itinerary...");
      let updatedTrip = { ...trip };
      updatedTrip.itinerary = null;
      updatedTrip.isItineraryGenerated = false;
      let updatedTrips = [...context.userContext.trips];
      const indexOfTrip = updatedTrips.indexOf(updatedTrips.filter((t) => t.id === trip.id)[0]);
      updatedTrips[indexOfTrip] = updatedTrip;
      await apply({ ...context, userContext: { ...context.userContext, trips: [...updatedTrips] }});
    },
    request:async ({ trip }, after) =>
    {
      setRequester({ url:"itinerary/delete", data:{ IdTrip:trip.id }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) =>
    {
      log("Itinerary deleted.");
    }
  };
  
  const itinerary_saveDays = {
    name:"itinerary_saveDays",
    before:async ({ }) => {},
    request:async ({ idTrip, days }, after) =>
    {
      setRequester({ url:"itinerary/saveDays", data:{ IdTrip:idTrip, Days:days }, onSuccess:after, noLoader:false });
    },
    after:async (response, { IdTrip }) =>
    {
      // const nbDaysWidthNoId = response.filter(day => day.id <= 0).length;
      // if(nbDaysWidthNoId > 0)
      //   log("ERROR : There are " + nbDaysWidthNoId + " days with no id.");
      // else
      //   log("SUCCESS : All days have a valid id.");
      let currentTrip = context.userContext.trips.filter((t) => t.id === IdTrip)[0];
      currentTrip.itinerary.days = [...response];
      await apply({...context, userContext:{ ...context.userContext, trips: [...context.userContext.trips]}});
    }
  };
  
  const itinerary_saveDaysAsync = {
    name:"itinerary_saveDaysAsync",
    before:async ({ idTrip, days }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      currentTrip.itinerary.days = [...days];
      await apply({...context, userContext:{ ...context.userContext, trips: [...context.userContext.trips]}});
    },
    request:async ({ idTrip, days }, after) =>
    {
      setRequester({ url:"itinerary/saveDays", data:{ IdTrip:idTrip, Days:days }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };
  
  const itinerary_editDayName = {
    name:"itinerary_editDayName",
    before:async ({ idTrip, idDay, name }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const day = currentTrip.itinerary.days.filter(d => d.id === idDay)[0];
      day.name = name;
      await apply({...context, userContext:{ ...context.userContext, trips: [...context.userContext.trips]}});
    },
    request:async ({ idTrip, idDay, name }, after) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const day = currentTrip.itinerary.days.filter(d => d.id === idDay)[0];
      setRequester({ url:"itinerary/saveDay", data:{IdTrip:idTrip, Day: {...day, name:name, step:null, itinerary:null}}, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const itinerary_saveSteps = {
    name:"itinerary_saveSteps",
    before:async ({ idTrip, idDay, steps }) =>
    {
      // If activities were moved to the specified day, remove these activities from the days they come from
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const movedStepsIds = steps.filter(s => s.idDay !== idDay).map(s => s.id);
      currentTrip.itinerary.days.filter(d => d.id !== idDay).forEach(oldDay =>
      {
        oldDay.steps = [...oldDay.steps.filter(s => movedStepsIds.indexOf(s.id) === -1)];
      });
      steps.forEach(step => { step.idDay = idDay; });
      await apply({ ...context, userContext: { ...context.userContext, trips: [...context.userContext.trips] }});
    },
    request:async ({ idTrip, idDay, steps }, after) =>
    {
      setRequester({ url:"itinerary/saveSteps", data:{ IdTrip:idTrip, IdDay:idDay, Steps:steps }, onSuccess:after, noLoader:false });
    },
    after:async (response, { IdTrip }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === IdTrip)[0];
      const idDay = response.id;
      const indexOfDay = currentTrip.itinerary.days.indexOf(currentTrip.itinerary.days.filter(d => d.id === idDay)[0]);
      currentTrip.itinerary.days[indexOfDay].steps = [...response.steps];
      await apply({ ...context, userContext: { ...context.userContext, trips: [...context.userContext.trips] }});
    }
  };

  const itinerary_saveStepsAsync = {
    name:"itinerary_saveStepsAsync",
    before:async ({ idTrip, idDay, steps }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const indexOfDay = currentTrip.itinerary.days.indexOf(currentTrip.itinerary.days.filter(d => d.id === idDay)[0]);
      currentTrip.itinerary.days[indexOfDay].steps = [...steps];
      const movedStepsIds = steps.filter(s => s.idDay !== idDay).map(s => s.id);
      currentTrip.itinerary.days.filter(d => d.id !== idDay).forEach(oldDay =>
      {
        oldDay.steps = [...oldDay.steps.filter(s => movedStepsIds.indexOf(s.id) === -1)];
      });
      steps.forEach(step => { step.idDay = idDay; });
      await apply({ ...context, userContext: { ...context.userContext, trips: [...context.userContext.trips] }});
    },
    request:async ({ idTrip, idDay, steps }, after) =>
    {
      setRequester({ url:"itinerary/saveSteps", data:{ IdTrip:idTrip, IdDay:idDay, Steps:steps }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const itinerary_moveStep = {
    name:"itinerary_moveStep",
    before:async ({ idTrip, idDay, idSelectedDay, idStep }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const oldDay = currentTrip.itinerary.days.filter(d => d.id === idDay)[0];
      const newDay = currentTrip.itinerary.days.filter(d => d.id === idSelectedDay)[0];
      let step = oldDay.steps.filter(s => s.id === idStep)[0];
      oldDay.steps = [...oldDay.steps.filter(s => s.id !== step.id)];
      step.idDay = newDay.id;
      step.isVisit = true;
      newDay.steps = [...newDay.steps, step];
      const orderedSteps = [...newDay.steps.filter(x => x.isVisit === true), ...newDay.steps.filter(x => x.isVisit === false)];
      orderedSteps.forEach((s,i) => { s.index = i; });
      await apply({...context, userContext:{ ...context.userContext, trips: [...context.userContext.trips]}});
    },
    request:async ({ idTrip, idDay, idSelectedDay, idStep }, after) =>
    {
      setRequester({ url:"itinerary/moveStep", data:{ IdTrip:idTrip, IdOldDay:idDay, IdNewDay:idSelectedDay, idStep:idStep }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const itinerary_updateStep = {
    name:"itinerary_updateStep",
    before:async ({ idTrip, idDay, step }) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const day = currentTrip.itinerary.days.filter(d => d.id === idDay)[0];
      const existingStep = day.steps.filter(s => s.id === step.id)[0];
      existingStep.name = step.name;
      existingStep.time = step.time;
      await apply({...context, userContext:{ ...context.userContext, trips: [...context.userContext.trips]}});
    },
    request:async ({ idTrip, idDay, step }, after) =>
    {
      let currentTrip = context.userContext.trips.filter((t) => t.id === idTrip)[0];
      const day = currentTrip.itinerary.days.filter(d => d.id === idDay)[0];
      const existingStep = day.steps.filter(s => s.id === step.id)[0];
      existingStep.name = step.name;
      existingStep.time = step.time;
      setRequester({ url:"itinerary/saveStep", data:{ IdTrip:idTrip, IdDay:idDay, Step:existingStep }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const itinerary_searchMap = {
    name:"itinerary_searchMap",
    before:async ({ }) => {},
    request:async ({ idTrip, region }, after) =>
    {
      setRequester({ url:"itinerary/searchMap", data:{ IdTrip:idTrip, Region:region }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const friend_add = {
    name:"friend_add",
    before:async ({ }) => {},
    request:async ({ friend }, after) =>
    {
      setRequester({ url:"friend/add", data:{ Id: friend.id }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) =>
    {
      await apply({...context, userContext:{...context.userContext, friends:[...context.userContext.friends, response]}});
    }
  };

  const friend_delete = {
    name:"friend_delete",
    before:async ({ friend }) =>
    {
      // Remove all trips of my friend from the context
      let newTrips = context.userContext.trips.filter(t => t.idOwner !== friend.id);
      // Remove my friend from all my trips
      newTrips.filter(t => t.idOwner === context.userContext.user.id && typeof(t.travelers) !== 'undefined' && t.travelers !== null).forEach(t =>
      {
        t.travelers = t.travelers.filter(m => m.id !== friend.id);
      });
      // Remove my friend from the context
      let newFriends = context.userContext.friends.filter(f => f.id !== friend.id);
      await apply({...context, userContext:{...context.userContext, friends:newFriends}});
    },
    request:async ({ friend }, after) =>
    {
      setRequester({ url:"friend/delete", data:{ Id: friend.id }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const friend_confirm = {
    name:"friend_confirm",
    before:async ({ friend }) =>
    {
      let confirmedFriend = context.userContext.friends.filter(f => f.id === friend.id)[0];
      confirmedFriend.needToConfirm = null;
      await apply({...context, userContext:{...context.userContext, friends:context.userContext.friends}});
    },
    request:async ({ friend }, after) =>
    {
      setRequester({ url:"friend/confirm", data:{ Id: friend.id }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const friend_search = {
    name:"friend_search",
    before:async ({ }) => {},
    request:async ({ searchText }, after) =>
    {
      setRequester({ url:"friend/search", data:{ UserName:searchText }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const place_get = {
    name:"place_get",
    before:async ({ }) => {},
    request:async ({ placeId }, after) =>
    {
      setRequester({ url:"place/getPlace", data:{ id: placeId }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const place_save = {
    name:"place_save",
    before:async ({ }) => {},
    request:async ({ newPlace }, after) =>
    {
      setRequester({ url:"place/save", data:{ Place:newPlace }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const place_autocomplete = {
    name:"place_autocomplete",
    before:async ({ }) => {},
    request:async ({ text, quantity, loadPlace }, after) =>
    {
      setRequester({ url:"place/searchAutocomplete", data:{ Text:text, Quantity:quantity, LoadPlace:loadPlace }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const place_review = {
    name:"place_review",
    before:async ({ }) => {},
    request:async ({ idPlace:idPlace, rating:rating, message:message, flags:flags, pictures:pictures }, after) =>
    {
      setRequester({ url:"place/review", data:{ IdPlace:idPlace, Rating:rating, Message:message, Flags:flags, Pictures:pictures }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const pick_nexts = {
    name:"pick_nexts",
    before:async ({ }) => {},
    request:async ({ idTrip, quantityToLoad, alreadyLoaded, picksLength }, after) =>
    {
      setRequester({ url:"pick/getNexts", data:{ IdTrip:idTrip, Quantity: quantityToLoad, AlreadyLoaded: alreadyLoaded }, onSuccess:after, noLoader:(picksLength > 0) });
    },
    after:async (response, requestData) => {}
  };

  const pick_save = {
    name:"pick_save",
    before:async ({ }) => {},
    request:async ({ idTrip, idPlace, rating }, after) =>
    {
      setRequester({ url:"pick/savePick", data:{ IdTrip: idTrip, IdPlace: idPlace, Rating:rating }, onSuccess:after, noLoader:true });
    },
    after:async (response, requestData) => {}
  };

  const pick_get = {
    name:"pick_get",
    before:async ({ }) => {},
    request:async ({ id }, after) =>
    {
      setRequester({ url:"pick/getSingle", data:{ Id:id }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const pick_getAll = {
    name:"pick_getAll",
    before:async ({ }) => {},
    request:async ({ idTrip, quantity, skip }, after) =>
    {
      setRequester({ url:"pick/getAll", data:{ IdTrip:idTrip, Quantity:quantity, Skip:skip }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const country_get = {
    name:"country_get",
    before:async ({ }) => {},
    request:async ({ id, name }, after) =>
    {
      setRequester({ url:"country/get", data:{ Id:id, Name:name }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const country_getAll = {
    name:"country_getAll",
    before:async ({ }) => {},
    request:async ({ quantity }, after) =>
    {
      setRequester({ url:"country/getAll", data:{ Quantity:quantity }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const country_getByLocation = {
    name:"country_getByLocation",
    before:async ({ }) => {},
    request:async ({ latitude, longitude }, after) =>
    {
      setRequester({ url:"country/getByLocation", data:{ Latitude:latitude, Longitude:longitude }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const country_generationGetAll = {
    name:"country_generationGetAll",
    before:async ({ }) => {},
    request:async ({ quantity }, after) =>
    {
      setRequester({ url:"country/generationGetAll", data:{ Quantity:quantity }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  const country_generationSave = {
    name:"country_generationSave",
    before:async ({ }) => {},
    request:async ({ country }, after) =>
    {
      setRequester({ url:"country/generationSave", data:{ Country:country }, onSuccess:after, noLoader:false });
    },
    after:async (response, requestData) => {}
  };

  // Actions
  // setContext({ ...context, ordersQueue:[...context.ordersQueue,
  // {
  //   id:G.Functions.newGUID(),
  //   actionName:"wizard_createTrip",
  //   isRetribution:false,
  //   data:{ name:name, photo:photo },
  //   callback:createTripOnSuccess
  // }]});
  const actions =
  [
    context_get,
    wizard_update,
    wizard_createTrip,
    trip_create,
    trip_get,
    trip_getAll,
    trip_update,
    trip_delete,
    trip_saveCover,
    trip_saveFilters,
    itinerary_get,
    itinerary_delete,
    itinerary_saveDays,
    itinerary_saveDaysAsync,
    itinerary_editDayName,
    itinerary_saveSteps,
    itinerary_saveStepsAsync,
    itinerary_moveStep,
    itinerary_updateStep,
    itinerary_searchMap,
    traveler_save,
    friend_add,
    friend_delete,
    friend_confirm,
    friend_search,
    place_get,
    place_save,
    place_autocomplete,
    place_review,
    pick_nexts,
    pick_save,
    pick_get,
    pick_getAll,
    country_get,
    country_getAll,
    country_getByLocation,
    country_generationGetAll,
    country_generationSave,
  ];

  // Executer
  // ORDER { isRetribution:false, actionName:"action_name", data:{ ... }, callback:() => {} }
  // RETRIBUTION { isRetribution:true, actionName:"action_name", data:{ ... }, requestData:{ ... } }
  const execute = (order) =>
  {
    if(typeof(order) !== 'undefined' && order !== null)
    {
      log("SyncDaemon -> "+order.actionName);
      const actionToPerform = actions.filter(a => a.name === order.actionName);
      if(actionToPerform.length === 1)
      {
        const a = actionToPerform[0];
        if(order.isRetribution === true)
          handleRetribution(order, order.requestData, a.before, a.after);
        else
          handleOrder(order, a.before, a.request, a.after, order.callback);
      }
      else
        log("SyncDaemon ERROR : action [" + order.actionName + "] does not exist or has multiple occurences.");
    }
  };

  // useEffects
  React.useEffect(() => { if(requester !== null) setRequester(null); }, [requester]);
  React.useEffect(() =>
  {
    if(typeof(context.ordersQueue) !== 'undefined' && context.ordersQueue !== null && context.ordersQueue.length > 0 && queue.length === 0)
    {
      log("Context queue length : " + context.ordersQueue.length);
      setQueue(context.ordersQueue);
      setContext({ ...context, ordersQueue:[] });
    }
  }, [context.ordersQueue]);
  React.useEffect(() =>
  {
    if(queue.length > 0)
    {
      log("Queue length : " + queue.length);
      execute(queue[0]);
    }
  }, [queue]);
  React.useEffect(() =>
  {
    if(actionDone !== null)
    {
      // const actionExecuted = queue.filter(x => x.id === actionDone)[0];
      // if(typeof(actionExecuted) !== 'undefined' && actionExecuted !== null) log("["+actionExecuted.actionName+"] executed. Queue cleaned.");
      let newQueue = queue.filter(x => x.id !== actionDone);
      context.ordersQueue.forEach(o =>
      {
        if(newQueue.filter(x => x.id === o.id).length === 0)
          newQueue = [...newQueue, o];
      });
      setActionDone(null);
      setContext({ ...context, ordersQueue:[] });
      setQueue(newQueue);
    }
  }, [actionDone]);

  // Elements
  return (
    <Events.Requester requester={requester} displayMessage={() => {}} />
  );
}
