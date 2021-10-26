import React from "react";
import { StyleSheet, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import PickSlider from "./PickSlider";

export default function PickSingle({ navigation, onGoBack })
{
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  
  const [previousPageName, setPreviousPageName] = React.useState(context.previousPageName);
  const goBack = () =>
  {
    if(onGoBack) onGoBack();
    else context.navigate(navigation, previousPageName);
  }

  const [pick, setPick] = React.useState(null);
  const getPick = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"pick_get",
      isRetribution:false,
      data:{ id:context.currentPlaceId },
      callback:getPickOnSuccess
    }]});
  };
  const getPickOnSuccess = (response) =>
  {
    setPick(response);
  };
  React.useEffect(() => { getPick(); }, []);

  return (
    <Wrappers.AppFrame loading={loading}>
      <View style={s.container}>
        <View style={s.content}>
          {pick !== null ?
            <PickSlider
              noRater={true}
              navigation={navigation}
              trip={null}
              picks={[pick]}
              index={0}
              onIndexChange={() => {}}
              goBack={goBack}
              existingPicksCount={0}
              globalPicksCount={1}
              totalPicksCount={1}
              savePick={() => {}}
              saveFilters={() => {}}
              saveFlag={() => {}}
              deleteFlag={() => {}}
              applyFilters={() => {}}
              showFiltersPopup={() => {}}
              setShowFiltersPopup={() => {}}
              itineraryPercentIndicator={0}
            />
            :
            <View/>
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