import React from "react";
import { StyleSheet, View, Animated } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import TripWizardTitle from "./TripWizardTitle";
import NameAndPhoto from "./NameAndPhoto";
import TutorialChoice from "./TutorialChoice";
import _01_Presentation from "./_01_Presentation";
import _02_Area from "./_02_Area";
import _03_StartDate from "./_03_StartDate";
import _04_StartPosition from "./_04_StartPosition";
import _05_EndDate from "./_05_EndDate";
import _06_EndPosition from "./_06_EndPosition";
import _07_Travelers from "./_07_Travelers";
import _08_PickTutorial from "./_08_PickTutorial";

export default function TripWizard({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const [trip, setTrip] = React.useState(null);
  React.useEffect(() =>
  {
    if(trip !== null)
      setTrip(context.userContext.trips.filter((t) => t.id === trip.id)[0]);
  }, [context.userContext.trips]);

  const goBack = () => { context.navigate(navigation, backPage); }
  const goToTrip = () =>
  {
    context.navigate(navigation, "Trip");
  };

  // Pick display
  const [indexPath, setIndexPath] = React.useState(-1);
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const snapToNext = async () =>
  {
    if(indexPath === wizardPath.length - 1)
      context.navigate(navigation, "Trip");
    else
    {
      Animated.timing(animation, { toValue: -1, duration: 500, }).start(() =>
      {
        setIndexPath(indexPath + 1);
        animation.setValue(1);
      });
    }
  };
  const snapToPrevious = async () =>
  {
    if(indexPath <= 1)
      goBack();
    else
    {
      Animated.timing(animation, { toValue: 1, duration: 500, }).start(() =>
      {
        setIndexPath(indexPath - 1);
        animation.setValue(-1);
      });
    }
  };
  React.useEffect(() =>
  {
    Animated.timing(animation, { toValue: 0, duration: 500, }).start();
    return () => { animation.stopAnimation() };
  }, [indexPath]);
  const animateSnapPosition = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-G.Layout.window.width * 2, 0, G.Layout.window.width * 2],
  });
  React.useEffect(() =>
  {
    if(typeof(context.wizardTripId) !== 'undefined' && context.wizardTripId !== null)
    {
      setContext({ ...context, wizardTripId:null });
      setTrip([...context.userContext.trips].filter((t) => t.id === context.wizardTripId)[0]);
      setIndexPath(1);
    }
  }, [context.wizardTripId]);
  
  // Create trip
  const createTrip = (name, photo) =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"wizard_createTrip",
      isRetribution:false,
      data:{ name:name, photo:photo },
      callback:createTripOnSuccess
    }]});
  };
  const createTripOnSuccess = (response) =>
  {
    setTrip(response);
    snapToNext();
  };

  // Update trip
  const updateTrip = (tripUpdated) =>
  {
    snapToNext();
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"wizard_update",
      isRetribution:false,
      data:{ trip:trip, tripUpdated:tripUpdated }
    }]});
  }

  // Path
  const wizardPath = [
    {id:-1, pageName:"NameAndPhoto", title:"Create a new trip"},
    {id:0, pageName:"TutorialChoice", title:"Trip tutorial"},
    {id:1, pageName:"_01_Presentation", title:"What is Tripick?"},
    {id:2, pageName:"_02_Area", title:"Select the area to visit"},
    {id:3, pageName:"_03_StartDate", title:"Trip start date"},
    {id:4, pageName:"_04_StartPosition", title:"Where will you start your trip?"},
    {id:5, pageName:"_05_EndDate", title:"Trip end date"},
    {id:6, pageName:"_06_EndPosition", title:"Where will your trip end?"},
    {id:7, pageName:"_07_Travelers", title:"Friends traveling with you"},
    {id:8, pageName:"_08_PickTutorial", title:"Let's pick places!"},
  ];

  const getCard = () =>
  {
    return (
      <View style={s.pickCardContent}>
        <View style={s.pickCardContentFrame}>
          {getCardContent(wizardPath.filter(x => x.id === indexPath)[0])}
        </View>
      </View>
    );
  };

  const getCardContent = (path) =>
  {
    return (
      path.id === -1 ? <NameAndPhoto next={snapToNext} trip={trip} createTrip={createTrip}/> :
      path.id === 0 ? <TutorialChoice next={snapToNext} trip={trip} close={() => context.navigate(navigation, "Trip")} /> :
      path.id === 1 ? <_01_Presentation next={snapToNext} /> :
      path.id === 2 ? <_02_Area trip={trip} next={snapToNext} updateTrip={updateTrip} /> :
      path.id === 3 ? <_03_StartDate trip={trip} next={snapToNext} updateTrip={updateTrip} /> :
      path.id === 4 ? <_04_StartPosition trip={trip} next={snapToNext} updateTrip={updateTrip} /> :
      path.id === 5 ? <_05_EndDate trip={trip} next={snapToNext} updateTrip={updateTrip} /> :
      path.id === 6 ? <_06_EndPosition trip={trip} next={snapToNext} updateTrip={updateTrip} /> :
      path.id === 7 ? <_07_Travelers trip={trip} next={snapToNext} /> :
      path.id === 8 ? <_08_PickTutorial trip={trip} next={goToTrip} /> :
      <View/>
    );
  };

  const getTitle = () =>
  {
    const path = wizardPath.filter(x => x.id === indexPath)[0];
    return (
      <TripWizardTitle
        isFirst={indexPath === -1}
        previous={snapToPrevious}
        title={path.title}
        path={path.id}
        totalPath={wizardPath.length - 2}
      />
    );
  };

  return (
    <Wrappers.AppFrame>
      <View style={s.container}>
        <View style={s.visibleFrame}>
          <View style={s.pickPageContainer}>
            <View style={s.headerContainer}>
              {getTitle()}
            </View>
            <Animated.View style={[s.pickCard, {marginLeft:animateSnapPosition}]}>
              {getCard()}
            </Animated.View>
          </View>
        </View>
      </View>
    </Wrappers.AppFrame>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.full,
    backgroundColor:G.Colors().Foreground()
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
  },
  pickCard:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  pickCardContent:
  {
    ...G.S.center,
    ...G.S.full,
  },
  pickCardContentFrame:
  {
    ...G.S.center,
    ...G.S.full,
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
    overflow: "visible",
    zIndex:1001,
  },
  pickPageContainer:
  {
    ...G.S.center,
    ...G.S.full,
  },
});