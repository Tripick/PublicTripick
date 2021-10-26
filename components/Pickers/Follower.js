import React, { useState } from "react";
import { StyleSheet, View, FlatList, TextInput, Image } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Followers(props)
{
  const [context, setContext] = React.useContext(AppContext);

  const [followers, setFollowers] = React.useState(context.userContext.friends);
  React.useEffect(() => { setFollowers(context.userContext.friends); }, [context.userContext.friends]);

  const initFilter = "Search for a follower...";
  const [filter, setFilter] = React.useState(initFilter);
  const [filteredFollowers, setFilteredFollowers] = React.useState([]);
  React.useEffect(() =>
  {
    setFilteredFollowers(followers.filter((follower) =>
    (
      filter === "" ||
      filter === initFilter ||
      (
        typeof(follower.userName) != 'undefined' &&
        follower.userName !== null &&
        follower.userName.startsWith(filter)
      )
    )));
  }, [filter, followers, props.alreadyIn, context]);
  const clearInitFilter = () =>
  {
    if(filter === initFilter)
      setFilter("");
  }
  const resetInitFilter = () =>
  {
    if(filter === "")
      setFilter(initFilter);
  }
  
  const getFollower = (follower) =>
  {
    return (
      <TouchableWithoutFeedback onPress={() => props.onSelect(follower)}>
        <View style={[f.container, props.alreadyIn.filter(x => x.id === follower.id).length === 1 ? {borderColor:G.Colors().Green()} : {}]}>
          <View style={f.photo}>
            <Image style={{ ...G.S.full, borderRadius: 100 }} source={{uri:typeof follower !== "undefined" && follower !== null && follower.photo !== null && follower.photo !== "" ? follower.photo : "_"}}/>
          </View>
          <View style={f.name}>
            <Texts.Label left style={f.nameLine} numberOfLines={1}>
              {follower.userName}
            </Texts.Label>
          </View>
          <View style={f.button}>
            {props.alreadyIn.filter(x => x.id === follower.id).length === 1 ?
              <Buttons.Round
                dark
                noBackground
                name="eye-check-outline"
                type="mci"
                size={30}
                color={G.Colors().Green()}
                onPress={() => {}}
                containerStyle={{padding:0}}
              />
              :
              <Buttons.Round
                dark
                noBackground
                name="eye-plus-outline"
                type="mci"
                size={30}
                color={G.Colors().Highlight()}
                onPress={() => props.onSelect(follower)}
                containerStyle={{padding:0}}
              />
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Popups.Popup
      top={props.top}
      transparent={true}
      containerStyle={{ ...G.S.height(props.height ? props.height : 60), ...G.S.width(props.width ? props.width : 90) }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.name}>
          <View style={s.sectionNameIcon}>
            <Displayers.Icon
              name="eye-plus-outline"
              type="mci"
              size={40}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.sectionNameText}>
            <Texts.Label left singleLine style={{ fontSize: 18, color: G.Colors().Highlight()}}>
              {props.title}
            </Texts.Label>
          </View>
        </View>
        <View style={s.filter}>
          <TextInput
            style={s.filterInput}
            onChangeText={(val) => setFilter(val)}
            value={filter}
            maxLength={100}
            onFocus={clearInitFilter}
            onBlur={resetInitFilter}
          />
        </View>
        <View style={s.list}>
          {filteredFollowers === null || filteredFollowers.length <= 0 ? 
            <Texts.Label left style={{ fontSize: 11, color: G.Colors().Neutral(0.6)}}>
              {props.subtitle}
            </Texts.Label>
            :
            <FlatList
              keyExtractor={(follower, index) => String(typeof follower === "undefined" || follower === null ? index : follower.id)}
              data={filteredFollowers}
              renderItem={(itemData) => getFollower(itemData.item)}
            />
          }
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
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  subtitle:
  {
    ...G.S.center,
    ...G.S.width(95),
    marginTop:20,
  },
  filter:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent: "flex-end",
    alignContent: "flex-end",
  },
  filterInput:
  {
    ...G.S.width(90),
    aspectRatio:8,
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
  list:
  {
    ...G.S.width(90),
    flex:7,
    marginTop: 10,
    marginBottom: 15,
    padding:8,
    paddingHorizontal:0,
  },
});

let f = StyleSheet.create(
{
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
  }
});
