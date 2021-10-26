import React from "react";
import { StyleSheet, View, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function NoPick(props)
{
  const options = [
    { label:"Change filters", icon:"filter", iconLink:"chevron-right", type:"mci", action:() => { props.showFilters(); }, },
    { label:"View my Picks", image:G.Images.picksIcon, icon:"cog", iconLink:"chevron-right", type:"mci", action:() => { props.goToPicksList(); }, },
    { label:"Back to my Trip", icon:"compass-rose", iconLink:"chevron-right", type:"mci", action:() => { props.goToTrip(); }, },
  ];

  const getOption = (option, index) =>
  {
    return (
      <View key={index} style={o.container}>
        <Displayers.Touchable onPress={option.action}>
          <View style={o.content}>
            <View style={o.icon}>
              {option.image ?
                <Image
                  source={option.image}
                  style={{ height: 32, width: 32 }}
                  imageStyle={{ resizeMode: "contain" }}
                /> :
                <Displayers.Icon
                  alignWidth
                  dark
                  noBackground
                  name={option.icon}
                  type={option.type}
                  size={30}
                  color={option.color ? option.color : G.Colors().Highlight(0.8)}
                />
              }
            </View>
            <View style={o.label}>
              <Texts.Label left style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Highlight() }}>
                {option.label}
              </Texts.Label>
            </View>
            <View style={o.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name={option.iconLink}
                type={option.type}
                size={20}
                color={G.Colors().Highlight(0.5)}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.content}>
        <View style={s.header}>
          <View style={s.photo}>
            <Displayers.Icon
              alignWidth
              dark
              noBackground
              name="map-marker-off-outline"
              type="mci"
              size={80}
              color={G.Colors().Foreground()}
            />
          </View>
          <View style={s.name}>
            <Texts.Label singleLine style={{ color:G.Colors().Foreground(), fontSize: 16, paddingHorizontal:10 }}>
              No more places match your filters
            </Texts.Label>
            <Texts.Label style={{ color:G.Colors().Foreground(0.6), fontSize: 11 }}>
              What do you want to do?
            </Texts.Label>
          </View>
        </View>
        <View style={s.options}>
          {options.map((option, index) => getOption(option, index))}
        </View>
      </View>
   </View>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  frame:
  {
    ...G.S.full,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    backgroundColor:G.Colors().Background(0.5),
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    position:'absolute',
    top:0,
    right:0,
    paddingBottom:"5%",
    backgroundColor:G.Colors().Highlight(),
  },

  header:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
  },
  photo:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
  },
  avatar:
  {
    ...G.S.shadow(5),
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
  },

  options:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
  },

  appInfos:
  {
    ...G.S.center,
    ...G.S.width(),
    position:'absolute',
    bottom:0,
    aspectRatio:2,
    marginTop:50,
  },
  
});

const o = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(80),
    padding:7,
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
    ...G.S.shadow(),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
    marginTop:10,
    borderRadius:100,
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
    paddingLeft: 5,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: "4%",
    position:'absolute',
    right:0,
  },
});