import React, { useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function Travelers(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [travelers, setTravelers] = React.useState([]);
  React.useEffect(() =>
  {
    if(typeof(props.list) !== 'undefined' && props.list !== null && typeof(context.userContext.friends) !== 'undefined' && context.userContext.friends !== null)
    {
      let travelersObjs = [];
      context.userContext.friends.filter(f => f.needToConfirm === null).forEach(f =>
      {
        const isIn = props.list.filter(x => x.id === f.id).length > 0;
        travelersObjs.push({ isSelected:isIn, infos:f });
      });
      setTravelers(travelersObjs);
    }
  }, [props.show, props.list, context.userContext.friends]);

  const selectTraveler = (id) =>
  {
    const selectedTraveler = travelers.filter(x => x.infos.id === id)[0];
    selectedTraveler.isSelected = !selectedTraveler.isSelected;
    setTravelers([...travelers]);
  }

  const onSave = () =>
  {
    props.hide();
    props.onSave(travelers.filter(t => t.isSelected === true).map(t => t.infos.id));
  }

  const getTraveler = (travelerObj) =>
  {
    const traveler = travelerObj.infos;
    const subname = traveler.firstName + " " + traveler.lastName;
    return (
      <View style={[f.container, travelerObj.isSelected === true ? f.containerActive : {}]}>
        <View style={f.photo}>
          <Image style={{ ...G.S.full, borderRadius: 100 }} source={{uri:typeof traveler !== "undefined" && traveler !== null && traveler.photo !== null && traveler.photo !== "" ? traveler.photo : "_"}}/>
        </View>
        <View style={f.name}>
          <Texts.Label left style={f.nameLine} numberOfLines={1}>
            {traveler.userName}
          </Texts.Label>
          {subname === null || subname === " " ? <View/> :
            <Texts.Label left style={f.subnameLine} numberOfLines={1}>
              {subname}
            </Texts.Label>
          }
        </View>
        <Displayers.TouchableOverlay onPress={() => selectTraveler(traveler.id)} />
      </View>
    );
  };

  return (
    <Popups.Popup
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.name}>
          <View style={s.sectionNameIcon}>
            <Displayers.Icon
              name={props.icon}
              type={props.iconType}
              size={40}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.sectionNameText}>
            <Texts.Label
              left singleLine
              style={{ fontSize: 18, color: G.Colors().Highlight()}}
            >
              {props.name}
            </Texts.Label>
          </View>
        </View>
        <View style={s.title}>
          <Texts.Label style={{ fontSize: 15, fontWeight:'bold', color:G.Colors().Neutral(0.6) }}>
            {props.title}
          </Texts.Label>
        </View>
        <View style={s.subtitle}>
          <Texts.Label style={{ fontSize: 12, color:G.Colors().Neutral(0.6) }}>
            {props.subtitle}
          </Texts.Label>
        </View>
        <View style={s.list}>
          <FlatList
            keyExtractor={(traveler, index) => String(typeof traveler === "undefined" || traveler === null ? index : traveler.infos.id)}
            data={travelers}
            renderItem={(itemData) => getTraveler(itemData.item)}
          />
        </View>
        <View style={s.validateContainer}>
          <Buttons.Label
            center
            iconRight
            alignWidth
            contentForeground
            backgroundHighlight
            iconName="check"
            type="mci"
            style={s.buttonContainer}
            size={20}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
            iconStyle={{right:10}}
            onPress={onSave}
          >
            Save
          </Buttons.Label>
        </View>
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    padding:5,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
  },
  sectionNameIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
    justifyContent: "flex-end",
    alignContent: "flex-end"
  },
  sectionNameText:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:0.5,
    marginTop:-10,
    justifyContent: "flex-end",
    alignContent: "flex-end"
  },
  subtitle:
  {
    ...G.S.center,
    ...G.S.width(90),
    flex:1,
  },
  list:
  {
    ...G.S.width(94),
    flex:6,
    marginBottom: 10,
    padding:5,
    paddingHorizontal:5,
    borderWidth:1,
    borderRadius:30,
    borderColor:G.Colors().Neutral(0.2),
    backgroundColor: G.Colors().Background(),
  },
  validateContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginBottom: 10,
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(80),
    aspectRatio:5,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
  },
});

let f = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:'row',
    aspectRatio:6,
    marginBottom:5,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Background(),
    backgroundColor: G.Colors().Background(),
    overflow:'visible'
  },
  containerActive:
  {
    borderColor:G.Colors().Highlight(),
    backgroundColor: G.Colors().Foreground(),
  },
  photo:
  {
    ...G.S.center,
    //...G.S.shadow(3),
    ...G.S.height(),
    aspectRatio: 1,
    borderRadius: 100,
  },
  name:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:4,
  },
  nameLine:
  {
    ...G.S.width(),
    paddingLeft: 10,
    fontSize: 14,
    color:G.Colors().Highlight(),
  },
  subnameLine:
  {
    ...G.S.width(),
    paddingLeft: 10,
    fontSize: 10,
    color:G.Colors().Grey(),
  },
  button:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
    flex:1,
  }
});
