import React, { useState } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";
// Components
import Follower from "./Follower";

export default function Followers(props)
{
  const onAddFollower = (follower) =>
  {
    props.onAdd(follower);
  }

  const onDeleteFollower = (follower) =>
  {
    props.onDelete(follower);
  }

  const getFollower = (follower) =>
  {
    return (
      <View style={f.container}>
        <View style={f.photo}>
          <Image style={{ ...G.S.full, borderRadius: 100 }} source={{uri:typeof follower !== "undefined" && follower !== null && follower.photo !== null && follower.photo !== "" ? follower.photo : "_"}}/>
        </View>
        <View style={f.name}>
          <Texts.Label left style={f.nameLine} numberOfLines={1}>
            {follower.userName}
          </Texts.Label>
        </View>
        <View style={f.button}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name="eye-off-outline"
            type="mci"
            size={30}
            color={G.Colors().Fatal}
            onPress={() => onDeleteFollower(follower)}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
      </View>
    );
  };

  return (
    <Popups.Popup
      transparent={true}
      containerStyle={{ ...G.S.height(props.height ? props.height : 60), ...G.S.width(props.width ? props.width : 90) }}
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
          <Texts.Label left style={{ fontSize: 12, color:G.Colors().Neutral(0.6) }}>
            {props.subtitle}
          </Texts.Label>
        </View>
        <View style={s.buttonContainer}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="eye-plus-outline"
            type="mci"
            size={25}
            color={G.Colors().Background()}
            onPress={() => props.setShowPick(true)}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
        <View style={s.list}>
          <FlatList
            keyExtractor={(follower, index) => String(typeof follower === "undefined" || follower === null ? index : follower.id)}
            data={props.list}
            renderItem={(itemData) => getFollower(itemData.item)}
          />
        </View>
        <Follower
          height={75}
          width={75}
          show={props.showPick === true}
          hide={() => props.setShowPick(false)}
          title={"Add a follower to your trip!"}
          subtitle={"Can't find your friends?\nSend them a 'friend invite' via your account menu."}
          onSelect={onAddFollower}
          alreadyIn={props.list}
        />
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
    paddingHorizontal:4,
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginBottom: 10,
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
    aspectRatio:5,
    marginBottom: 10,
    padding:5,
    borderRadius:100,
    borderWidth:2,
    borderColor:G.Colors().Highlight(),
    backgroundColor: G.Colors().Foreground(),
  },
  photo:
  {
    ...G.S.center,
    ...G.S.shadow(3),
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
    fontSize: 14
  },
  button:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
    flex:1,
  }
});
