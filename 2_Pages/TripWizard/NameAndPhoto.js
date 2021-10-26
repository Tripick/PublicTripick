import React from "react";
import { StyleSheet, View, Text, TextInput, Keyboard } from "react-native";
import * as ImagePicker from 'expo-image-picker';
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";
// Components
import ImageTrip from "../Trip/Tiles/ImageTrip";

export default function NameAndPhoto(props)
{
  const [inputVal, setInputVal] = React.useState(props.trip?.name);
  const [photo, setPhoto] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");

  const getButton = (text, onPress, isAlt, isDeactivated) =>
  {
    return (
      <Displayers.Touchable onPress={onPress} style={[
          s.button,
          isAlt === true ?
            {backgroundColor:G.Colors().Foreground(), borderWidth:1, borderColor:G.Colors().Highlight()} :
            {backgroundColor:G.Colors().Highlight()},
          isDeactivated === true ?
            {backgroundColor:G.Colors().Foreground(), borderWidth:1, borderColor:G.Colors().Neutral(0.6)} :
            {},
        ]}>
        <Text style={[
          s.buttonText,
          isAlt === true ? {color:G.Colors().Highlight()} : {color:G.Colors().Foreground()},
          isDeactivated === true ? {color:G.Colors().Neutral(0.6)} : {},
        ]}>{text}</Text>
      </Displayers.Touchable>
    );
  };

  const getPhoto = () =>
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
            setPhoto("data:image/jpg;base64," + result.base64);
        }
      }
    })();
  };

  const saveAndNext = () =>
  {
    if(typeof inputVal === 'undefined' || inputVal === null || inputVal.length < G.Constants.tripNameMinLength)
      setErrorMessage("The name of your trip must be at least " + G.Constants.tripNameMinLength + " characters long.");
    else if(inputVal.length > G.Constants.tripNameMaxLength)
      setErrorMessage("The name of your trip must not be longer than " + G.Constants.tripNameMinLength + " characters.");
    else if(photo === null)
      setErrorMessage("Select a photo");
    else props.createTrip(inputVal, photo);
  };

  return (
    <View style={s.container}>
      <View style={s.content}>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 16, color:G.Colors().Neutral(0.6)}]}>{"You are about to create a new trip.\nGive it a name and a cover image below!\n\n\n"}</Text>
        </Texts.Label>
        <View style={s.inputContainer}>
          <View style={s.inputContent}>
            <TextInput
              style={s.textInput}
              placeholder="Name your trip here..."
              value={inputVal}
              onChangeText={(val) => setInputVal(G.Functions.cleanText(val))}
              maxLength={G.Constants.tripNameMaxLength}
              onSubmitEditing={() => {Keyboard.dismiss();}}
              blurOnSubmit={false}
              placeholderTextColor={G.Colors().Neutral(0.2)}
            />
          </View>
        </View>
        <View style={s.photoPreview}>
          {photo !== null ?
            <ImageTrip trip={{coverImage:photo}} />
            :
            <View/>
          }
          <View style={s.buttonContainer}>
            {photo !== null ?
              <View/>
              :
              getButton(photo === null ? "Select a cover photo here..." : "Change cover photo", getPhoto, false)
            }
          </View>
          <Displayers.TouchableOverlay onPress={getPhoto} />
        </View>
        <Texts.Label style={s.message}>
          <Text style={[s.normalText, {fontSize: 12, color:G.Colors().Fatal}]}>{"\n" + errorMessage}</Text>
        </Texts.Label>
      </View>
      <View style={s.actionContainer}>
        <View style={s.buttonContainer}>
          {getButton("Create my new trip", saveAndNext, false, false)}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },

  content:
  {
    ...G.S.center,
    ...G.S.width(85),
    flex:1,
  },
  messageContainer:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  inputContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
  },
  inputContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    borderRadius:100,
    backgroundColor:G.Colors().Background(0.6),
  },
  actionContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:20,
  },

  message:
  {
    ...G.S.width(),
  },
  normalText:
  {
    ...G.S.width(),
    fontSize: 16,
    color:G.Colors().Neutral(0.6),
  },
  highlightedText:
  {
    fontSize: 20,
    color:G.Colors().Highlight(),
  },
  photoPreview:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:2,
    borderRadius:10,
    marginTop:10,
    backgroundColor:G.Colors().Foreground(),
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:7,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
    paddingBottom:2,
  },
  buttonText:
  {
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Neutral(0.6),
  },
  textInput:
  {
    ...G.S.center,
    ...G.S.full,
    textAlign: "center",
    color:G.Colors().Neutral(),
    paddingHorizontal:5,
  },
});
