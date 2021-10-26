import React from "react";
import {StyleSheet, View} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function PickThumbnail(props)
{
  if (typeof props.pick === "undefined" || props.pick === null)
    return <View />;

  return (
    <View style={s.container} >
      <View style={[s.content]}>
        <View style={s.contentFrame}>
          <View style={s.header}>
            <View style={s.headerFrame}>
              <View style={s.title}>
                <Texts.Label style={{ ...G.S.width(), fontSize: 16, color:G.Colors().Highlight() }} numberOfLines={1} >
                  {props.pick.place.nameTranslated}
                </Texts.Label>
              </View>
              <View style={s.rating}>
                {Platform.OS == "android" ?
                  <Displayers.Rating
                    iconSize={20}
                    votes={-1}
                    value={props.pick.rating}
                    activeImage={G.Images.picksIconMini}
                    inactiveImage={G.Images.picksIconDisabledMini}
                  />
                  :
                  <Displayers.RatingIos
                    iconSize={20}
                    votes={-1}
                    value={props.pick.rating}
                    activeImage={G.Images.picksIconMini}
                    inactiveImage={G.Images.picksIconDisabledMini}
                  />
                }
              </View>
              <View style={s.chevron}>
                <Displayers.Icon
                  alignWidth
                  name="chevron-right"
                  type="mci"
                  size={25}
                  color={G.Colors().Highlight()}
                />
              </View>
              <Displayers.TouchableOverlay onPress={() => props.onPickClick(props.pick.idPlace)} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical: 8,
    paddingHorizontal: 10,
    overflow:'visible',
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    borderRadius: 100,
    overflow:'visible',
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.width(),
    borderRadius: 100,
    backgroundColor:G.Colors().Foreground(),
  },
  header:
  {
    ...G.S.center,
    ...G.S.width(),
    zIndex:3,
  },
  headerFrame:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    maxWidth:"100%",
    flex:1.5,
    paddingLeft: 15,
    paddingRight: 30,
  },
  rating:
  {
    ...G.S.center,
    flex:1,
    marginTop:-5,
    marginBottom:5,
  },
  chevron:
  {
    ...G.S.center,
    position:'absolute',
    right:10,
    paddingLeft:1,
  },
});
