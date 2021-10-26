import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Wrappers from "../../Libs/Wrappers";

export default function Account({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const options = [
    { label:"Modify my information", icon:"account", type:"mci", action:() => { console.log("My account!")}, },
    { label:"Friends", icon:"account-group", type:"mci", action:() => { console.log("Friends!")}, },
    { label:"Notifications", icon:"bell-ring", type:"mci", action:() => { console.log("Notifications!")}, },
    { label:"Settings", icon:"cog", type:"mci", action:() => { console.log("Settings!")}, },
    { label:"Log out", icon:"logout", type:"mci", action:() => context.functions.logout(context.userContext.user.userName), textColor:G.Colors().Foreground(), color:G.Colors().Fatal },
  ];

  const getOption = (option, index) =>
  {
    return (
      <View key={index} style={o.container}>
        <Displayers.Touchable onPress={option.action}>
          <View style={[o.content, {backgroundColor:(option.color ? option.color : G.Colors().Highlight())}]}>
            <View style={o.icon}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name={option.icon}
                type={option.type}
                size={20}
                color={option.textColor ? option.textColor : G.Colors().Foreground()}
              />
            </View>
            <View style={o.label}>
              <Texts.Label left style={{ ...G.S.width(), fontSize: 14, color: (option.textColor ? option.textColor : G.Colors().Foreground()) }}>
                {option.label}
              </Texts.Label>
            </View>
            <View style={o.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={option.textColor ? option.textColor : G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  }

  return (
    <Wrappers.AppFrame>
      <View style={{...G.S.width(), flex:1}}>
        {typeof(context.userContext) === 'undefined' || context.userContext === null ?
          <View/>
          :
          <ScrollView showsVerticalScrollIndicator={false} style={s.container} contentContainerStyle={{...G.S.center}}>
            <View style={s.header}>
              <View style={s.photo}>
                <Buttons.RoundImage
                  onPress={() => {}}
                  contentStyle={s.avatar}
                  image={context.userContext.user.photo.image}
                />
              </View>
              <View style={s.name}>
                <Texts.Label singleLine style={{ color:G.Colors().Highlight(), fontSize: 16, paddingHorizontal:10, paddingTop:10 }}>
                  {context.userContext.user.userName}
                </Texts.Label>
              </View>
            </View>
            <View style={s.options}>
              {options.map((option, index) => getOption(option, index))}
            </View>
            <View style={s.appInfos}>
              <Texts.Label style={{ fontSize: 12, color:G.Colors().Grey() }}>
                {"Tripick - Version 1.203\nCopyright 2022 - All rights reserved"}
              </Texts.Label>
            </View>
          </ScrollView>
        }
      </View>
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.full,
  },
  header:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    marginTop:20,
  },
  photo:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
  },
  avatar:
  {
    ...G.S.shadow(),
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Background(),
    overflow:'visible'
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent:'flex-start',
  },

  options:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
    flex:1,
  },

  appInfos:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:50,
    marginBottom:20,
  },
  
});

const o = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(75),
    padding:6,
  },
  separator:
  {
    ...G.S.center,
    ...G.S.width(70),
    height:0,
    borderTopWidth:1,
    borderColor:G.Colors().Foreground(0.5),
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:5.5,
    marginTop:5,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Foreground(),
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
    paddingBottom: 2,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: "3%",
    position:'absolute',
    right:0,
  },
});