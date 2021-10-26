import React from "react";
import { StyleSheet, View, ScrollView, Keyboard, Image, Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
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

export default function AddPicturePopup(props)
{
  const [context, setContext] = React.useContext(AppContext);

  const [pics, setPics] = React.useState(props.existingPics ? props.existingPics : []);
  const save = () =>
  {
    props.save(pics);
  };
  const deletePic = (pic) =>
  {
    const indexOfPic = pics.filter((t) => t.image === pic.image).length <= 0 ? -1 : pics.indexOf(pics.filter((t) => t.image === pic.image)[0]);
    if(indexOfPic !== -1)
    {
      let temp = [...pics];
      temp.splice(indexOfPic, 1);
      setPics([...temp]);
    }
  };
  
  React.useEffect(() =>
  {
    if(props.show === true)
    {
      setPics(props.existingPics ? props.existingPics : []);
      (async () =>
      {
        if (Platform.OS !== 'web')
        {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted')
          {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }
  }, [props.show]);
  
  const pickPic = async () =>
  {
    let result = await ImagePicker.launchImageLibraryAsync(
    {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [8, 5],
      quality: G.Constants.importImageQuality,
    });
    if (!result.cancelled)
    {
      setPics([...pics, {image:("data:image/jpg;base64," + result.base64)}]);
    }
  };

  const [listWidth, setListWidth] = React.useState(0);
  const displayAll = () =>
  {
    let elements = [];
    for(let i=0; i < pics.length; i+=2)
    {
      elements.push(displaySelection(i));
    }
    return elements;
  };
  const displaySelection = (index) =>
  {
    const pic1 = index < pics.length ? pics[index] : null;
    const pic2 = (index + 1) < pics.length ? pics[index+1] : null;
    return (
      <View key={index} style={s.line} onLayout={(event) => setListWidth(event.nativeEvent.layout.width)}>
        {displaySelectionItem(pic1)}
        {pic2 === null ? <View/> : displaySelectionItem(pic2, true)}
      </View>
    );
  };
  const displaySelectionItem = (p, noMargin = false) =>
  {
    return (
      <Displayers.Touchable onPress={() => deletePic(p)}>
        <View style={[s.toSelect, {width:(listWidth-10*2)/2}, noMargin === true ? {marginRight:0}: {},]}>
          <Image source={{uri: p.image}} style={{ ...G.S.full }}/>
        </View>
      </Displayers.Touchable>
    );
  };
  
  return (
    <Displayers.Touchable onPress={() => Keyboard.dismiss()}>
      <Popups.Popup
        noCloseButton={true}
        top={false}
        transparent={true}
        containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
        style={{ paddingBottom:20, }}
        visible={props.show}
      >
        <View style={s.container}>
          <View style={s.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name="camera-outline"
              type="mci"
              size={30}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.title}>
            <Texts.Label style={{ fontSize: 16, color:G.Colors().Highlight() }}>
              Add pictures you took of this place
            </Texts.Label>
          </View>
          <View style={s.buttonAdd}>
            <Buttons.Round
              shadow
              backgroundHighlight
              name="camera-plus-outline"
              type="mci"
              size={22}
              color={G.Colors().Background()}
              onPress={pickPic}
              contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={s.list}
            contentContainerStyle={{ ...G.S.center, paddingBottom:22, }}
          >
            {displayAll()}
          </ScrollView>
          <View style={s.footerContainer}>
            <View style={s.footer}>
              <View style={[s.buttonContainer, {marginRight:5}]}>
                <Buttons.Label
                  center
                  iconLeft
                  iconName="chevron-left"
                  type="mci"
                  alignWidth
                  contentForeground
                  backgroundBright
                  style={s.buttonLabel}
                  borderStyle={{borderWidth:1, borderColor:G.Colors().Highlight()}}
                  color={G.Colors().Highlight()}
                  size={20}
                  containerStyle={{...G.S.width()}}
                  contentStyle={{...G.S.width(), paddingLeft:20}}
                  iconStyle={{left:10}}
                  onPress={props.hide}
                >
                  Cancel
                </Buttons.Label>
              </View>
              <View style={[s.buttonContainer, {marginLeft:5}]}>
                <Buttons.Label
                  center
                  iconRight
                  alignWidth
                  contentForeground
                  backgroundHighlight
                  iconName="check"
                  type="mci"
                  style={s.buttonLabel}
                  size={20}
                  containerStyle={{...G.S.width()}}
                  contentStyle={{...G.S.width(), paddingRight:15, borderWidth:1, borderColor:G.Colors().Foreground()}}
                  iconStyle={{right:10}}
                  onPress={save}
                >
                  Save
                </Buttons.Label>
              </View>
            </View>
          </View>
        </View>
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
    paddingTop:30,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  buttonAdd:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    marginBottom:"5%",
  },
  list:
  {
    ...G.S.width(),
    flex:1,
    borderRadius: 20,
    backgroundColor: G.Colors().Foreground(),
    paddingHorizontal:"5%",
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:'row',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    marginBottom: 10,
  },
  toSelect:
  {
    ...G.S.center,
    aspectRatio: 1.6,
    backgroundColor: G.Colors().Foreground(),
    borderRadius:5,
    marginRight:20,
    marginTop:10,
  },
  footerContainer:
  {
    ...G.S.center,
    ...G.S.width(80),
    aspectRatio:7,
    marginTop:20,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:"row",
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex: 1,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
  },
});
