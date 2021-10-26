import React from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Popups from "../../Libs/Popups";
import * as Wrappers from "../../Libs/Wrappers";
import * as Displayers from "../../Libs/Displayers";
// Components
import PickThumbnail from "./PickThumbnail";
import PickSlider from "../Pick/PickSlider";

export default function PicksList({ navigation })
{
  const quantityToLoad = 5000;
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [previousPageName, setPreviousPageName] = React.useState(context.previousPageName);
  const [showPickSlider, setShowPickSlider] = React.useState(false);
  const [selectedPickIndex, setSelectedPickIndex] = React.useState(0);
  const goBack = () => { context.navigate(navigation, previousPageName); }
  const onPickClick = (idPlace) =>
  {
    setSelectedPickIndex(picksList.indexOf(picksList.filter(p => p.idPlace === idPlace)[0]));
    setShowPickSlider(true);
  };
  const getPickSlider = () =>
  {
    return (
      <Popups.Popup
        noCloseButton={true}
        containerStyle={{ ...G.S.height(), ...G.S.width() }}
        visible={showPickSlider}
        hide={() => {}}
      >
        <PickSlider
          navigation={navigation}
          trip={trip}
          picks={picksList}
          index={selectedPickIndex}
          onIndexChange={() => {}}
          goBack={backToPicksList}
          existingPicksCount={existingPicksCount}
          globalPicksCount={existingPicksCount}
          totalPicksCount={existingPicksCount}
          savePick={savePick}
        />
      </Popups.Popup>
    );
  };
  const backToPicksList = () =>
  {
    setSelectedPickIndex(0);
    setShowPickSlider(false);
  };

  // Trip
  const load = () => { return [...context.userContext.trips].filter((t) => t.id === context.currentTripId)[0]; };
  const [trip, setTrip] = React.useState(load());
  React.useEffect(() =>
  {
    setTrip(load());
  }, [context.currentTripId]);
  const [picksList, setPicksList] = React.useState([]);
  const [existingPicksCount, setExistingPicksCount] = React.useState(-1);
  const loadNextPicks = () =>
  {
    if(existingPicksCount === -1 || picksList.length < existingPicksCount)
    {
      setContext({ ...context, ordersQueue:[...context.ordersQueue,
      {
        id:G.Functions.newGUID(),
        actionName:"pick_getAll",
        isRetribution:false,
        data:{ idTrip:trip.id, quantity:quantityToLoad, skip:picksList.length },
        callback:getAllPicksOnSuccess
      }]});
    }
  };
  const getAllPicksOnSuccess = (response) =>
  {
    if (response !== null)
    {
      setExistingPicksCount(response.existingPicksCount);
      const existingPicksIds = picksList.map(p => p.id);
      const newPicks = response.picks.filter(p => existingPicksIds.indexOf(p.id) === -1);
      setPicksList([...picksList, ...newPicks]);
    }
  };
  React.useEffect(() => { loadNextPicks(); }, []);

  const savePick = (idTrip, idPlace, rating) =>
  {
    const onSuccessSavePick = (response) =>
    {
      let tempPicks = [...picksList];
      tempPicks[tempPicks.indexOf(tempPicks.filter(p => p.idPlace === idPlace)[0])].rating = rating;
      setPicksList(tempPicks);
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

  const getHeader = () =>
  {
    return (
      <View style={s.header}>
        <Texts.Title style={s.title}>
          <Text style={{fontSize: 16, color: G.Colors().Highlight()}}>Picked places</Text>
          <Text style={{fontSize: 12, color: G.Colors().Neutral(0.6)}}>{existingPicksCount > 0 ? "\n(" + existingPicksCount + ")" : ""}</Text>
        </Texts.Title>
        <View style={s.backButton}>
          <Displayers.Flag
            onClick={goBack}
            name="chevron-left"
            type="mci"
            label=""
            sizeModifier={0}
            containerStyle={{backgroundColor:G.Colors().Highlight()}}
            color={G.Colors().Foreground()}
          />
        </View>
      </View>
    );
  };

  const displayPick = (pick) =>
  {
    const index = picksList.indexOf(picksList.filter(p => p.id === pick.id)[0]);
    return (
      <PickThumbnail
        key={index}
        index={index}
        disable={false}
        onPickClick={onPickClick}
        pick={pick}
        existingPicksCount={existingPicksCount}
        totalPicksCount={existingPicksCount}
        savePick={savePick}
      />
    );
  };

  return (
    <Wrappers.AppFrame loading={loading}>
      <View style={s.container}>
        {getHeader()}
        <View style={s.content}>
          <FlatList
            style={s.list}
            contentContainerStyle={{ paddingTop:G.Layout.window.width / 5, }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            data={picksList}
            renderItem={(itemData) => displayPick(itemData.item)}
            initialNumToRender={quantityToLoad}
          />
        </View>
      </View>
      {getPickSlider()}
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
  header:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    aspectRatio:6,
    backgroundColor: G.Colors().Foreground(),
    position:'absolute',
    top:0,
    zIndex:5,
  },
  title:
  {
    ...G.S.width(),
    fontSize: 16,
    color: G.Colors().Highlight(),
    position:'absolute',
  },
  backButton:
  {
    ...G.S.center,
    height:50,
    aspectRatio: 1,
    position:'absolute',
    left:0,
  },
  addButton:
  {
    ...G.S.center,
    height:50,
    aspectRatio: 1,
    position:'absolute',
    right:10,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    zIndex:3,
  },
  list:
  {
    ...G.S.full,
  },
  loadMoreContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
  }
});