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

export default function TileTravelers(props)
{
  const activeNumber = 3;
  const current = props.activeStep === activeNumber;
  const active = props.activeStep > activeNumber;

  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [showTravelers, setShowTravelers] = React.useState(false);
  const [showTravelerPicker, setShowTravelerPicker] = React.useState(false);
  const [friends, setFriends] = React.useState(context.userContext.friends);
  const [isOwner, setIsOwner] = React.useState(props.trip.idOwner === context.userContext.user.id);
  React.useEffect(() =>
  {
    setFriends(context.userContext.friends);
  }, [context.userContext.friends]);

  // Explanation
  const [showExplanation, setShowExplanation] = React.useState(false);

  const getTraveler = (traveler, index) =>
  {
    // Display the owner instead of ourselves
    if(isOwner === false && traveler.id === context.userContext.user.id)
      traveler = friends.filter(f => f.id === props.trip.idOwner)[0];
    const friendIsMineToo = friends.filter(f => f.id === traveler.id).length > 0;
    if(friendIsMineToo === false) console.log("The traveler [" + traveler.id + "] is not my friend, I cannot see him!");
    traveler.photo = friendIsMineToo === true ? friends.filter(f => f.id === traveler.id)[0].photo : "_";
    const subname = traveler.firstName + " " + traveler.lastName;
    return (
      <Displayers.Touchable noFade onPress={props.isOwner === true ? () => setShowTravelers(true) : () => {}} key={index}>
        <View style={f.container}>
          <View style={f.content}>
            <View style={f.photoContainer}>
              <Image style={f.photo} source={{uri:typeof(traveler) !== 'undefined' && traveler !== null && traveler.photo !== null && traveler.photo !== "" ? traveler.photo : "_"}}/>
            </View>
            <View style={f.name}>
              <Texts.Label style={{ fontSize: 12, color:G.Colors().Highlight() }} numberOfLines={1}>
                {traveler.userName}
              </Texts.Label>
              {subname === null || subname === " " ? <View/> :
                <Texts.Label style={{ fontSize: 10, color:G.Colors().Grey() }} numberOfLines={1}>
                  {subname}
                </Texts.Label>
              }
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
          <Displayers.Touchable onPress={props.isOwner === true ? () => setShowTravelers(true) : () => {}}>
            <View style={[s.explanation, {paddingLeft:10}]}>
              <Texts.Label style={{ ...G.S.width() }}>
                <Text style={{fontSize: 14, color:G.Colors().Highlight(), fontWeight:'bold'}}>Click here </Text>
                <Text style={{fontSize: 11, color:G.Colors().Neutral(0.5)}}>to add</Text>
                <Text style={{fontSize: 14, color:G.Colors().Neutral(0.5), fontWeight:'bold'}}> travelers </Text>
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
            {typeof(props.trip.travelers) === "undefined" || props.trip.travelers === null || props.trip.travelers.length === 0 ?
              <Buttons.Label
                shadow
                backgroundBright
                color={G.Colors().Highlight()}
                onPress={() => { setShowTravelers(true); setTimeout(function() { setShowTravelerPicker(true); });}}
                containerStyle={{...G.S.width(), aspectRatio:4.5 }}
                contentStyle={{ ...G.S.full, paddingBottom:1, borderWidth:1, borderColor:G.Colors().Highlight() }}
                chevron={true}
                chevronSize={18}
              >
                <Texts.Label style={{...G.S.width(), fontSize: 12, color:G.Colors().Highlight()}}>Any friends traveling with you?</Texts.Label>
              </Buttons.Label>
              : 
              <View style={s.lineContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={s.list}
                  contentContainerStyle={{flexGrow: 1}}
                >
                  {props.trip.travelers.map((traveler, index) => getTraveler(traveler, index))}
                </ScrollView>
              </View>
            }
          </View>
          <View style={showExplanation === false || typeof(props.trip.travelers) === "undefined" || props.trip.travelers === null || props.trip.travelers.length === 0 ? s.contentHidden : s.explanation }>
            <Texts.Label style={{ ...G.S.width(), fontSize: 10, color:G.Colors().Neutral(0.4) }}>
              Friends traveling with you
            </Texts.Label>
          </View>
          <Pickers.Travelers
            show={showTravelers}
            hide={() => {setShowTravelerPicker(false); setShowTravelers(false);}}
            showPick={showTravelerPicker}
            setShowPick={setShowTravelerPicker}
            hidePick={() => setShowTravelerPicker(false)}
            name="Travelers"
            icon="human-greeting"
            iconType="mci"
            title="Friends traveling with you"
            subtitle={"Traveling with friends?\nAdd them to the trip so they can pick places."}
            list={props.trip.travelers}
            onSave={props.saveTravelers}
          />
        </View>
      </View>);
  };

  return (
    <View style={[s.container, props.activeStep <= activeNumber ? {aspectRatio:3} : (typeof(props.trip.travelers) === "undefined" || props.trip.travelers === null || props.trip.travelers.length === 0 ? {aspectRatio:3} : {})]}>
      <View style={[s.section, {borderColor:props.separatorColor}]}>
        <Displayers.Touchable onPress={() => setShowExplanation(!showExplanation)}>
          <View style={s.sectionContent}>
            <View style={s.sectionIcon}>
              <Displayers.Icon
                name="human-greeting"
                type="mci"
                size={28}
                color={current === false && active === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
              />
              </View>
              <View style={s.sectionName}>
                <Texts.Label numberOfLines={2}
                  style={[{ fontSize: 12 }, current === true ? {color:G.Colors().Highlight()} : (active === false ? {color:G.Colors().Neutral(0.1)} : {color:G.Colors().Neutral(0.6)}) ]}
                >
                Travelers
              </Texts.Label>
            </View>
          </View>
        </Displayers.Touchable>
      </View>
      <View style={s.timeline}>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:-15}, active === false && current === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineLine}><View style={[s.timelineLineMiddle,{marginTop:15}, props.isLast === true ? {borderColor: G.Colors().Transparent} : active === false ? {borderColor: G.Colors().Neutral(0.1)} : {}]}/></View>
        <View style={s.timelineIcon}>
          <Displayers.IconRound
            name={active === false ? "checkbox-blank-circle-outline" : "checkbox-marked-circle-outline"}
            size={20}
            type={"mci"}
            color={active === false && current === false ? G.Colors().Neutral(0.1) : G.Colors().Highlight()}
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
    aspectRatio:3,
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
    paddingVertical:10,
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
    aspectRatio: 0.8,
    backgroundColor: G.Colors().Foreground(),
  },
  photoContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    aspectRatio: 1,
    flex:2,
    marginTop:3,
    borderRadius: 100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    overflow:'visible',
  },
  photo:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 100,
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1.5,
    paddingTop:5,
  },
  iconAdd:
  {
    ...G.S.center,
    ...G.S.full,
    flex:1,
  },
});