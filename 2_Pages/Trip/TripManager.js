import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Pickers from "../../Libs/Pickers";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";
// Components
import TripContent from "./TripContent";
import ItineraryContent from "../Itinerary/ItineraryContent";

export default function TripManager(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = () =>
  {
    let pageToGoTo = backPage;
    if((props.itineraryMode === false && pageToGoTo === "Trip") || (pageToGoTo === "Itinerary" && (trip.isItineraryGenerated === false || trip.itinerary === null)))
    {
      console.log("Forcing redirecting to Homepage...");
      pageToGoTo = "Homepage";
    }
    console.log("Back to " + pageToGoTo + "...");
    context.navigate(props.navigation, pageToGoTo);
  }
  const goTo = (screenName) =>
  {
    setContext({ ...context, previousPageName: props.itineraryMode === true ? "Itinerary" : "Trip" });
    context.navigate(props.navigation, screenName);
  };

  // Trip : init and update via context
  const [trip, setTrip] = React.useState(null);
  const [isOwner, setIsOwner] = React.useState(false);
  React.useEffect(() =>
  {
    const fetchedTrip = context.userContext.trips.filter((t) => t.id === context.currentTripId);
    if(fetchedTrip.length !== 1)
    {
      console.log("Error : number of trip ["+context.currentTripId+"] found in context = "+fetchedTrip.length);
      goBack();
    }
    const newTrip = fetchedTrip[0];
    // If the trip is mine continues, otherwise, load from server
    if(newTrip.idOwner !== context.userContext.user.id)
    {
      setIsOwner(false);
      if(typeof(newTrip.startDate) === 'undefined' || newTrip.startDate === null || typeof(newTrip.region) === 'undefined' || newTrip.region === null)
      {
        console.log("Uncomplete trip [" + newTrip.id + "]. Requesting from server...");
        reloadTrip(newTrip.id);
      }
      else
        setTrip(newTrip);
    }
    else
    {
      setIsOwner(true);
      setTrip(newTrip);
    }
  }, [context.userContext.trips, context.currentTripId]);

  const reloadTrip = (idTrip) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_get",
      isRetribution:false,
      data:{ idTrip:idTrip },
      callback:(response) => { setTrip(response); }
    }]});
  };
  
  // Update trip
  const updateTrip = async (tripUpdated, updateArea = false) =>
  {
    const data = { id:G.Functions.newGUID(), actionName:"trip_update", isRetribution:false, data:{ trip:trip, tripUpdated:tripUpdated, updateArea:updateArea } };
    setContext({ ...context, ordersQueue:[...context.ordersQueue, data]});
  }

  // Delete trip
  const deleteTrip = async () =>
  {
    const data = { id:G.Functions.newGUID(), actionName:"trip_delete", isRetribution:false, data:{ trip:trip } };
    setContext({ ...context, previousPageName:backPage, ordersQueue:[...context.ordersQueue, data]});
  }

  const originalTitle = "How would you name your trip?";
  const getTitle = () =>
  {
    return trip?.name !== null && trip?.name !== "" ? trip?.name : originalTitle;
  };

  // Save cover picture
  const saveCover = (cover) =>
  {
    console.log("Saving cover photo...");
    const data = { id:G.Functions.newGUID(), actionName:"trip_saveCover", isRetribution:false, data:{ trip:trip, cover:cover } };
    setContext({ ...context, previousPageName:backPage, ordersQueue:[...context.ordersQueue, data]});
  }
  const changePhoto = () =>
  {
    (async () =>
    {
      if (Platform.OS !== 'web')
      {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
        {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
        else
        {
          let result = await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [2, 1],
            quality: G.Constants.importImageQuality,
          });
          if (!result.cancelled)
            saveCover("data:image/jpg;base64," + result.base64)
        }
      }
    })();
  };

  const deleteItinerary = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"itinerary_delete",
      isRetribution:false,
      data:{ trip:trip }
    }]});
    context.navigate(props.navigation, "Trip");
  }

  // Description
  const [showDescriptionInput, setShowDescriptionInput] = React.useState(false);

  // Travelers
  const saveTravelers = async (travelers) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"traveler_save",
      isRetribution:false,
      data:{ trip:trip, travelers:travelers }
    }]});
  };

  const openTutorial = () =>
  {
    setContext({ ...context, wizardTripId: trip.id });
  };
  React.useEffect(() =>
  {
    if(typeof(context.wizardTripId) !== 'undefined' && context.wizardTripId !== null)
      goTo("TripWizard");
  }, [context.wizardTripId]);

  const [showMenuPopup, setShowMenuPopup] = React.useState(false);
  const tripMenuActions = [
    { visible:isOwner, label:"Tutorial", icon:"cursor-default-click-outline", type:"mci", action:() =>
      {
        setShowMenuPopup(false);
        openTutorial();
      },
    },
    { visible:true, label:"Reload page", icon:"refresh", type:"mci", action:() => 
      {
        setShowMenuPopup(false);
        reloadTrip(trip.id);
      },
    },
    { visible:isOwner, label:"Change name", icon:"feather", type:"mci", action:() =>
      {
        setShowMenuPopup(false);
        setShowInput(true);
      },
    },
    { visible:isOwner, label:"Change image", icon:"image-outline", type:"mci", action:() =>
      {
        setShowMenuPopup(false);
        changePhoto();
      },
    },
    { visible:true, label:"See all my Picks", image:G.Images.picksIcon, icon:"account-group", type:"mci", action:() => 
      {
        setShowMenuPopup(false);
        goTo("PicksList");
      },
    },
    { visible:isOwner, label:"Delete this trip", icon:"trash-can-outline", backColor:G.Colors().Fatal, type:"mci", action:() =>
      {
        setShowDeleteConfirmationPopup(true);
      },
    },
  ];
  
  const itineraryMenuActions = [
    { visible:true, label:"Reload page", icon:"refresh", type:"mci", action:() => 
      {
        setShowMenuPopup(false);
        reloadTrip(trip.id);
      },
    },
    { visible:isOwner, label:"Change trip name", icon:"feather", type:"mci", action:() =>
      {
        setShowMenuPopup(false);
        setShowInput(true);
      },
    },
    { visible:isOwner, label:"Change trip image", icon:"image-outline", type:"mci", action:() =>
      {
        setShowMenuPopup(false);
        changePhoto();
      },
    },
    { visible:true, label:"See all my Picks", image:G.Images.picksIcon, icon:"account-group", type:"mci", action:() => 
      {
        setShowMenuPopup(false);
        goTo("PicksList");
      },
    },
    { visible:isOwner, label:"Delete itinerary", icon:"go-kart-track", color:G.Colors().Fatal, backColor:G.Colors().Foreground(), type:"mci", action:() =>
      {
        setShowDeleteItineraryConfirmationPopup(true);
      },
    },
    { visible:isOwner, label:"Delete this trip", icon:"trash-can-outline", backColor:G.Colors().Fatal, type:"mci", action:() =>
      {
        setShowDeleteConfirmationPopup(true);
      },
    },
  ];

  const actions = props.itineraryMode === true ? itineraryMenuActions : tripMenuActions;

  const getMenuPopup = () =>
  {
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
              name="compass-rose"
              type="mci"
              size={40}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={sPopup.pickStats}>
            <Texts.Label>
              <Text style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {getTitle() + "\n"}
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
  const getAction = (action, index) =>
  {
    if(action.visible === false)
      return (<View key={index}/>);
    return(
      <View key={index} style={sAction.container}>
        <Displayers.Touchable onPress={action.action}>
          <View style={[
            sAction.content,
            action.color ? {borderColor:action.color} : {},
            action.backColor ? {backgroundColor:action.backColor} : {}
          ]}>
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
                  size={20}
                  color={action.color ? action.color : G.Colors().Foreground()}
                />
              }
            </View>
            <View style={sAction.label}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 14, color: action.color ? action.color : G.Colors().Foreground() }}>
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
  }

  const [showInput, setShowInput] = React.useState(false);
  const updateTitle = (newValue) =>
  {
    setShowInput(false);
    updateTrip({ ...trip, name: newValue });
  };

  const [showDeleteConfirmationPopup, setShowDeleteConfirmationPopup] = React.useState(false);
  const confirmations = [
    { label:"Delete", icon:"trash-can-outline", type:"mci", color:G.Colors().Foreground(), backColor:G.Colors().Fatal, action:() =>
      {
        setShowDeleteConfirmationPopup(false);
        setShowMenuPopup(false);
        deleteTrip();
      },
    },
    {label:"Cancel", icon:"chevron-left", type:"mci", action:() => { setShowDeleteConfirmationPopup(false); }},
  ];
  const getDeleteConfirmationPopup = () =>
  {
    return (
      <Popups.Popup
        noCloseButton
        transparent={true}
        containerStyle={{ ...G.S.width(80) }}
        style={{ paddingBottom:20 }}
        visible={showDeleteConfirmationPopup}
        hide={() => setShowDeleteConfirmationPopup(false)}
      >
        <View style={sPopup.container}>
          <View style={sPopup.title}>
            <Texts.Label style={{ fontSize: 18, color:G.Colors().Neutral(0.8) }}>
              Delete your trip?
            </Texts.Label>
          </View>
          {confirmations.map((action, index) => getAction(action, index))}
        </View>
      </Popups.Popup>
    );
  };

  const [showDeleteItineraryConfirmationPopup, setShowDeleteItineraryConfirmationPopup] = React.useState(false);
  const confirmationsItinerary = [
    { label:"Delete", icon:"trash-can-outline", type:"mci", color:G.Colors().Foreground(), backColor:G.Colors().Fatal, action:() =>
      {
        setShowDeleteItineraryConfirmationPopup(false);
        setShowMenuPopup(false);
        deleteItinerary();
      },
    },
    {label:"Cancel", icon:"chevron-left", type:"mci", action:() => { setShowDeleteItineraryConfirmationPopup(false); }},
  ];
  const getDeleteItineraryConfirmationPopup = () =>
  {
    return (
      <Popups.Popup
        noCloseButton
        transparent={true}
        containerStyle={{ ...G.S.width(80) }}
        style={{ paddingBottom:20 }}
        visible={showDeleteItineraryConfirmationPopup}
        hide={() => setShowDeleteItineraryConfirmationPopup(false)}
      >
        <View style={sPopup.container}>
          <View style={sPopup.title}>
            <Texts.Label style={{ fontSize: 18, color:G.Colors().Neutral(0.8) }}>
              Delete your itinerary?
            </Texts.Label>
          </View>
          {confirmationsItinerary.map((action, index) => getAction(action, index))}
        </View>
      </Popups.Popup>
    );
  };

  const getTripContent = () =>
  {
    return (trip === null ? <View/> :
      <TripContent
        goTo={goTo}
        goBack={goBack}
        trip={trip}
        updateTrip={updateTrip}
        saveTravelers={saveTravelers}
        showDescriptionInput={showDescriptionInput}
        setShowDescriptionInput={setShowDescriptionInput}
        lightMode={props.lightMode}
        showMenuPopup={() => setShowMenuPopup(true)}
        isOwner={isOwner}
      />
    );
  };

  const getItineraryContent = () =>
  {
    return (trip === null ? <View/> :
      <ItineraryContent
        navigation={props.navigation}
        goTo={goTo}
        goBack={goBack}
        trip={trip}
        updateTrip={updateTrip}
        saveTravelers={saveTravelers}
        showDescriptionInput={showDescriptionInput}
        setShowDescriptionInput={setShowDescriptionInput}
        lightMode={props.lightMode}
        showMenuPopup={() => setShowMenuPopup(true)}
        isOwner={isOwner}
      />
    );
  };

  return (
    <View style={s.container}>
      {props.itineraryMode === true ? getItineraryContent() : getTripContent()}
      <Pickers.Multilines
        top={true}
        width={96}
        maxLength={60}
        show={showInput}
        hide={() => setShowInput(false)}
        value={getTitle()}
        icon="feather"
        title={originalTitle}
        save={updateTitle}
      />
      {getMenuPopup()}
      {getDeleteConfirmationPopup()}
      {getDeleteItineraryConfirmationPopup()}
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  content:
  {
    ...G.S.width(),
    flex:1,
    zIndex:3,
  }
});

let sPopup = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    padding:5,
    paddingBottom:10,
  },
  title:
  {
    paddingVertical:20,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:"5%",
  },
  pickStats:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:0,
    paddingTop:10,
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
    padding:7,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
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
    paddingBottom: 1,
    paddingLeft: 2,
  },
  iconGo:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    paddingRight:5,
  },
});
