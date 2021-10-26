import React from "react";
import { StyleSheet, View, TextInput, Keyboard, ScrollView, Image } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";
// Components
import LocationPicker from "../Trip/Tiles/LocationPicker";
import AddFlagPopup from "./AddFlagPopup";
import AddPicturePopup from "./AddPicturePopup";

export default function Review(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [title, setTitle] = React.useState(props.name ? props.name : "");
  const [rating, setRating] = React.useState(props.rating ? props.rating : -1);
  const [message, setMessage] = React.useState(props.message ? props.message : "");
  const [flags, setFlags] = React.useState(props.flags ? props.flags : []);
  const [pictures, setPictures] = React.useState(props.pictures ? props.pictures : []);

  const onRate = (val) => { setRating(val); };
  React.useEffect(() =>
  {
    setTitle(props.name ? props.name : "");
    setRating(props.rating ? props.rating : -1);
    setMessage(props.message ? props.message : "");
    setFlags(props.flags ? props.flags : []);
    setPictures(props.pictures ? props.pictures : []);
  }, [props.rating, props.message, props.flags, props.pictures]);

  // PICTURES
  const [showAddPicturePopup, setShowAddPicturePopup] = React.useState(false);
  const getPic = (pic, index) =>
  {
    return (
      <Displayers.Touchable noFade onPress={() => setShowAddPicturePopup(true)} key={index}>
        <View style={p.container}>
          <View style={p.toSelect}>
            <View style={p.toSelectInside}>
              <Image source={{uri: pic.image}} style={{ ...G.S.full }}/>
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };
  const savePics = (newPics) =>
  {
    setPictures(newPics);
    setShowAddPicturePopup(false);
  };

  // FLAGS
  const [showAddFlagPopup, setShowAddFlagPopup] = React.useState(false);
  const [selectedFlag, setSelectedFlag] = React.useState(null);
  const saveFlag = (flag) =>
  {
    if(selectedFlag !== null)
    {
      setSelectedFlag(null);
      setShowAddFlagPopup(false);
    }
    const indexOfFlag = flags.filter((t) => t.config.id === flag.config.id).length <= 0 ? -1 :
      flags.indexOf(flags.filter((t) => t.config.id === flag.config.id)[0]);
    if(indexOfFlag === -1) setFlags([...flags, flag]);
    else flags[indexOfFlag].value = flag.value;
  };
  const deleteFlag = (flag) =>
  {
    if(selectedFlag !== null)
    {
      setSelectedFlag(null);
      setShowAddFlagPopup(false);
    }
    const indexOfFlag = flags.filter((t) => t.config.id === flag.config.id).length <= 0 ? -1 :
      flags.indexOf(flags.filter((t) => t.config.id === flag.config.id)[0]);
    if(indexOfFlag !== -1)
    {
      let flagsTemp = [...flags];
      flagsTemp.splice(indexOfFlag, 1);
      setFlags([...flagsTemp]);
    }
  };
  const getFlag = (flag, index) =>
  {
    return (
      <Displayers.Touchable noFade onPress={() => selectFlag(flag)} key={index}>
        <View style={f.container}>
          <View style={f.toSelect}>
            <View style={f.toSelectIcon}>
              <Displayers.Icon
                name={flag.config.icon}
                type="mci"
                size={25}
                color={G.Colors().Foreground()}
              />
            </View>
            <View style={f.toSelectTitle}>
              <Texts.Label style={{fontSize:10, color:G.Colors().Foreground()}}>{G.Functions.displayFlag(flag)}</Texts.Label>
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };
  const selectFlag = (flag) =>
  {
    setSelectedFlag(flag);
    setShowAddFlagPopup(true);
  };

  const getValidateButton = () =>
  {
    let checkBeforeValidate = "";
    if(props.mode === "Place")
    {
      if(title.length < G.Constants.placeNameMinLength)
        checkBeforeValidate = "Name this place (" + G.Constants.placeNameMinLength + " characters minimum)";
    }
    if(props.mode === "Place" && checkBeforeValidate === "")
    {
      if(pictures.length === 0) checkBeforeValidate = "Add at least one picture";
    }
    if(checkBeforeValidate === "")
    {
      if(rating > 5 || rating < 0) checkBeforeValidate = "Rate this place";
    }
    if(checkBeforeValidate === "")
    {
      if(message.length < G.Constants.placeDescriptionAndReviewMinLength)
        checkBeforeValidate = "Write a message (" + G.Constants.placeDescriptionAndReviewMinLength + " characters minimum)";
    }
    if(props.mode === "Place" && checkBeforeValidate === "")
    {
      if(flags.length === 0) checkBeforeValidate = "Add at least one information flag";
    }

    return (
      checkBeforeValidate === "" ?
      (
        props.mode === "Place" ?
          <Buttons.Label
            alignWidth
            shadow
            backgroundHighlight
            size={25}
            color={G.Colors().Background()}
            onPress={() =>
            {
              props.save(
                G.Functions.cleanText(title),
                props.place.latitude,
                props.place.longitude,
                rating,
                G.Functions.cleanText(message),
                flags,
                pictures)}
            }
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),paddingHorizontal:20}}
          >
            See preview
          </Buttons.Label>
          :
          <Buttons.Round
            shadow
            backgroundHighlight
            name="check"
            type="mci"
            size={25}
            color={G.Colors().Background()}
            onPress={() => props.save(rating, G.Functions.cleanText(message), flags, pictures)}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
      )
      :
      <Texts.Label style={{color:G.Colors().Fatal}}>{checkBeforeValidate}</Texts.Label>
    );
  };

  const getTitle = () =>
  {
    return (props.mode === "Place" ?
      <View style={s.inputTitle}>
        <TextInput
          style={[s.inputField, {fontSize:16}]}
          onChangeText={(mess) => setTitle(G.Functions.cleanText(mess))}
          value={title}
          placeholder="Name..."
          maxLength={G.Constants.placeNameMaxLength}
          keyboardType="default"
          returnKeyType="done"
          multiline={false}
          blurOnSubmit={true}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
      :
      <View/>
    );
  };
  const getRating = () =>
  {
    return (
      <View style={s.ratingAndDate}>
        <View style={s.rating}>
          {Platform.OS == "android" ?
            <Displayers.Rating noValue iconSize={30} value={rating} onPress={onRate} />
            :
            <Displayers.RatingIos noValue iconSize={30} value={rating} onPress={onRate} />
          }
        </View>
      </View>
    );
  };
  const getMap = () =>
  {
    return (props.mode === "Place" ?
      <View style={s.map}>
        <LocationPicker
          helpMessage={"Move the map to place the marker"}
          showPointPicker={props.showPointPicker}
          setShowPointPicker={props.setShowPointPicker}
          onPoint={props.onPoint}
          latitude={props.place.latitude}
          longitude={props.place.longitude}
          latitudeDelta={G.Constants.defaultMapPoint.latitudeDelta}
          longitudeDelta={G.Constants.defaultMapPoint.longitudeDelta}
          drawPolygon={false}
        />
        {typeof(props.country) !== 'undefined' && props.country !== null && props.country !== "" ?
          <View style={s.countryNameContainer}>
            <Texts.Label style={s.countryName}>{props.country}</Texts.Label>
            <Displayers.TouchableOverlay onPress={() => props.setShowPointPicker(true)} />
          </View>
          :
          <View/>
        }
      </View>
      :
      <View/>
    );
  };
  const getPictures = () =>
  {
    return (
      <View style={s.pictures}>
        <View style={s.picturesAddButton}>
          <Buttons.Round
            alignWidth
            dark
            backgroundBright
            shadow
            name="camera-plus-outline"
            type="mci"
            size={25}
            color={G.Colors().Highlight()}
            onPress={() => setShowAddPicturePopup(true)}
          />
        </View>
        <View style={s.picturesList}>
          {pictures === null || pictures.length <= 0 ?
            <View style={s.placeHolder}>
              <Texts.Label style={s.placeHolderText}>Add pictures here...</Texts.Label>
            </View>
            :
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={s.list}
              contentContainerStyle={{flexGrow: 1, paddingLeft:G.Layout.window.width / 5}}
            >
              {pictures?.map((pic, index) => getPic(pic, index))}
            </ScrollView>
          }
        </View>
      </View>
    );
  };
  const getFlags = () =>
  {
    return (
      <View style={s.flags}>
        <View style={s.flagsAddButton}>
          <Buttons.Round
            alignWidth
            dark
            backgroundBright
            shadow
            name="bookmark-plus-outline"
            type="mci"
            size={25}
            color={G.Colors().Highlight()}
            onPress={() => setShowAddFlagPopup(true)}
          />
        </View>
        <View style={s.flagsList}>
          {flags === null || flags.length <= 0 ?
            <View style={s.placeHolder}>
              <Texts.Label style={s.placeHolderText}>Add information flags here...</Texts.Label>
            </View>
            :
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={s.list}
              contentContainerStyle={{flexGrow: 1, paddingLeft:G.Layout.window.width / 5}}
            >
              {flags?.map((flag, index) => getFlag(flag, index))}
            </ScrollView>
          }
        </View>
      </View>
    );
  };
  const getMessage = () =>
  {
    return (
      <View style={[s.input, props.mode === "Place" ? {aspectRatio:2.3} : {}]}>
        <TextInput
          style={s.inputField}
          onChangeText={(mess) => setMessage(G.Functions.cleanText(mess))}
          value={message}
          placeholder={"Describe this place\nor your experience there..."}
          maxLength={G.Constants.placeDescriptionAndReviewMaxLength}
          keyboardType="default"
          returnKeyType="done"
          multiline={true}
          blurOnSubmit={true}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
    );
  };

  return (
    <Displayers.Touchable onPress={() => Keyboard.dismiss()}>
      <Popups.Popup
        backButton={true}
        styleButtonBack={{top:5}}
        transparent={true}
        containerStyle={{ ...G.S.full }}
        style={{ paddingBottom:20, }}
        visible={props.show}
        hide={props.hide}
      >
        <View style={s.container}>
          <View style={s.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name={props.mode === "Place" ? (typeof(props.place.id) === 'undefined' ? "map-marker-plus-outline" : "map-marker-outline") : "comment-text-outline"}
              type="mci"
              size={35}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.title}>
            <Texts.Label style={{ fontSize: 16, color:G.Colors().Highlight() }}>
              {props.mode === 'Place' ? (typeof(props.place.id) === 'undefined' ? "Add a new place" : "Modify a place") : "Share your experience"}
            </Texts.Label>
          </View>
          {getTitle()}
          {getMap()}
          {getPictures()}
          {getRating()}
          {getMessage()}
          {getFlags()}
          <View style={s.button}>
            {getValidateButton()}
          </View>
        </View>
        <AddPicturePopup
          show={showAddPicturePopup}
          existingPics={pictures}
          save={savePics}
          hide={() => setShowAddPicturePopup(false)}
        />
        <AddFlagPopup
          show={showAddFlagPopup}
          hide={() => setShowAddFlagPopup(false)}
          existingFlags={flags}
          selectedFlag={selectedFlag}
          save={saveFlag}
          delete={deleteFlag}
        />
      </Popups.Popup>
    </Displayers.Touchable>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    marginVertical:10,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginTop:"-5%",
  },
  ratingAndDate:
  {
    ...G.S.center,
    ...G.S.width(90),
  },
  rating:
  {
    ...G.S.center,
  },
  map:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:2.3,
  },
  countryNameContainer:
  {
    ...G.S.center,
    position:'absolute',
    top:10,
    borderRadius:5,
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.3),
    backgroundColor:G.Colors().Foreground(),
  },
  countryName:
  {
    ...G.S.full,
    padding:5,
    paddingHorizontal:25,
    textAlign: "center",
    color: G.Colors().Neutral(0.6),
    fontSize: 12,
  },
  input:
  {
    ...G.S.center,
    ...G.S.width(90),
    ...G.S.shadow(2),
    aspectRatio:1.8,
    borderRadius:20,
    //borderWidth:1,
    borderColor:G.Colors().Neutral(0.05),
    backgroundColor:G.Colors().Foreground(),
  },
  inputTitle:
  {
    ...G.S.center,
    ...G.S.width(90),
    ...G.S.shadow(2),
    aspectRatio:8,
    borderRadius:20,
    //borderWidth:1,
    borderColor:G.Colors().Neutral(0.05),
    backgroundColor:G.Colors().Foreground(),
  },
  inputField:
  {
    ...G.S.full,
    padding: 5,
    textAlign: "center",
    color: G.Colors().Neutral(),
    fontSize: 12,
  },

  pictures:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    flexDirection:'row',
  },
  picturesAddButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    left:"2%",
    zIndex:10,
  },
  picturesList:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    flexDirection:'row',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    zIndex:1,
  },

  flags:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    flexDirection:'row',
  },
  flagsAddButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    left:"2%",
    zIndex:10,
  },
  flagsList:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    flexDirection:'row',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    zIndex:1,
  },

  placeHolder:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  placeHolderText:
  {
    ...G.S.width(),
    paddingLeft:5,
    color:G.Colors().Neutral(0.6),
  },

  button:
  {
    ...G.S.center,
    height:60,
    ...G.S.width(),
  },
});

let p = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.height(),
    paddingVertical:5,
    paddingHorizontal:3,
  },
  toSelect:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.height(),
    aspectRatio: 1.6,
    borderRadius:15,
  },
  toSelectInside:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:8,
  },
  toSelectIcon:
  {
    ...G.S.center,
    ...G.S.height(60),
    aspectRatio:1,
  },
  toSelectTitle:
  {
    ...G.S.center,
    ...G.S.height(40),
    ...G.S.width(),
    marginTop:-7,
  },
});

let f = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.height(),
    padding:5,
  },
  toSelect:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.height(),
    aspectRatio: 1,
    backgroundColor: G.Colors().Highlight(),
    borderRadius:15,
  },
  toSelectIcon:
  {
    ...G.S.center,
    ...G.S.height(60),
    aspectRatio:1,
  },
  toSelectTitle:
  {
    ...G.S.center,
    ...G.S.height(40),
    ...G.S.width(),
    marginTop:-7,
  },
});
