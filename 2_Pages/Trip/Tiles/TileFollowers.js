import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
// Context
import { AppContext } from "../../../AppContext";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Views from "../../../Libs/Views";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Popups from "../../../Libs/Popups";
import * as Displayers from "../../../Libs/Displayers";

export default function TileFollowers(props)
{
  const activeNumber = 4;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [showFollowers, setShowFollowers] = React.useState(false);
  const [showFollowerPicker, setShowFollowerPicker] = React.useState(false);
  const [friends, setFriends] = React.useState(context.userContext.friends);
  React.useEffect(() => { setFriends(context.userContext.friends); }, [context.userContext.friends]);

  // Explanation
  const [showExplanation, setShowExplanation] = React.useState(false);

  // Message popup
  const [messagePopup, setMessagePopup] = React.useState("");
  const [showMessagePopup, setShowMessagePopup] = React.useState(false);
  const [messagePopupDuration, setMessagePopupDuration] = React.useState(1500);
  const displayMessage = (message, duration = 1500) =>
  {
    setMessagePopup(message);
    setMessagePopupDuration(duration);
    setShowMessagePopup(true);
  }

  const onAdd = (follower) =>
  {
    setLoading(true);
    setParameterAddFollower(follower.id);
  };
  const [parameterAddFollower, setParameterAddFollower] = React.useState(null);
  React.useEffect(() => {
    if (parameterAddFollower !== null)
    {
      executeAddFollower(parameterAddFollower);
      setParameterAddFollower(null);
    }
  }, [parameterAddFollower]);
  const executeAddFollower = (idFollower) =>
  {
    G.Functions.serverRequest(
      context.userContext,
      "follower/add",
      { IdTrip: props.trip.id, IdFriend: idFollower },
      (response) => {
        if(response !== null) props.addFollower(response);
        setLoading(false);
        displayMessage("Follower added to the list", 2000);
      },
      (error) => {
        console.log("Add follower error : ");
        console.log(error);
        setLoading(false);
      }
    );
  };
  
  const onDelete = (follower) =>
  {
    setLoading(true);
    setParameterDeleteFollower(follower.id);
  };
  const [parameterDeleteFollower, setParameterDeleteFollower] = React.useState(null);
  React.useEffect(() => {
    if (parameterDeleteFollower !== null)
    {
      executeDeleteFollower(parameterDeleteFollower);
      setParameterDeleteFollower(null);
    }
  }, [parameterDeleteFollower]);
  const executeDeleteFollower = (idFollower) =>
  {
    G.Functions.serverRequest(
      context.userContext,
      "follower/delete",
      { IdTrip: props.trip.id, IdFriend: idFollower },
      (response) => {
        if(response === true) props.deleteFollower(idFollower);
        setLoading(false);
        displayMessage("Follower removed from the list", 2000);
      },
      (error) => {
        console.log("Delete follower error : ");
        console.log(error);
        setLoading(false);
      }
    );
  };

  const getFollower = (follower, index) =>
  {
    follower.photo = friends.filter(f => f.id === follower.id)[0].photo;
    return (
      <Displayers.Touchable noFade onPress={() => setShowFollowers(true)} key={index}>
        <View style={f.container}>
          <View style={f.content}>
            <View style={f.aligner}/>
            <View style={f.photoContainer}>
              <Image style={f.photo} source={{uri:typeof follower !== "undefined" && follower !== null && follower.photo !== null && follower.photo !== "" ? follower.photo : "_"}}/>
            </View>
            <View style={f.name}>
              <Texts.Label style={{ fontSize: 12, color:G.Colors().Highlight() }} numberOfLines={1}>
                {follower.userName}
              </Texts.Label>
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  }

  const getContent = () =>
  {
    return (
      <View style={[s.contentFrame, {borderColor:props.separatorColor}]}>
        {
          current === true ?
          <Displayers.Touchable onPress={() => setShowFollowers(true)}>
            <View style={[s.explanation, {paddingLeft:10}]}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Text style={{fontSize: 14, color:G.Colors().Highlight(), fontWeight:'bold'}}>Click here </Text>
                <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>to add</Text>
                <Text style={{fontSize: 14, color:G.Colors().Neutral(0.5), fontWeight:'bold'}}> Followers </Text>
                <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>and</Text>
                <Text style={{fontSize: 14, color:G.Colors().Neutral(0.5), fontWeight:'bold'}}> Followers </Text>
                <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>to your trip!</Text>
              </Texts.Label>
            </View>
          </Displayers.Touchable> : 
          active === false ?
            <View style={s.explanation}>
              <Texts.Label style={{ ...G.S.width(), fontSize: 11, color:G.Colors().Neutral(0.1) }}>
                Not ready yet, follow the steps above
              </Texts.Label>
            </View>
          : <View />
        }
        <View style={active === false ? s.containerFrameHidden : s.containerFrame}>
          <View style={s.content}>
            {typeof(props.trip?.followers) === "undefined" || props.trip?.followers === null || props.trip?.followers?.length === 0 ?
              <Buttons.Label
                shadow
                backgroundBright
                color={G.Colors().Highlight()}
                onPress={() => { setShowFollowers(true); setTimeout(function() { setShowFollowerPicker(true); }, 100); }}
                containerStyle={{...G.S.width() }}
                contentStyle={{ ...G.S.height(80), ...G.S.width(), paddingBottom:1, borderWidth:1, borderColor:G.Colors().Highlight(), }}
                chevron={true}
                chevronSize={18}
              >
                <Texts.Label style={{...G.S.width(), fontSize: 12, color:G.Colors().Highlight()}}>Any friends following you?</Texts.Label>
              </Buttons.Label>
              : 
              <View style={s.lineContainer}>
                <Displayers.Touchable onPress={() => { setShowFollowers(true); setTimeout(function() { setShowFollowerPicker(true); }, 100); }}>
                  <View style={s.addButton}>
                    <Displayers.Icon
                      alignWidth
                      name="eye-plus-outline"
                      type="mci"
                      size={25}
                      color={G.Colors().Highlight()}
                    />
                  </View>
                </Displayers.Touchable>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={s.list}
                  contentContainerStyle={{flexGrow: 1}}
                >
                  {props.trip?.followers?.map((follower, index) => getFollower(follower, index))}
                </ScrollView>
              </View>
            }
          </View>
          <View style={showExplanation === false || typeof(props.trip?.followers) === "undefined" || props.trip?.followers === null || props.trip?.followers?.length === 0 ? s.contentHidden : s.explanation }>
            <Texts.Label style={{ ...G.S.width(), fontSize: 10, color:G.Colors().Neutral(0.4) }}>
              Friends following your trip
            </Texts.Label>
          </View>
          <Pickers.Followers
            height={98}
            width={97}
            show={showFollowers}
            hide={() => {setShowFollowerPicker(false); setShowFollowers(false);}}
            showPick={showFollowerPicker}
            setShowPick={setShowFollowerPicker}
            hidePick={() => setShowFollowerPicker(false)}
            name="Followers"
            icon="eye-outline"
            iconType="mci"
            title="Share your trip with friends"
            subtitle={"Share your trip with your friends so they can follow you during your trip!"}
            list={props.trip?.followers}
            onAdd={onAdd}
            onDelete={onDelete}
          />
        </View>
        <Popups.PopupTemporary
          time={messagePopupDuration}
          visible={showMessagePopup}
          hide={() => setShowMessagePopup(false)}
          message={messagePopup}
        />
      </View>);
  };

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3} : (typeof(props.trip?.followers) === "undefined" || props.trip?.followers === null || props.trip?.followers.length === 0 ? {aspectRatio:3} : {})]}>
      <View style={[s.section, {borderColor:props.separatorColor}]}>
        <Displayers.Touchable onPress={() => setShowExplanation(!showExplanation)}>
          <View style={s.sectionContent}>
            <View style={s.sectionIcon}>
              <Displayers.Icon
                name="eye-outline"
                type="mci"
                size={28}
                color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
              />
              </View>
              <View style={s.sectionName}>
                <Texts.Label
                  left singleLine
                  style={[{ fontSize: 12 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
                >
                Followers
              </Texts.Label>
            </View>
          </View>
        </Displayers.Touchable>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, active === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
            size={20}
            type={"mci"}
            color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()} // G.Colors().Neutral(0.5) // G.Colors().Highlight()
          />
        </View>
      </View>
      {getContent()}
      <Displayers.LoaderVertical isVisible={loading} />
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
    aspectRatio:2,
    marginTop:-1,
    backgroundColor:G.Colors().Foreground()
  },
  section:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:3,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
  },
  timeline:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:10,
    borderTopWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    paddingVertical:20,
  },
  containerFrame:
  {
    ...G.S.center,
    ...G.S.full,
  },
  containerFrameHidden:
  {
    height:0,
    width:0,
    overflow:'hidden'
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:5,
  },
  explanation:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop:3,
  },
  contentHidden:
  {
    height:0,
    width:0,
    flex:0,
    overflow:'hidden'
  },
  explanationButton:
  {
    ...G.S.center,
    flexDirection:'row',
    padding:10,
    paddingHorizontal:15,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
  },
  sectionContent:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:1,
    paddingVertical:10,
  },
  sectionIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },
  sectionName:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },

  timelineLine:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  timelineLineMiddle:
  {
    ...G.S.center,
    ...G.S.height(),
    width:1,
    borderLeftWidth: 1.5,
    borderColor: G.Colors().Highlight(),
    marginTop:10
  },
  timelineIcon:
  {
    ...G.S.center,
    width:20,
    aspectRatio:1,
    position: 'absolute'
  },
  lineContainer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:'row',
    justifyContent:'flex-start',
  },
  addButton:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    height:40,
    aspectRatio:1,
    marginLeft:13,
    marginRight:2,
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(),
  },
  list:
  {
    ...G.S.height(),
    flex:1,
  },
});



let f = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.height(),
  },
  content:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 0.75,
    backgroundColor: G.Colors().Foreground(),
  },
  photoContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    aspectRatio: 1,
    borderRadius: 100,
    flex:3,
    overflow:'visible',
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  photo:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 100,
  },
  aligner:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingTop:5,
  },
  iconAdd:
  {
    ...G.S.center,
    ...G.S.full,
    flex:1,
  },
});