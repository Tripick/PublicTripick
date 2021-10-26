import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";

export default function AddActivityPopup(props)
{
  const options = [
    { name:"Import from another day", icon:"calendar-arrow-left", onPress:props.import },
    { name:"Search on map", icon:"map-search", onPress:props.searchMap },
    { name:"Search by name", icon:"magnify", onPress:props.search },
    { name:"Personnal activity", icon:"file-edit-outline", onPress:props.personnal },
  ];

  const getOption = (option, index) =>
  {
    return (
      <Displayers.Touchable key={index} onPress={option.onPress}>
        <View style={s.option}>
          <View style={s.optionIcon}>
            <Displayers.IconRound
              name={option.icon}
              size={25}
              type={"mci"}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.optionName}>
            <Texts.Label style={{ ...G.S.width(), paddingLeft:10 }}>
              <Text style={{fontSize: 12, color:G.Colors().Highlight()}}>
                {option.name}
              </Text>
            </Texts.Label>
          </View>
          <View style={s.chevron}>
            <Displayers.IconRound
              name={"chevron-right"}
              size={25}
              type={"mci"}
              color={G.Colors().Highlight()}
            />
          </View>
        </View>
      </Displayers.Touchable>
    );
  };

  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.width(96) }}
      style={{ paddingBottom:20 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="plus"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Add activity"}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n\nWhat type of activity would you like to add?"}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.options}>
          {options.map((o, index) => getOption(o, index))}
        </View>
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingTop:30,
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
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  options:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  option:
  {
    ...G.S.center,
    ...G.S.width(75),
    aspectRatio:6,
    marginBottom:20,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  optionIcon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    left:0,
  },
  optionName:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  chevron:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    right:0,
  },
});
  