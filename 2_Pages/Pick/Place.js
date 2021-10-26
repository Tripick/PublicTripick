import React from "react";
import {StyleSheet, View, ScrollView, Linking} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
// Components
import Flags from "./Flags";
import Location from "./Location";
import Description from "./Description";
import Comments from "./Comments";
import AddComment from "./AddComment";

export default function Place(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [messagePopup, setMessagePopup] = React.useState("");
  const [showMessagePopup, setShowMessagePopup] = React.useState(false);
  const [messagePopupDuration, setMessagePopupDuration] = React.useState(1500);
  const displayMessage = (message, duration = 1500) =>
  {
    setMessagePopup(message);
    setMessagePopupDuration(duration);
    setShowMessagePopup(true);
  }
  
  // Comment
  const [showCommentPopup, setShowCommentPopup] = React.useState(false);
  const saveComment = (rating, message, flags, pictures) =>
  {
    setShowCommentPopup(false);
    let flagsDTO = [];
    flags.forEach(f =>
    {
      flagsDTO.push({Value:f.value, IdConfig:f.config.id});
    });
    let picsDTO = [];
    pictures.forEach(pic =>
    {
      picsDTO.push(pic.image);
    });
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"place_review",
      isRetribution:false,
      data:{ idPlace: props.place?.id, rating: rating, message: message, flags:flagsDTO, pictures:picsDTO },
      callback:saveCommentOnSuccess
    }]});
  };
  const saveCommentOnSuccess = (newReviews) =>
  {
    console.log("Save comment success!");
    if(props.place !== null)
      props.place.reviews = newReviews;
    displayMessage("Thank you for your review", 2000);
  };

  const linkingTo = (uri) => { Linking.openURL(uri); };
  
  const [images, setImages] = React.useState([]);
  const [sliderMode, setSliderMode] = React.useState("hidden");
  React.useEffect(() =>
  {
    let imgs = [];
    props.place?.reviews?.map(r =>
    {
      if(r.pictures !== null && r.pictures.length > 0)
        r.pictures.map(i => imgs.push(i));
    });
    setSliderMode("images");
    if(props.mode !== "ModifyPlace" && props.place?.images !== null && props.place?.images?.length > 0)
    {
      setSliderMode("web");
      imgs = [...imgs, ...props.place?.images];
    }
    setImages(imgs);
  }, [props.place]);

  const imageSlider = () =>
  {
    return(
      <View style={s.imageSliderContainer}>
        <View style={s.imageSliderContent}>
          {images.length > 0 ?
            <Displayers.WebImageSlider images={images} disable={false} />
            :
            <View/>
          }
        </View>
      </View>
    );
  };

  
  return (
    <View style={{ flex: 1, backgroundColor:G.Colors().Foreground() }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.scrollView}
      >
        {imageSlider()}
        <Flags place={props.place} />
        <Location trip={props.trip} place={props.place} showLegend={true} showMarker={props.active === true || props.mode !== "Pick"} moreByName={() => linkingTo(G.Constants.googlePlacesQuery + '"' + props.place?.name + '"')} moreByPosition={() => linkingTo(G.Constants.googlePlacesQuery + G.Functions.cleanCoordinate(props.place?.latitude) + "," + G.Functions.cleanCoordinate(props.place?.longitude))} />
        <Description place={props.place} expandable="true" />
        {props.mode === "ModifyPlace" || props.mode === "Pick" ? <View/> : <AddComment user={context.userContext.user} reviews={props.place?.reviews} showPopup={showCommentPopup} setShowPopup={setShowCommentPopup} saveComment={saveComment} />}
        {props.mode === "ModifyPlace" ? <View/> : <Comments user={context.userContext.user} reviews={props.place?.reviews} />}
        <View style={{...G.S.center, ...G.S.width(), height:(40 + G.Layout.window.width / 6),}}/>
      </ScrollView>
      <Popups.PopupTemporary time={messagePopupDuration} visible={showMessagePopup} hide={() => setShowMessagePopup(false)} message={messagePopup} />
    </View>
  );
}

let s = StyleSheet.create(
{
  scrollView:
  {
    paddingBottom:5,
  },
  imageSliderContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    padding: 4,
    zIndex:2,
  },
  imageSliderContent:
  {
    ...G.S.width(),
    aspectRatio:1.6,
    backgroundColor:G.Colors().Foreground(),
    overflow:'visible',
    zIndex:3,
  },
  imageSlider:
  {
    ...G.S.full,
    borderRadius: 28,
  },
  frame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  legendContainer:
  {
    ...G.S.width(),
    ...G.S.shadow(2),
    aspectRatio:6,
    paddingTop:30,
    marginTop:-30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor:G.Colors().Foreground(),
    overflow:'hidden',
    zIndex:2,
  },
  googleProperty:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:'row',
  },
  googleLogoContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:2,
  },
  googleLogo:
  {
    ...G.S.height(80),
    ...G.S.width(80),
  },
  disclaimer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-start'
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:8
  },
});