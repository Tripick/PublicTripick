import React from "react";
import {StyleSheet, View} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";
import * as Pickers from "../../Libs/Pickers";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import Place from "../Pick/Place";
import Review from "../Pick/Review";

export default function ModifyPlace({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = () => context.navigate(navigation, backPage);

  const init = () =>
  {
    let placeReviews = [];
    if(context.currentPlace !== null && typeof(context.currentPlace) !== 'undefined')
    {
      placeReviews = context.currentPlace.reviews.filter(r => r.idAuthor === context.userContext.user.id);
      // if(placeReviews.length === 0)
      // {
      //   let allFlags = [];
      //   for(let review of context.currentPlace.reviews)
      //   {
      //     for(let flag of review.flags)
      //     {
      //       allFlags.push(flag);
      //     }
      //   }
      //   let currentFlags = [];
      //   for(let flag of allFlags)
      //   {
      //     let existings = currentFlags.filter(f => f.config.id === flag.config.id);
      //     if(existings.length > 0)
      //       existings[0].values.push(parseFloat(flag.value));
      //     else
      //     {
      //       flag.values = [parseFloat(flag.value)];
      //       currentFlags.push(flag);
      //     }
      //   }
      //   for(let flag of currentFlags)
      //   {
      //     let val = G.Functions.avg(flag.values);
      //     if(flag.config.valType !== "Double")
      //     {
      //       let diff = val - Math.trunc(val);
      //       flag.value = "" + (Math.trunc(val) + (diff >= 0.5 ? 1 : 0));
      //     }
      //     else
      //     {
      //       flag.value = "" + (Math.trunc(val * 100) / 100);
      //     }
      //   }
      //   let avgRating = Math.trunc(G.Functions.avg(context.currentPlace.reviews.map(r => r.rating)) * 10) / 10;
      //   placeReviews.push({ idAuthor:context.userContext.user.id, rating:avgRating, message:"", flags:currentFlags, pictures:[] });
      // }
    }
    if(placeReviews.length === 0)
      placeReviews.push({ idAuthor:context.userContext.user.id, rating:-1, message:"", flags:[], pictures:[] });
    
    return context.currentPlace !== null && typeof(context.currentPlace) !== 'undefined' ?
      { ...context.currentPlace, flags:[], reviews:[...placeReviews] }
      :
      {
        name: "",
        latitude: G.Constants.defaultMapPoint.latitude,
        longitude: G.Constants.defaultMapPoint.longitude,
        flags:[],
        reviews:placeReviews
      };
  };
  const [place, setPlace] = React.useState(init());
  const [showPopup, setShowPopup] = React.useState(true);

  const [showPointPicker, setShowPointPicker] = React.useState(false);
  const [showPickerCountry, setShowPickerCountry] = React.useState(false);
  const onPoint = (latitude, longitude, latitudeDelta, longitudeDelta) =>
  {
    setPlace({...place, latitude: latitude, longitude: longitude});
    setShowPointPicker(false);
    setShowPickerCountry(true);
  };
  const onSelectCountry = (country) =>
  {
    setPlace({...place, countryId:country.id, country:country.name});
    setShowPickerCountry(false);
  };
  const onSelectCountryCancel = () =>
  {
    setShowPickerCountry(false);
    setShowPointPicker(true);
  };
  
  // Message popup
  const [messagePopup, setMessagePopup] = React.useState("");
  const [showMessagePopup, setShowMessagePopup] = React.useState(false);
  const [messagePopupDuration, setMessagePopupDuration] = React.useState(1500);
  const displayMessage = (icon, message, duration = 1500, callback = () => {}) =>
  {
    setContext({...context, userContext:{...context.userContext, displayMessageCallback: callback}});
    setMessagePopup(message);
    setMessagePopupDuration(duration);
    setShowMessagePopup(true);
  }
  
  // Apply locally
  const applyChanges = (name, latitude, longitude, rating, message, flags, pictures) =>
  {
    setPlace(
    {
      ...place,
      name:name,
      nameTranslated:name,
      description:message,
      rating:rating,
      latitude:latitude,
      longitude:longitude,
      flags:[...flags],
      reviews:[
      {
        ...place.reviews[0],
        rating: rating,
        message: message,
        flags: [...flags],
        pictures: [...pictures]
      }]
    });
    setShowPopup(false);
  };

  // Save on server
  const save = () =>
  {
    let newPlace =
    {
      Id:place.id ? place.id : -1,
      Name:place.name,
      CountryId:place.countryId,
      Country:place.country,
      Description:place.description,
      Latitude:place.latitude,
      Longitude:place.longitude,
    };

    let reviewsDTO = [];
    place.reviews.forEach(r =>
    {
      let flagsDTO = [];
      r.flags.forEach(f =>
      {
        flagsDTO.push({Value:f.value, IdConfig:f.config.id});
      });
      let picsDTO = [];
      r.pictures.forEach(pic =>
      {
        picsDTO.push({Image:pic.image});
      });
      reviewsDTO.push(
      {
        Id:r.id ? r.id : -1,
        Rating: r.rating,
        Message: r.message,
        Flags: [...flagsDTO],
        Pictures: [...picsDTO]
      });
    });
    newPlace.Reviews = reviewsDTO;
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"place_save",
      isRetribution:false,
      data:{ newPlace:newPlace },
      callback:saveOnSuccess
    }]});
  };
  const saveOnSuccess = (response) =>
  {
    console.log("Place saved successfully!");
    goBack();
  }

  const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);
  const getExitConfirmation = () =>
  {
    return (
      <Popups.Popup
        noCloseButton={true}
        transparent={true}
        containerStyle={{ ...G.S.width(80) }}
        visible={showExitConfirmation}
        hide={() => setShowExitConfirmation(false)}
      >
        <View style={s.container}>
          <View style={s.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name={"trash-can-outline"}
              type="mci"
              size={35}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.title}>
            <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              {"Are you sure?\nYou will lose all your modifications"}
            </Texts.Label>
          </View>
          <View style={s.listContainer}>
            <View style={sButton.container}>
              <Displayers.Touchable onPress={goBack}>
                <View style={[sButton.content, { borderColor:G.Colors().Foreground(), backgroundColor:G.Colors().Fatal }]}>
                  <View style={sButton.label}>
                    <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                      Discard
                    </Texts.Label>
                  </View>
                </View>
              </Displayers.Touchable>
            </View>
            <View style={sButton.container}>
              <Displayers.Touchable onPress={() => setShowExitConfirmation(false)}>
                <View style={sButton.content}>
                  <View style={sButton.label}>
                    <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Highlight() }}>
                      Cancel
                    </Texts.Label>
                  </View>
                </View>
              </Displayers.Touchable>
            </View>
          </View>
        </View>
        <Popups.PopupTemporary time={messagePopupDuration} visible={showMessagePopup} hide={() => setShowMessagePopup(false)} message={messagePopup} />
      </Popups.Popup>
    );
  }

  return (
    <Wrappers.AppFrame>
      <Place
        mode="ModifyPlace"
        index={0}
        currentIndex={0}
        active={true}
        trip={null}
        showFilters={() => {}}
        place={place}
        goBack={() => setShowPopup(true)}
        save={save}
      />
      <Review
        mode="Place"
        show={showPopup}
        hide={() => setShowExitConfirmation(true)}
        save={applyChanges}
        place={place}
        name={place.name}
        country={place.country}
        rating={place.reviews[0].rating}
        message={place.description}
        flags={place.reviews[0].flags}
        pictures={place.reviews[0].pictures}
        showPointPicker={showPointPicker}
        setShowPointPicker={setShowPointPicker}
        onPoint={onPoint}
      />
      <Pickers.Country
        show={showPickerCountry}
        hide={() => setShowPickerCountry(false)}
        onSelect={onSelectCountry}
        onCancel={onSelectCountryCancel}
        latitude={place ? place.latitude : null}
        longitude={place ? place.longitude : null}
        displayMessage={displayMessage}
      />
      {getExitConfirmation()}
      <Popups.PopupTemporary visible={showMessagePopup} hide={() => setShowMessagePopup(false)} time={messagePopupDuration} message={messagePopup} context={context.userContext} />
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
    alignContent:'flex-start',
    padding:4,
    paddingTop:"5%",
    paddingBottom:6,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    marginVertical:10,
    aspectRatio:6,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginTop:"-5%",
    aspectRatio:6,
  },
  filter:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:8,
  },
  filterInput:
  {
    ...G.S.full,
    textAlign: "left",
    textAlignVertical: "center",
    paddingHorizontal:10,
    color: G.Colors().Neutral(0.7),
    fontSize: 12,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Neutral(0.3),
    backgroundColor:G.Colors().Background(0.5),
  },
  listContainer:
  {
    ...G.S.center,
    minHeight:100,
    maxHeight:"80%", 
    ...G.S.width(),
  },
  list:
  {
    ...G.S.width(),
    paddingHorizontal: 20,
  },
});

let sButton = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
    marginTop:5,
    paddingHorizontal:20,
    paddingLeft:15,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(),
    overflow:'visible'
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom: 2,
  },
});