import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
// Components

export default function User(props)
{
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const getUser = () =>
  {
    const userName = props.user.firstName + " " + props.user.lastName;
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
              image={props.user.photo}
            />
          </View>
          <View style={s.username}>
            <Texts.Label singleLine style={{ color:G.Colors().Highlight(), fontSize: 16, paddingHorizontal:10 }}>
              {props.user.userName}
            </Texts.Label>
          </View>
          {userName === null || userName.length <= 1 ? <View/> :
            <View style={s.name}>
              <Texts.Label singleLine style={{ color:G.Colors().Grey(), fontSize: 14, paddingHorizontal:10 }}>
                {userName}
              </Texts.Label>
            </View>
          }
        </View>
        <View style={s.content}>
          <Buttons.Label
            center
            shadow
            iconRight
            alignWidth
            contentForeground
            backgroundBright
            iconName="account-plus"
            type="mci"
            style={s.buttonLabel}
            size={25}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Green()}}
            color={G.Colors().Green()}
            iconStyle={{right:10}}
            onPress={() => setShowConfirmation(true)}
          >
            Add friend
          </Buttons.Label>
        </View>
      </ScrollView>
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
              name={"account-plus"}
              type="mci"
              size={35}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={c.title}>
            <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              {"You will send a friend invite to this person, are you sure?"}
            </Texts.Label>
          </View>
          <View style={c.listContainer}>
            <View style={sButton.container}>
              <Displayers.Touchable onPress={() => { setShowConfirmation(false); props.addFriend(props.user); }}>
                <View style={[sButton.content, { borderColor:G.Colors().Foreground(), backgroundColor:G.Colors().Green() }]}>
                  <View style={sButton.label}>
                    <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                      Send invite
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
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.width(96) }}
      style={{ paddingBottom:0 }}
      visible={props.show}
      hide={props.hide}
    >
      {typeof(props.user) === 'undefined' || props.user === null ? <View/> : getUser() }
      {getConfirmation()}
    </Popups.Popup>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.width(),
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
    marginVertical:20,
  },
  avatar:
  {
    ...G.S.shadow(),
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
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
    paddingBottom:10,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(75),
    aspectRatio:4,
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
  