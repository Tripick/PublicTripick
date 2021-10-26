import React, { useContext } from "react";
import { StyleSheet, View, Image, Keyboard, Text, TextInput } from "react-native";
// Context
import { AppContext } from "../AppContext";
// Libs
import * as G from "../Libs/Globals";
import * as Displayers from "../Libs/Displayers";
import * as Popups from "../Libs/Popups";
import * as Texts from "../Libs/Texts";

export default function Register({ navigation })
{
  const [context, setContext] = useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [showAuthenticationMessage, setShowAuthenticationMessage] = React.useState(
    context.authenticationState === G.AuthenticationStates.CONNECTION_ERROR && context.authenticationMessage !== "");
  const [mail, setMail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const onSuccess = (response) =>
  { 
    //setLoading(false);
  };
  const onError = (error) =>
  {
    setLoading(false);
    if(error !== null && error.message !== null && error.message !== "") displayMessage(error.message);
    else if(error !== null && error !== "") displayMessage(error);
    else displayMessage("Registration failed. Please try again.");
  };
  const displayMessage = (message) =>
  {
    console.log("REGISTER ERROR : " + message);
    if(message === "Network request failed") message = "Server unreachable.\nCheck your internet connection or try again later.";
    setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:"Unable to register:\n" + message });
  }
  
  const getButton = (text, onPress, image, style, textStyle) =>
  {
    return (
      <Displayers.Touchable onPress={onPress} style={[s.button, style !== null ? style : {}]}>
        {image !== null ?
          <View style={s.buttonLogo}>
            <Image style={s.buttonImage} source={image} resizeMode="contain" />
          </View>
          :
          <View/>
        }
        <View>
          <Text style={[s.buttonText, textStyle !== null ? textStyle : {}]}>{text}</Text>
        </View>
      </Displayers.Touchable>
    );
  };

  const clickButton = (method) =>
  {
    Keyboard.dismiss();
    method();
  };

  const Register = async () =>
  {
    try
    {
      Keyboard.dismiss();
      let checkInfoMessage = "";
      if (G.Functions.isValidMail(mail) === false) checkInfoMessage = "Email address invalid";
      else if (G.Functions.isValidUsername(username) === false) checkInfoMessage = "Your username must be\n" + G.Constants.usernameMinLength + " to " + G.Constants.usernameMaxLength + " characters long.";
      else if (password.length < G.Constants.passwordMinLength) checkInfoMessage = "Your password must be\n" + G.Constants.passwordMinLength + " to " + G.Constants.passwordMaxLength + " characters long.";
      else if (password.length > G.Constants.passwordMaxLength) checkInfoMessage = "Your password must be\n" + G.Constants.passwordMinLength + " to " + G.Constants.passwordMaxLength + " characters long.";
      else if (password !== confirmPassword) checkInfoMessage = "Your passwords do not match.";
      if (checkInfoMessage.length > 0)
        setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:checkInfoMessage });
      else
      {
        setLoading(true);
        context.register({ mail, username, password }, onSuccess, onError);
      }
    }
    catch (e)
    {
      console.warn(e);
      const errorRegister = "Registration failed : an error occured, please check or internet connection or try again later";
      setContext({ ...context, authenticationState:G.AuthenticationStates.CONNECTION_ERROR, authenticationMessage:errorRegister });
    }
  };

  const Back = () =>
  {
    context.navigate(navigation, "Login")
  }

  React.useEffect(() =>
  {
    setShowAuthenticationMessage(context.authenticationMessage !== "");
  }, [context.authenticationState, context.authenticationMessage]);
  const hideAuthenticationPopup = () =>
  {
    setContext({...context, authenticationState:G.AuthenticationStates.LOGGED_OUT, authenticationMessage:""});
  };
  const getAuthenticationPopup = () =>
  {
    return (
      <Popups.Popup
        noCloseButton={true}
        transparent={true}
        containerStyle={{ ...G.S.width(80) }}
        visible={true}
        hide={hideAuthenticationPopup}
      >
        <View style={am.container}>
          <View style={am.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name="account-key-outline"
              type="mci"
              size={30}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={am.message}>
            <Texts.Label>
              <Text style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {context.authenticationMessage}
              </Text>
            </Texts.Label>
          </View>
          <View style={am.buttonContainer}>
            <Displayers.Touchable onPress={hideAuthenticationPopup} style={am.button}>
              <Text style={am.buttonText}>Close</Text>
            </Displayers.Touchable>
          </View>
        </View>
      </Popups.Popup>
    );
  };

  let inputUsername = React.useRef(null);
  let inputPassword = React.useRef(null);
  let inputPasswordConfirm = React.useRef(null);
  return (
    <View style={s.content}>
      <Displayers.BackgroundImage style={s.back} source={G.Images.background} />
      <View style={s.logoContainer}>
        <Image source={G.Images.logoTitle} style={s.logo} />
      </View>
      <View style={s.buttons}>
        <View style={f.container}>
          <TextInput
            style={f.textInput}
            placeholder="Email"
            placeholderTextColor={G.Colors().Neutral(0.6)}
            value={mail}
            onChangeText={(val) => setMail(G.Functions.cleanMail(val))}
            keyboardType="email-address"
            maxLength={G.Constants.emailMaxLength}
            onSubmitEditing={() => {inputUsername.focus();}}
            blurOnSubmit={false}
          />
        </View>
        <View style={f.container}>
          <TextInput
            ref={i => inputUsername = i}
            style={f.textInput}
            placeholder="Username"
            placeholderTextColor={G.Colors().Neutral(0.6)}
            value={username}
            onChangeText={(val) => setUsername(G.Functions.cleanUsername(val))}
            maxLength={G.Constants.usernameMaxLength}
            onSubmitEditing={() => {inputPassword.focus();}}
            blurOnSubmit={false}
          />
        </View>
        <View style={f.container}>
          <TextInput
            ref={i => inputPassword = i}
            style={f.textInput}
            placeholder="Password"
            placeholderTextColor={G.Colors().Neutral(0.6)}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            maxLength={G.Constants.passwordMaxLength}
            onSubmitEditing={() => {inputPasswordConfirm.focus();}}
            blurOnSubmit={false}
          />
        </View>
        <View style={f.container}>
          <TextInput
            ref={i => inputPasswordConfirm = i}
            style={f.textInput}
            placeholder="Confirm password"
            placeholderTextColor={G.Colors().Neutral(0.6)}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            maxLength={G.Constants.passwordMaxLength}
            onSubmitEditing={() => {Keyboard.dismiss(); clickButton(Register);}}
            blurOnSubmit={false}
          />
        </View>
        <View style={[s.buttonContainer, s.button_Register]}>
          {getButton("CREATE ACCOUNT", () => clickButton(Register), null, s.register, s.registerText)}
        </View>
        <View style={s.buttonContainer}>
          {getButton("I HAVE AN ACCOUNT", Back, null, s.backButton, s.backButtonText)}
        </View>
      </View>
      {showAuthenticationMessage === true ? getAuthenticationPopup() : <View/>}
      <Displayers.LoaderVertical isVisible={loading} />
    </View>
  );
}

const s = StyleSheet.create(
{
  back:
  {
    ...G.S.full,
    opacity:0.1,
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Background(),
    justifyContent:'flex-start',
  },
  logoContainer:
  {
    ...G.S.center,
    ...G.S.width(70),
    aspectRatio:1,
    position:'absolute',
    top:0,
  },
  logo:
  {
    ...G.S.full,
    resizeMode: "contain",
  },
  buttons:
  {
    ...G.S.center,
    marginTop:G.Layout.window.width * 0.60,
    paddingHorizontal: 30,
  },
  fieldContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:10,
    borderBottomWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:10,
    marginBottom:1,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
  },
  buttonLogo:
  {
    ...G.S.center,
    ...G.S.height(),
    position:'absolute',
    left:0,
    overflow:'visible',
  },
  buttonImage:
  {
    ...G.S.center,
    ...G.S.full,
    aspectRatio:1,
  },
  buttonText:
  {
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Neutral(0.6),
  },
  register:
  {
    backgroundColor:G.Colors().Highlight(),
  },
  registerText:
  {
    color:G.Colors().Foreground(),
  },
  backButton:
  {
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
  },
  backButtonText:
  {
    color:G.Colors().Highlight(),
  },
});

const f = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:10,
    borderBottomWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
  textInput:
  {
    ...G.S.center,
    ...G.S.full,
    textAlign: "center",
    color:G.Colors().Neutral(),
  },
});

let am = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    padding:5,
    paddingBottom:10,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingTop:10,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:0,
    paddingTop:10,
  },
  message:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:15,
    paddingHorizontal:30,
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:10,
  },
  button:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:2,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  buttonText:
  {
    paddingVertical:10,
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Foreground(),
  },
});