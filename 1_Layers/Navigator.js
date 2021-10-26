import React from "react";
import { View } from "react-native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
// Pages
import Initializer from "../2_Pages/Homepage/Initializer";

import Homepage from "../2_Pages/Homepage/Homepage";
import Guides from "../2_Pages/Guides/Guides";
import Friends from "../2_Pages/Friends/Friends";
import Account from "../2_Pages/Account/Account";

import Search from "../2_Pages/Search/Search";
import Place from "../2_Pages/Place/Place";
import ModifyPlace from "../2_Pages/Place/ModifyPlace";
import Redirector from "../components/Events/Redirector";
import TripsList from "../2_Pages/TripsList/TripsList";
import TripWizard from "../2_Pages/TripWizard/TripWizard";
import Trip from "../2_Pages/Trip/Trip";
import PickSingle from "../2_Pages/Pick/PickSingle";
import PickBrowser from "../2_Pages/Pick/PickBrowser";
import PicksList from "../2_Pages/PicksList/PicksList";
import Itinerary from "../2_Pages/Itinerary/Itinerary";
// Libs
import * as G from "../Libs/Globals";
import * as Wrappers from "../Libs/Wrappers";
// Components
import SyncDaemon from "./SyncDaemon";

const TransitionScreenOptions =
{
  ...TransitionPresets.DefaultTransition,
};

const Stack = createStackNavigator();
export default function Navigator({ navigation, route })
{
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Initializer';
  const cardOptions =
  {
    cardStyle: { backgroundColor:G.Colors().Transparent },
  };
  return (
    <View style={{...G.S.full, backgroundColor:G.Colors().Background()}}>
      <Stack.Navigator headerMode="none" screenOptions={TransitionScreenOptions}>
        <Stack.Screen name="Initializer" component={Initializer} options={cardOptions} />

        <Stack.Screen name="Homepage" component={Homepage} options={cardOptions} />
        <Stack.Screen name="Search" component={Search} options={cardOptions} />
        <Stack.Screen name="Friends" component={Friends} options={cardOptions} />
        <Stack.Screen name="Account" component={Account} options={cardOptions} />
        {/* <Stack.Screen name="Guides" component={Guides} options={cardOptions} /> */}

        <Stack.Screen name="Place" component={Place} options={cardOptions} />
        <Stack.Screen name="ModifyPlace" component={ModifyPlace} options={cardOptions} />
        <Stack.Screen name="Redirector" component={Redirector} options={cardOptions} />
        <Stack.Screen name="TripsList" component={TripsList} options={cardOptions} />
        <Stack.Screen name="TripWizard" component={TripWizard} options={cardOptions} />
        <Stack.Screen name="Trip" component={Trip} options={cardOptions} />
        <Stack.Screen name="PickSingle" component={PickSingle} options={cardOptions} />
        <Stack.Screen name="PickBrowser" component={PickBrowser} options={cardOptions} />
        <Stack.Screen name="PicksList" component={PicksList} options={cardOptions} />
        <Stack.Screen name="Itinerary" component={Itinerary} options={cardOptions} />
      </Stack.Navigator>
      <Wrappers.NavMenu navigation={navigation} activePage={routeName} />
      <SyncDaemon />
    </View>
  );
}
