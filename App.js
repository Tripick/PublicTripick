import React from "react";
import { LogBox, StatusBar, StyleSheet, View, SafeAreaView } from "react-native";
import { AppearanceProvider } from 'react-native-appearance';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Google from "expo-google-app-auth";
// Context
import { AppContext } from "./AppContext";
// Libs
import * as G from "./Libs/Globals";
import * as Displayers from "./Libs/Displayers";
// Components
import Login from "./1_Layers/Login";
import Register from "./1_Layers/Register";
import Reset from "./1_Layers/Reset";
import Navigator from "./1_Layers/Navigator";

// Warnings
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
])

// Globals
const Stack = createStackNavigator();

// App
function App(props)
{
  const [fontLoaded] = useFonts({
    ...Ionicons.font,
    "multilines": require("./assets/fonts/Roboto-Regular.ttf"),
    "label": require("./assets/fonts/Roboto-Regular.ttf"),
    "labelBold": require("./assets/fonts/Roboto-Bold.ttf"),
    "button": require("./assets/fonts/Roboto-Regular.ttf"),
    "title": require("./assets/fonts/Roboto-Regular.ttf"),
    "titleMedium": require("./assets/fonts/Roboto-Regular.ttf"),
    "titleBold": require("./assets/fonts/Roboto-Bold.ttf"),
    "clip": require("./assets/fonts/clip.ttf"),
  });

  const [state, dispatch] = React.useReducer(
    (prevState, action) =>
    {
      switch (action.type)
      {
        case "NO_TOKEN":
          return {
            ...prevState,
            isLoading: false,
            isLoggedIn: false,
            userContext: null,
          };
        case "LOGGED_IN":
          return {
            ...prevState,
            isLoading: false,
            isLoggedIn: true,
            userContext: action.userContext,
          };
        case "LOGGED_OUT":
          return {
            ...prevState,
            isLoading: false,
            isLoggedIn: false,
            userContext: null,
          };
      }
    },
    {
      loaderIsVisible: false,
      isLoading: true,
      isLoggedIn: false,
      userContext: null,
    }
  );

  // Context
  // ---------------------------------- PUBLIC METHODS ---------------------------------- //
  const appState =
  {
    authenticationState: G.AuthenticationStates.LOGGED_OUT,
    authenticationMessage: "",
    // Common
    navigate: async (navigation, screenName) => navigation.navigate(screenName),
    // Login
    logout: async (data) =>
    {
      return await logout(data);
    },
    login: async (data, onSuccess, onError) =>
    {
      return await login(data, onSuccess, onError);
    },
    register: async (data, onSuccess, onError) =>
    {
      return await register(data, onSuccess, onError);
    },
    reset: async (data, onSuccess, onError) =>
    {
      return await reset(data, onSuccess, onError);
    },
    signInWithGoogleAsync: async () =>
    {
      return await signInWithGoogleAsync();
    },
  };

  const [context, setContext] = React.useState(appState);

  // ---------------------------------- PRIVATE METHODS ---------------------------------- //
  const fillContext = (userContext) =>
  {
    setContext({
      ...context,
      functions:
      {
        ...context.functions,
        logout: logout
      },
      authenticationState: G.AuthenticationStates.LOGGED_IN,
      authenticationMessage: "",
      userContext: userContext,
      ordersQueue: [],
    });
  };
  const register = async (data, onSuccess, onError) =>
  {
    console.log("Register...");
    await G.Functions.serverRequest(
      null,
      "account/register",
      {
        Email: data.mail,
        Username: data.username,
        Password: data.password,
        ConfirmPassword: data.password,
      },
      async (result) =>
      {
        await G.Functions.setAsyncStorage("authenticationKeys",
        {
          id: result.authenticationKeys.id,
          accessToken: result.authenticationKeys.accessToken,
        });
        fillContext(result);
        onSuccess(result);
        dispatch({
          type: "LOGGED_IN",
          userContext: result,
        });
      },
      onError
    );
  };
  const login = async (data, onSuccess, onError) =>
  {
    console.log("Login...");
    await G.Functions.serverRequest(
      null,
      "account/login",
      { Email: data.mail, Password: data.password, RememberMe: true },
      async (result) =>
      {
        console.log("Connected, storing authenticationKeys...");
        await G.Functions.setAsyncStorage("authenticationKeys",
        {
          id: result.authenticationKeys.id,
          accessToken: result.authenticationKeys.accessToken,
        });
        fillContext(result);
        onSuccess(result);
        dispatch(
        {
          type: "LOGGED_IN",
          userContext: result,
        });
      },
      onError
    );
  };
  const loginByToken = async (authenticationKeys) =>
  {
    console.log("LoginByToken...");
    await G.Functions.serverRequest(
    {
      authenticationKeys:
      {
        id: authenticationKeys.id,
        accessToken: authenticationKeys.accessToken,
      },
    },
    "account/loginByToken",
    null,
    (result) =>
    {
      console.log("Automatically logged in with saved access token.");
      fillContext(result);
      dispatch({
        type: "LOGGED_IN",
        userContext: result,
      });
    },
    async (error) =>
    {
      if(typeof(error) !== 'undefined' && error !== null && typeof(error.message) !== 'undefined' && error.message !== null &&
      error.message === "Authentication keys invalid or expired.")
      {
        console.log("Authentication token expired. Redirecting to Login.");
        await G.Functions.setAsyncStorage("authenticationKeys", null);
        setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:"Token expired, please log in again with your credentials." });
        dispatch({ type: "NO_TOKEN" });
      }
      else
      {
        console.log("Could not login automatically with access token :");
        console.log(error);
        setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:"Unable to log in, please try again." });
        dispatch({ type: "NO_TOKEN" });
      }
    });
  };
  const signInWithGoogleAsync = async () =>
  {
    try
    {
      const result = await Google.logInAsync({
        androidClientId: G.Constants.androidClientId,
        iosClientId: G.Constants.iosClientId,
        androidStandaloneAppClientId: G.Constants.androidStandaloneAppClientId,
        iosStandaloneAppClientId: G.Constants.iosStandaloneAppClientId,
        scopes: ["profile", "email"],
      });
      if (result.type === "success")
      {
        fillContext(result.user);
        dispatch(
        {
          type: "LOGGED_IN",
          userContext: result.user,
        });
        return result.accessToken;
      }
      else
      {
        return { cancelled: true };
      }
    }
    catch (e)
    {
      return { error: true };
    }
  };
  const logout = async (username) =>
  {
    await G.Functions.clearStore("context" + username);
    await G.Functions.setAsyncStorage("authenticationKeys", null);
    setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:"You are now disconnected." });
    dispatch({ type: "LOGGED_OUT" });
  };
  const reset = async (data, onSuccess, onError) =>
  {
    console.log("Reset...");
    await G.Functions.serverRequest(
      null,
      "account/reset",
      { Email: data.mail },
      async (result) =>
      {
        console.log("Password for [" + data.mail + "] reset successfully.");
        onSuccess(result);
      },
      onError
    );
  };

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() =>
  {
    async function loadResourcesAndDataAsync()
    {
      try
      {
        await SplashScreen.preventAutoHideAsync();
      }
      catch (e)
      {
        console.warn(e);
      }
      try
      {
        let authenticationKeys = await G.Functions.getAsyncStorage("authenticationKeys");
        if(typeof authenticationKeys !== "undefined" && authenticationKeys !== null)
          loginByToken(authenticationKeys);
        else
        {
          console.log("No token saved, redirect to login page.");
          dispatch({ type: "NO_TOKEN" });
        }
      }
      catch (e)
      {
        console.warn(e);
        setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:"An error occured while attempting to connect:\n" + e });
        dispatch({ type: "CONNECTION_ERROR" });
      }
      finally
      {
        await SplashScreen.hideAsync();
      }
    }
    if(state.isLoggedIn === false)
      loadResourcesAndDataAsync();
  }, []);

  if (fontLoaded && !state.isLoading)
  {
    return (
      <View style={s.app}>
        <View style={s.appContent}>
          <StatusBar barStyle="default" hidden={true} />
          <AppContext.Provider value={[context, setContext]}>
            <NavigationContainer>
              <Stack.Navigator headerMode="none">
                {typeof state.userContext === "undefined" || state.userContext === null ?
                  // LOGGED OUT
                  <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Reset" component={Reset} />
                  </>
                  :
                  // LOGGED IN
                  <Stack.Screen name="Navigator" component={Navigator} />
                }
              </Stack.Navigator>
            </NavigationContainer>
          </AppContext.Provider>
        </View>
      </View>
    );
  }
  else
    return <Displayers.LoaderVertical isVisible={true} noBackground={true} />;
}

export default () => (
  <AppearanceProvider>
    <View style={s.app}>
      <SafeAreaView style={{ flex:1 }}>
        <App />
      </SafeAreaView>
    </View>
  </AppearanceProvider>
);

const s = StyleSheet.create({
  app:
  {
    ...G.S.full,
    backgroundColor: "black",
    justifyContent:'flex-end',
  },
  appContent:
  {
    ...G.S.full,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 30,
    overflow:'hidden',
  },
});
