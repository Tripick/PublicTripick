import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Wrappers from "../../Libs/Wrappers";
import * as Displayers from "../../Libs/Displayers";
// Components
import TripThumbnail from "./TripThumbnail";

export default function TripsList({ navigation })
{
  const [context, setContext] = useContext(AppContext);
  const [loading, setLoading] = React.useState(false);

  // Trip list : init and update via context
  const load = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_getAll",
      isRetribution:false,
      data:{ pageIndex:0, pageSize:1000 }
    }]});
  };
  const [tripsList, setTripsList] = React.useState([]);
  React.useEffect(() => setTripsList([...context.userContext.trips]), [context.userContext.trips]);
  useFocusEffect(React.useCallback(() =>
  {
    const loadCallback = async () => { load(); };
    loadCallback();
  }, []));

  const onTripClick = (idTrip) =>
  {
    setContext(
    {
      ...context,
      previousPageName: "TripsList",
      currentTripId: idTrip,
    });
    context.navigate(navigation, "Trip");
  };

  const getHeader = () =>
  {
    return (
      <View style={s.header}>
        <Texts.Title style={s.title}>My trips</Texts.Title>
        <View style={s.backButton}>
          <Displayers.Flag
            onClick={() => context.navigate(navigation, "Initializer")}
            name="chevron-left"
            type="mci"
            label=""
            sizeModifier={0}
            containerStyle={{backgroundColor:G.Colors().Highlight()}}
            color={G.Colors().Foreground()}
          />
        </View>
        <View style={s.addButton}>
          <Displayers.Flag
            onClick={createTrip}
            name="plus"
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

  // Create trip
  const createTrip = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_create",
      isRetribution:false,
      data:{ },
      callback:createTripOnSuccess
    }]});
  };
  const createTripOnSuccess = (response) =>
  {
    setContext({ ...context, previousPageName: "TripsList", currentTripId: response.id });
    context.navigate(navigation, "Trip");
  };

  return (
    <Wrappers.AppFrame>
      <View style={s.container}>
        {getHeader()}
        <View style={s.content}>
          {typeof(tripsList) === 'undefined' || tripsList === null ? <View/> :
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => String(typeof item === "undefined" || item === null ? index : item.id)}
              data={tripsList}
              renderItem={(itemData) => (<TripThumbnail onTripClick={onTripClick} trip={itemData.item} />)}
            />
          }
        </View>
      </View>
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor: G.Colors().Foreground(),
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  header:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(5),
    backgroundColor: G.Colors().Foreground(),
    aspectRatio:6,
  },
  title:
  {
    ...G.S.width(),
    fontSize: 20,
    color: G.Colors().Highlight(),
    position:'absolute',
  },
  backButton:
  {
    ...G.S.center,
    height:50,
    aspectRatio: 1,
    position:'absolute',
    left:10,
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
    marginTop:10,
  },
});
