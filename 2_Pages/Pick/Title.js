import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Linking, ActivityIndicator } from "react-native";
import Clipboard from "expo-clipboard";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";

export default function Title(props)
{
  const [showPopupCopied, setShowPopupCopied] = React.useState(false);
  const copyToClipboard = () =>
  {
    Clipboard.setString(props.place?.nameTranslated ? props.place?.nameTranslated : props.place?.name);
    setShowPopupCopied(true);
  };
  const linkToGoogle = () =>
  {
    Linking.openURL(G.Constants.googlePlacesQuery + props.place?.name);
  };

  const onBack = () =>
  {
    if(props.loading === true)
      props.stopLoading();
    else
      props.mode === "ModifyPlace" ? props.save() : props.goBack();
  };

  const onMore = () =>
  {
    if(props.loading === true)
      props.stopLoading();
    else
      props.mode === "ModifyPlace" ? props.goBack() : props.showMenuPopup();
  };
  
  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.aligner}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name={props.mode === "ModifyPlace" ? "check" : "chevron-left"}
            type="mci"
            size={25}
            color={G.Colors().Foreground()}
            onPress={onBack}
          />
        </View>
        <View style={s.middle}>
          <View style={s.title}>
            <TouchableWithoutFeedback onPress={linkToGoogle}>
              <Texts.Title style={{color:G.Colors().Foreground(), fontSize: 16 }} numberOfLines={2}>
                {props.place?.nameTranslated ? props.place?.nameTranslated : props.place?.name}
              </Texts.Title>
            </TouchableWithoutFeedback>
          </View>
          <View style={s.rating}>
            {Platform.OS == "android" ?
              <Displayers.Rating
                iconSize={20}
                color={G.Colors().Foreground()}
                votes={props.currentRating >= 0 ? -1 : props.place?.nbRating}
                value={props.currentRating >= 0 ? props.currentRating : props.place.rating}
                activeImage={props.currentRating >= 0 ? G.Images.picksIconMini :  G.Images.star}
                inactiveImage={props.currentRating >= 0 ? G.Images.picksIconDisabledMini :  G.Images.starDisabled}
              />
              :
              <Displayers.RatingIos
                iconSize={20}
                color={G.Colors().Foreground()}
                votes={props.currentRating >= 0 ? -1 : props.place?.nbRating}
                value={props.currentRating >= 0 ? props.currentRating : props.place.rating}
                activeImage={props.currentRating >= 0 ? G.Images.picksIconMini :  G.Images.star}
                inactiveImage={props.currentRating >= 0 ? G.Images.picksIconDisabledMini :  G.Images.starDisabled}
              />
            }
          </View>
        </View>
        <View style={s.aligner}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name={props.mode === "ModifyPlace" ? "pencil-outline" : "dots-vertical"}
            type="mci"
            size={25}
            color={G.Colors().Foreground()}
            onPress={onMore}
          />
        </View>
        <Popups.PopupTemporary
          time={1500}
          visible={showPopupCopied}
          hide={() => setShowPopupCopied(false)}
          message="Copied to clipboard!"
        />
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    overflow: "hidden",
  },
  content:
  {
    ...G.S.width(),
    ...G.S.center,
    flexDirection: "row",
  },
  aligner:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
  },
  middle:
  {
    ...G.S.center,
    flex: 4,
  },
  title:
  {
    ...G.S.center,
    justifyContent: "flex-end",
    paddingTop:10,
  },
  rating:
  {
    ...G.S.center,
    marginBottom:10,
  },
});
