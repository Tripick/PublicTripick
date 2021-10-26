import React from "react";
import { StyleSheet, ScrollView, View, Image, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";

export default function Friend(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = () => { context.navigate(navigation, backPage); }
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const getFriend = () =>
  {
    const isConfirmed = props.friend.needToConfirm === null;
    const friendName = isConfirmed === false ? "[needs to confirm your invitation]" : props.friend.firstName + " " + props.friend.lastName;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={s.container}
        contentContainerStyle={{...G.S.center}}
      >
        <View style={s.header}>
          <View style={s.photo}>
            <Buttons.RoundImage
              onPress={() => {}}
              contentStyle={s.avatar}
              image={props.friend.photo}
            />
          </View>
          <View style={s.username}>
            <Texts.Label singleLine style={{ color:G.Colors().Altlight(), fontSize: 16, paddingHorizontal:10 }}>
              {props.friend.userName}
            </Texts.Label>
          </View>
          {friendName === null || friendName.length <= 1 ? <View/> :
            <View style={s.name}>
              <Texts.Label singleLine style={{ color:G.Colors().Grey(), fontSize: 14, paddingHorizontal:10 }}>
                {friendName}
              </Texts.Label>
            </View>
          }
        </View>
        <View style={s.content}>
          <Texts.Label singleLine style={{ color:G.Colors().Neutral(0.8), fontSize: 20, paddingHorizontal:20 }}>
            Trips together
          </Texts.Label>
        </View>
        <View style={s.menuButton}>
          <Buttons.Round
            noBackground
            action
            dark
            size={22}
            onPress={() => setShowMenuPopup(true)}
          />
        </View>
        <View style={s.trips}>
          {typeof(props.friend.sharedTrips) !== 'undefined' && props.friend.sharedTrips !== null ? props.friend.sharedTrips.map(getTrip) : <View/>}
        </View>
      </ScrollView>
    );
  };

  const getTrip = (tripRef, index) =>
  {
    const isOdd = index%2 !== 0;
    const trip = context.userContext.trips.filter(t => t.id === tripRef.id)[0];
    const isOwner = trip.idOwner === context?.userContext?.user?.id;
    return (
      <Displayers.Touchable noFade key={index} onPress={() => props.onTripClick(trip.id)}>
        <View style={sTrip.tripContainer}>
          <View style={sTrip.tripFrame}>
            <View style={sTrip.trip}>
              <View style={[sTrip.tripTitle, isOdd === true ? sTrip.tripTitleOdd : sTrip.tripTitleEven]}>
                <View style={[sTrip.dates, isOdd === true ? {justifyContent: "flex-end"} : {}]}>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{fontSize: 14, color: G.Colors().Highlight()}}>
                      {trip.startDate === null ? "-" : G.Functions.dateYearToText(trip.startDate)}
                    </Texts.Label>
                  </View>
                </View>
                <View style={sTrip.tripTitleText}>
                  {isOdd === true ? 
                    <Texts.Label right numberOfLines={3} style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Neutral(0.8) }}>
                      {trip.name}
                    </Texts.Label>
                    :
                    <Texts.Label left numberOfLines={3} style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Neutral(0.8) }}>
                      {trip.name}
                    </Texts.Label>
                  }
                </View>
                <View style={[sTrip.dates, isOdd === true ? {justifyContent: "flex-end"} : {}]}>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{ fontSize: 12, color: G.Colors().Grey() }} >
                      {trip.startDate === null ? "-" : G.Functions.dateToText(trip.startDate, "MMM Do")}
                    </Texts.Label>
                  </View>
                  <View style={{ ...G.S.center, marginHorizontal:1 }}>
                    <Displayers.Icon
                      alignWidth
                      dark
                      noBackground
                      name="chevron-forward"
                      size={12}
                      color={G.Colors().Grey()}
                    />
                  </View>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{ fontSize: 12, color: G.Colors().Grey() }}>
                      {trip.endDate === null ? "-" : G.Functions.dateToText(trip.endDate, "MMM Do")}
                    </Texts.Label>
                  </View>
                </View>
              </View>
              <View style={[sTrip.cover, isOdd === true ? {right:0} : {left:0}, isOwner === true ? {} : {borderColor:G.Colors().Altlight()}]}>
                <View style={sTrip.coverFrame}>
                  <Image style={sTrip.coverImage} source={{ uri:typeof trip !== "undefined" && trip !== null && trip.coverImage !== null && trip.coverImage !== "" ? trip.coverImage : "_"}}/>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };

  const [showMenuPopup, setShowMenuPopup] = React.useState(false);
  const actions = [
    { visible:true, label:"Unfriend", icon:"close", backColor:G.Colors().Fatal, type:"mci", action:() =>
      {
        setShowConfirmation(true);
      },
    },
  ];

  const getMenuPopup = () =>
  {
    const isConfirmed = props.friend.needToConfirm === null;
    const friendName = isConfirmed === false ? "[needs to confirm your invitation]" : props.friend.userName;
    return (
      <Popups.Popup
        transparent={true}
        containerStyle={{ ...G.S.width(85) }}
        visible={showMenuPopup}
        hide={() => setShowMenuPopup(false)}
      >
        <View style={sPopup.container}>
          <View style={sPopup.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name="human-greeting"
              type="mci"
              size={40}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={sPopup.pickStats}>
            <Texts.Label>
              <Text style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {friendName + "\n"}
              </Text>
            </Texts.Label>
          </View>
          <View style={sPopup.actionsList}>
            {actions.map((action, index) => getAction(action, index))}
          </View>
        </View>
      </Popups.Popup>
    );
  };

  const getAction = (action, index) =>
  {
    if(action.visible === false)
      return (<View key={index}/>);
    return(
      <View key={index} style={sAction.container}>
        <Displayers.Touchable onPress={action.action}>
          <View style={[
            sAction.content,
            action.color ? {borderColor:action.color} : {},
            action.backColor ? {backgroundColor:action.backColor} : {}
          ]}>
            <View style={sAction.icon}>
              {action.image ?
                <Image
                  source={action.image}
                  style={{ height: 28, width: 28 }}
                  imageStyle={{ resizeMode: "contain" }}
                /> :
                <Displayers.Icon
                  alignWidth
                  dark
                  noBackground
                  name={action.icon}
                  type={action.type}
                  size={20}
                  color={action.color ? action.color : G.Colors().Foreground()}
                />
              }
            </View>
            <View style={sAction.label}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 14, color: action.color ? action.color : G.Colors().Foreground() }}>
                {action.label}
              </Texts.Label>
            </View>
            <View style={sAction.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={action.color ? action.color : G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  }

  const getConfirmation = () =>
  {
    return (
      <Popups.Popup
        noCloseButton={true}
        transparent={true}
        containerStyle={{ ...G.S.width(80) }}
        visible={showConfirmation}
        hide={() => setShowConfirmation(false)}
      >
        <View style={c.container}>
          <View style={c.icon}>
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
          <View style={c.title}>
            <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              {"You will not be friend with this person anymore, are you sure?"}
            </Texts.Label>
          </View>
          <View style={c.listContainer}>
            <View style={sButton.container}>
              <Displayers.Touchable onPress={() => { setShowConfirmation(false); props.unfriend(props.friend); }}>
                <View style={[sButton.content, { borderColor:G.Colors().Foreground(), backgroundColor:G.Colors().Fatal }]}>
                  <View style={sButton.label}>
                    <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                      Confirm
                    </Texts.Label>
                  </View>
                </View>
              </Displayers.Touchable>
            </View>
            <View style={sButton.container}>
              <Displayers.Touchable onPress={() => setShowConfirmation(false)}>
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
      </Popups.Popup>
    );
  }
  
  return (
    <Popups.Popup
      top={false}
      transparent={true}
      backButton={true}
      styleButtonBack={{ left:3, top:8 }}
      containerStyle={{ ...G.S.full }}
      visible={props.show}
      hide={props.hide}
    >
      {typeof(props.friend) === 'undefined' || props.friend === null ? <View/> : getFriend() }
      {typeof(props.friend) === 'undefined' || props.friend === null ? <View/> : getMenuPopup() }
      {getConfirmation()}
    </Popups.Popup>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.full,
    backgroundColor:G.Colors().Background(),
  },
  header:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  photo:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:3,
    marginTop:20,
  },
  avatar:
  {
    ...G.S.shadow(),
    borderWidth:1,
    borderColor:G.Colors().Altlight(),
    backgroundColor:G.Colors().Background(),
    overflow:'visible'
  },
  username:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
    flex:1,
    marginVertical:10,
    marginTop:20,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(75),
    aspectRatio:4,
  },
  menuButton:
  {
    position: "absolute",
    maxHeight: 40,
    maxWidth: 40,
    right: 3,
    top: 8,
  },
  trips:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
  },
  trip:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    backgroundColor:G.Colors().Highlight(),
  },
});

const c = StyleSheet.create(
{
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

let sButton = StyleSheet.create(
{
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
  
let sTrip = StyleSheet.create(
{
  tripContainer:
  {
    ...G.S.center,
    paddingTop:1,
    overflow: "visible",
  },
  tripFrame:
  {
    ...G.S.center,
    ...G.S.width(98),
    overflow: "visible",
  },
  trip:
  {
    ...G.S.center,
    ...G.S.width(98),
    aspectRatio:3,
    flexDirection:'row',
  },
  cover:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    borderRadius:100,
    overflow:'visible',
    borderWidth:2,
    borderColor:G.Colors().Highlight(),
  },
  coverFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
  },
  coverImage:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
  },
  tripTitle:
  {
    ...G.S.center,
    ...G.S.height(85),
    flex:1,
    backgroundColor:G.Colors().Foreground(),
  },
  tripTitleEven:
  {
    marginLeft:(G.Layout.window.width/3)/2,
    paddingLeft:(G.Layout.window.width/3)/2,
    borderTopRightRadius:100,
    borderBottomRightRadius:100,
  },
  tripTitleOdd:
  {
    marginRight:(G.Layout.window.width/3)/2,
    paddingRight:(G.Layout.window.width/3)/2,
    borderTopLeftRadius:100,
    borderBottomLeftRadius:100,
  },
  tripTitleText:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:5,
  },
  dates:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    marginBottom:5,
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
});

let sPopup = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    padding:5,
    paddingBottom:10,
  },
  title:
  {
    paddingVertical:20,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:"5%",
  },
  pickStats:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:0,
    paddingTop:10,
  },
  actionsList:
  {
    ...G.S.center,
    ...G.S.width(),
  },
});

let sAction = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:7,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
    overflow:'visible'
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    paddingLeft:5,
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom: 1,
    paddingLeft: 2,
  },
  iconGo:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    paddingRight:5,
  },
});