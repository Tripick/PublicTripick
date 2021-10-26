import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";
import * as Lists from "../../Libs/Lists";
// Components
import AddActivityPopup from "./AddActivityPopup";
import ImportActivityPopup from "./ImportActivityPopup";
import SearchMapActivityPopup from "./SearchMapActivityPopup";
import SearchActivityPopup from "./SearchActivityPopup";
import SavePersonnalActivityPopup from "./SavePersonnalActivityPopup";
import PersonnalActivityPopup from "./PersonnalActivityPopup";

export default function ActivityPopup(props)
{
  const [steps, setSteps] = React.useState([...props.day.steps]);
  const [showAddActivityPopup, setShowAddActivityPopup] = React.useState(false);
  const [showImportActivityPopup, setShowImportActivityPopup] = React.useState(false);
  const [showSearchMapActivityPopup, setShowSearchMapActivityPopup] = React.useState(false);
  const [showSearchActivityPopup, setShowSearchActivityPopup] = React.useState(false);
  const [showPersonnalActivityPopup, setShowPersonnalActivityPopup] = React.useState(false);
  const [personnalToDisplay, setPersonnalToDisplay] = React.useState(null);
  React.useEffect(() =>
  {
    let stepsCopy = [...props.day.steps];
    stepsCopy = [...stepsCopy.filter(x => x.isVisit === true), ...stepsCopy.filter(x => x.isVisit === false)];
    stepsCopy.forEach((s,i) => { s.index = i; });
    stepsCopy = JSON.parse(JSON.stringify(stepsCopy));
    setSteps(stepsCopy);
  }, [props.day, props.day.steps, props.show]);

  const save = () =>
  {
    const orderedSteps = [...steps.filter(x => x.isVisit === true), ...steps.filter(x => x.isVisit === false)];
    orderedSteps.forEach((s,i) => { s.index = i; });
    props.save(props.day.id, orderedSteps);
  };
  
  const [tappedItem, setTappedItem] = React.useState(-1);
  const selectStep = (stepId) =>
  {
    const step = steps.filter(x => x.id === stepId)[0];
    const indexOfStep = steps.indexOf(step);
    const newSteps = [...steps];
    newSteps[indexOfStep].isVisit = !newSteps[indexOfStep].isVisit;
    setTappedItem(step.index);
    setSteps([...newSteps]);
  };

  const getItem = (handler, id, step) =>
  {
    const isPersonnal = typeof(step.visit) === 'undefined' || step.visit === null;
    let stepName = typeof(step.name) !== 'undefined' && step.name !== null && step.name.length > 0 ? step.name : step.visit.place?.nameTranslated;
    let stepSubname = isPersonnal === false && typeof(step.name) !== 'undefined' && step.name !== null && step.name.length > 0 ? step.visit.place?.nameTranslated : null;
    return (
      <View key={step.id} style={[ss.container, step.isVisit === false ? {borderColor:G.Colors().Grey(0.3)} : {}]}>
        <View style={ss.selectButton}>
          <Displayers.IconRound
            name={step.isVisit === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
            size={25}
            type={"mci"}
            color={G.Colors().Green()}
          />
          <Displayers.TouchableOverlay onPress={() => selectStep(step.id)} />
        </View>
        <View style={ss.name}>
          <Displayers.Touchable style={{...G.S.center, ...G.S.full}} onPress={() =>
            isPersonnal === true ? setPersonnalToDisplay(step) : props.setPlaceToDisplay(step.visit.place.id)}
          >
            <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
              <Text style={{fontSize: 11, color:(step.isVisit === false ? G.Colors().Grey() : G.Colors().Highlight())}}>{stepName}</Text>
            </Texts.Label>
            {stepSubname === null ? <View/> : 
              <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
                <Text style={{fontSize: 10, color:G.Colors().Grey()}}>
                  {stepSubname}
                </Text>
              </Texts.Label>
            }
          </Displayers.Touchable>
        </View>
        {step.isVisit === false ?
          (step.id <= 0 ? <View/> :
            <View style={ss.orderButton}>
              <Displayers.IconRound
                name={"calendar-arrow-right"}
                size={25}
                type={"mci"}
                color={G.Colors().Highlight()}
              />
              <Displayers.TouchableOverlay onPress={() => props.setStepToMove(step)} />
            </View>
          )
          :
          <View style={ss.orderButton} {...handler}>
            <Displayers.IconRound
              name={"compare-vertical"}
              size={25}
              type={"mci"}
              color={G.Colors().Highlight()}
            />
          </View>
        }
      </View>
    );
  };

  const [activitiesToImport, setActivitiesToImport] = React.useState([]);
  const loadActivitiesToImport = () =>
  {
    // Get all activities of all other days and order them by distance to the current day's firrst activity
    let allActivities = [];
    const days = JSON.parse(JSON.stringify(props.trip.itinerary.days));
    days.filter(d => d.id !== props.day.id).forEach(day => { allActivities = [...allActivities, ...day.steps]; });
    if(steps.length > 0)
    {
      const start = G.Functions.coordinatesStep(steps[0]);
      allActivities.forEach(a =>
      {
        const end = G.Functions.coordinatesStep(a);
        a.distanceToPassage = G.Functions.coordinatesDistance(start.lat, start.lon, end.lat, end.lon);
      });
      allActivities = allActivities.sort((a, b) => (a.distanceToPassage - b.distanceToPassage));
    }
    allActivities.forEach(a => { a.day = props.trip.itinerary.days.filter(d => d.id === a.idDay)[0]; });
    setShowAddActivityPopup(false);
    setActivitiesToImport(allActivities);
    setShowImportActivityPopup(true);
  };

  const importActivitiesFromOtherDays = (activitiesToImport) =>
  {
    setShowImportActivityPopup(false);
    activitiesToImport.forEach(a => { a.isVisit = true; });
    const allSteps = [...steps, ...activitiesToImport];
    const orderedSteps = [...allSteps.filter(x => x.isVisit === true), ...allSteps.filter(x => x.isVisit === false)];
    orderedSteps.forEach((s,i) => { s.index = i; s.day = null });
    setSteps(orderedSteps);
  };

  const importActivityFromSearch = (place) =>
  {
    setShowSearchMapActivityPopup(false);
    setShowSearchActivityPopup(false);
    const newStep = { id:-1, idDay:props.day.id, time:props.day.date, isVisit:true, visit:{ idPlace:place.id, place:place } };
    const allSteps = [...steps, newStep];
    const orderedSteps = [...allSteps.filter(x => x.isVisit === true), ...allSteps.filter(x => x.isVisit === false)];
    orderedSteps.forEach((s,i) => { s.index = i; s.day = null });
    setSteps(orderedSteps);
  };

  const savePersonnalActivity = (activity) =>
  {
    setShowPersonnalActivityPopup(false);
    const newStep = {
      ...activity,
      id:activity.id > 0 ? activity.id : -2,
      idDay:props.day.id,
      isVisit:true,
      visit:null,
      time:typeof(activity.time) === 'undefined' || activity.time === null ? props.day.date : activity.time
    };
    const allSteps = [...steps, newStep];
    const orderedSteps = [...allSteps.filter(x => x.isVisit === true), ...allSteps.filter(x => x.isVisit === false)];
    orderedSteps.forEach((s,i) => { s.index = i; s.day = null });
    setSteps(orderedSteps);
  };
  const updatePersonnalActivity = (activity) =>
  {
    setPersonnalToDisplay(null);
    const allSteps = [...steps];
    let newStep = steps.filter(s => s.id === activity.id)[0];
    const indexOfStep = allSteps.indexOf(newStep);
    allSteps[indexOfStep] = {...newStep, ...activity,
      time:typeof(activity.time) === 'undefined' || activity.time === null ? props.day.date : activity.time};
    const orderedSteps = [...allSteps.filter(x => x.isVisit === true), ...allSteps.filter(x => x.isVisit === false)];
    orderedSteps.forEach((s,i) => { s.index = i; s.day = null });
    setSteps(orderedSteps);
  };
  
  return (
    <Popups.Popup
      noCloseButton={false}
      backButton={true}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:0 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="order-bool-descending-variant"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Select and order activities"}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n\nClick on an activity for more details"}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.buttonAdd}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="plus"
            type="mci"
            size={22}
            color={G.Colors().Background()}
            onPress={() => setShowAddActivityPopup(true)}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
        <Lists.SortList
          horizontal={false}
          data={steps}
          renderItem={getItem}
          save={setSteps}
          edgingDelay={350}
          edgeZonePercent={10}
          edgeColor={G.Colors().Highlight(0.3)}
          style={s.list}
          contentContainerStyle={s.contentContainer}
          forceScrollTo={tappedItem}
          resetForceScrollTo={() => setTappedItem(-1)}
        />
        <View style={s.footerContainer}>
          <View style={s.footer}>
            <View style={[s.buttonContainer, {marginLeft:5}]}>
              <Buttons.Label
                center
                shadow
                iconRight
                alignWidth
                contentForeground
                backgroundHighlight
                iconName="check"
                type="mci"
                style={s.buttonLabel}
                size={20}
                containerStyle={{...G.S.width()}}
                contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
                iconStyle={{right:10}}
                onPress={save}
              >
                Save
              </Buttons.Label>
            </View>
          </View>
        </View>
      </View>
      <AddActivityPopup
        show={showAddActivityPopup}
        hide={() => setShowAddActivityPopup(false)}
        import={loadActivitiesToImport}
        searchMap={() => { setShowAddActivityPopup(false); setShowSearchMapActivityPopup(true); }}
        search={() => { setShowAddActivityPopup(false); setShowSearchActivityPopup(true); }}
        personnal={() => { setShowAddActivityPopup(false); setShowPersonnalActivityPopup(true); }}
      />
      <ImportActivityPopup
        day={props.day}
        show={showImportActivityPopup}
        hide={() => setShowImportActivityPopup(false)}
        activities={activitiesToImport}
        save={importActivitiesFromOtherDays}
        setPlaceToDisplay={props.setPlaceToDisplay}
      />
      <SearchMapActivityPopup
        trip={props.trip}
        day={props.day}
        show={showSearchMapActivityPopup}
        hide={() => setShowSearchMapActivityPopup(false)}
        save={importActivityFromSearch}
        setPlaceToDisplay={props.setPlaceToDisplay}
        getDayPosition={props.getDayPosition}
      />
      <SearchActivityPopup
        trip={props.trip}
        day={props.day}
        show={showSearchActivityPopup}
        hide={() => setShowSearchActivityPopup(false)}
        save={importActivityFromSearch}
        setPlaceToDisplay={props.setPlaceToDisplay}
        navigation={props.navigation}
      />
      <SavePersonnalActivityPopup
        show={showPersonnalActivityPopup}
        hide={() => setShowPersonnalActivityPopup(false)}
        day={props.day}
        save={savePersonnalActivity}
        navigation={props.navigation}
        getDayPosition={props.getDayPosition}
        displayMessage={props.displayMessage}
      />
      <PersonnalActivityPopup
        show={personnalToDisplay !== null}
        hide={() => setPersonnalToDisplay(null)}
        activity={personnalToDisplay}
        day={props.day}
        getDayPosition={props.getDayPosition}
        readOnly={false}
        save={updatePersonnalActivity}
      />
    </Popups.Popup>
  );
}

let ss = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(94),
    aspectRatio:6,
    flexDirection:'row',
    marginVertical:5,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  index:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
  },
  name:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  selectButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
    marginLeft:10,
  },
  orderButton:
  {
    ...G.S.height(),
    aspectRatio:0.5,
    marginHorizontal:10,
  },
});

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingTop:30,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  buttonAdd:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    marginBottom:"5%",
  },
  list:
  {
    ...G.S.center,
    ...G.S.width(96),
    flex:1,
    borderWidth:1,
    borderRadius:10,
    borderColor:G.Colors().Neutral(0.2),
    backgroundColor: G.Colors().Background(),
  },
  contentContainer:
  {
    ...G.S.width(),
  },
  footerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:5,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(50),
    aspectRatio:3.5,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
  },
});
  