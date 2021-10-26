import React from "react";
import { StyleSheet, ScrollView, View, Image } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Wrappers from "../../Libs/Wrappers";
// Components
import Friend from "./Friend";
import SearchFriend from "./SearchFriend";
import User from "./User";

export default function Friends({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const [friends, setFriends] = React.useState(context?.userContext?.friends);
  const [friendToDisplay, setFriendToDisplay] = React.useState(null);
  const [userToDisplay, setUserToDisplay] = React.useState(null);
  const [showSearch, setShowSearch] = React.useState(false);
  
  // UseEffects
  React.useEffect(() => { if(typeof(context.userContext) !== 'undefined' && context.userContext !== null) setFriends(context.userContext.friends); }, [context?.userContext?.friends]);

  const deleteFriend = async (friend) =>
  {
    setFriendToDisplay(null);
    console.log("Deleting friend " + friend.id + "...");
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"friend_delete",
      isRetribution:false,
      data:{ friend:friend }
    }]});
  }
  const addFriend = (friend) =>
  {
    console.log("Adding friend " + friend.id + "...");
    setUserToDisplay(null);
    setShowSearch(false);
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"friend_add",
      isRetribution:false,
      data:{ friend:friend }
    }]});
  }
  const confirmFriend = async (friend) =>
  {
    console.log("Confirming friend " + friend.id + "...");
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"friend_confirm",
      isRetribution:false,
      data:{ friend:friend }
    }]});
  }

  const getFriend = (friend, index) =>
  {
    const photo = typeof friend !== "undefined" && friend !== null && friend.photo !== null && friend.photo !== "" ? friend.photo : "_";
    let subtitle = friend.firstName + " " + friend.lastName;
    let isToConfirm = friend.needToConfirm === context.userContext.user.id;
    if(friend.needToConfirm === friend.id)
      subtitle = "[Awaiting confirmation]";
    if(isToConfirm === true)
      subtitle = "Do you know "+friend.userName+" ?";
    return (
      <Displayers.Touchable noFade key={index} onPress={() => setFriendToDisplay(friend)}>
        <View style={s.friendContainer}>
          <View style={s.friendFrame}>
            <View style={s.friend}>
              <View style={s.cover}>
                <View style={s.coverFrame}>
                  <Image style={s.coverImage} source={{ uri:photo }}/>
                </View>
              </View>
              <View style={s.friendTitle}>
                <View style={s.friendTitleText}>
                  <Texts.Label left numberOfLines={3} style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Altlight() }}>
                    {friend.userName}
                  </Texts.Label>
                </View>
                {subtitle === null || subtitle.length <= 1 ? <View/> :
                  <View style={s.friendSubtitle}>
                    <View style={{ ...G.S.center }}>
                      <Texts.Label style={{fontSize: 12, color:G.Colors().Neutral(0.6)}} >
                        {subtitle}
                      </Texts.Label>
                    </View>
                  </View>
                }
              </View>
              {isToConfirm === false ? <View/> : 
                <View style={s.confirmButtons}>
                  <View style={s.confirmButton}>
                    <Buttons.Round
                      alignWidth
                      dark
                      noBackground
                      name="close"
                      type="mci"
                      size={25}
                      color={G.Colors().Fatal}
                      onPress={() => deleteFriend(friend)}
                    />
                  </View>
                  <View style={s.confirmButton}>
                    <Buttons.Round
                      alignWidth
                      dark
                      noBackground
                      name="check"
                      type="mci"
                      size={25}
                      color={G.Colors().Green()}
                      onPress={() => confirmFriend(friend)}
                    />
                  </View>
                </View>
              }
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  }

  const getHeader = () =>
  {
    return (
      <View style={h.addButton}>
        <View style={h.icon}>
          <Displayers.Icon
            alignWidth
            dark
            noBackground
            name="account-search"
            type="mci"
            size={25}
            color={G.Colors().Foreground()}
          />
        </View>
        <View style={h.text}>
          <Texts.Label style={{ fontSize: 14, color: G.Colors().Foreground() }}>
            Add a friend
          </Texts.Label>
        </View>
        <Displayers.TouchableOverlay onPress={() => setShowSearch(true)} />
      </View>
    );
  };

  const onTripClick = (idTrip) =>
  {
    const trip = context.userContext.trips.filter(t => t.id === idTrip)[0];
    setContext({ ...context, previousPageName: "Friends", currentTripId: idTrip });
    setFriendToDisplay(null);
    context.navigate(navigation, trip.isItineraryGenerated === true ? "Itinerary" : "Trip");
  };

  return (
    <Wrappers.AppFrame>
      {typeof(context.userContext) === 'undefined' || context.userContext === null ?
        <View/>
        :
        <View style={{...G.S.width(), flex:1}}>
          <View style={{...G.S.width(), flex:1}}>
            <View style={s.container}>
              {getHeader()}
              <View style={s.list}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={s.scrollView}
                  contentContainerStyle={{...G.S.center, paddingTop:90}}
                >
                  {friends.map((f, i) => getFriend(f, i))}
                </ScrollView>
              </View>
            </View>
          </View>
          <Friend 
            show={friendToDisplay !== null}
            hide={() => setFriendToDisplay(null)}
            friend={friendToDisplay}
            unfriend={deleteFriend}
            onTripClick={onTripClick}
          />
          <User 
            show={userToDisplay !== null}
            hide={() => setUserToDisplay(null)}
            user={userToDisplay}
            addFriend={addFriend}
          />
          <SearchFriend
            show={showSearch}
            hide={() => setShowSearch(false)}
            displayUser={setUserToDisplay}
          />
        </View>
      }
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  label:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:3
  },
  list:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  scrollView:
  {
    ...G.S.full,
  },
  friendContainer:
  {
    ...G.S.center,
    marginBottom:10,
    overflow: "visible",
  },
  friendFrame:
  {
    ...G.S.center,
    ...G.S.width(94),
    overflow: "visible",
  },
  friend:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    flexDirection:'row',
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(),
  },
  cover:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Altlight(),
    overflow:'visible',
  },
  coverFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
    ...G.S.shadow(5),
  },
  coverImage:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
  },
  friendTitle:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingLeft:15,
  },
  friendTitleText:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  friendSubtitle:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
  },
  linkList:
  {
    ...G.S.center,
    width: G.Layout.window.width / 3,
    borderRadius: 12,
    justifyContent: "flex-end",
    alignContent: "flex-end",
  },
  button:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    height:35,
    marginBottom:40,
    paddingBottom:2,
    paddingHorizontal:40,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  buttonText:
  {
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Foreground(),
  },
  chevronContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    right:0,
  },
  confirmButtons:
  {
    ...G.S.center,
    ...G.S.height(),
    position:'absolute',
    right:10,
    flexDirection:'row',
  },
  confirmButton:
  {
    ...G.S.center,
    ...G.S.height(50),
    aspectRatio:1,
  },
});

let h = StyleSheet.create({
  addButton:
  {
    ...G.S.center,
    ...G.S.shadow(),
    height:40,
    aspectRatio:4,
    position:'absolute',
    top:30,
    flexDirection:'row',
    zIndex:100,
    backgroundColor:G.Colors().Altlight(),
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    left:10,
  },
  text:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingLeft:10,
  },
});
  