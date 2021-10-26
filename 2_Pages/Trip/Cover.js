import React from "react";
import { StyleSheet, View, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default function Cover(props)
{
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
            props.save("data:image/jpg;base64," + result.base64)
        }
      }
    })();
  };

  return (
    <View style={s.container}>
      <View style={s.content}>
        <Image
          source={{uri:
            typeof props.trip !== "undefined" &&
            props.trip !== null &&
            props.trip.coverImage !== null &&
            props.trip.coverImage !== ""
              ? props.trip.coverImage : "_",
          }}
          style={{ ...G.S.center, ...G.S.full }}
        />
      </View>
      <Displayers.TouchableOverlay onPress={changePhoto} />
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    justifyContent: "flex-start",
    alignContent: "flex-start"
  },
});
  