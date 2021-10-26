import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";

export default function Guides(props)
{
  const [context, setContext] = React.useContext(AppContext);

  const getGuide = (guide, index) =>
  {
    return (
      <View key={index} style={s.guideContainer}>
        <View style={s.guide}>
          <Displayers.BackgroundImage source={{ uri: guide.Image }} />
          <View style={s.guideTitle}>
            <View style={s.guideTitleText}>
              <Texts.Label style={{ fontSize: 14 }} numberOfLines={1}>
                {guide.Name}
              </Texts.Label>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.labelWithButton}>
        <View style={s.labelAndIcon}>
          <View style={s.iconLabel}>
            <Displayers.Icon
              alignWidth
              dark
              noBackground
              name="book-open-page-variant"
              type="mci"
              size={25}
              color={G.Colors().Neutral(0.5)}
            />
          </View>
          <View style={s.label}>
            <Texts.Label
              left
              style={{ fontSize: 18, color: G.Colors().Neutral(0.6) }}
            >
              Recommended guides
            </Texts.Label>
          </View>
        </View>
        <View style={s.buttonAction}>
          <Buttons.Label
            alignWidth
            shadow
            backgroundHighlight
            color={G.Colors().Foreground()}
            //onPress={() => console.log("Explore guides")}
            onPress={() => props.goTo("Homepage")}
            style={{ ...G.S.full, }}
            contentStyle={{ ...G.S.full, paddingBottom:1, borderWidth:1, borderColor:G.Colors().Foreground(), }}
            chevron={true}
            chevronSize={15}
            chevronStyle={{  }}
            chevronIcon="map-search"
          >
            <Text style={{ fontSize: 12, color:G.Colors().Foreground() }}>Explore</Text>
          </Buttons.Label>
        </View>
      </View>
      <View style={s.list}>
        {props.guides.map((guide, index) => getGuide(guide, index))}
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginVertical: "5%",
  },
  labelWithButton:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    aspectRatio: 8,
    paddingHorizontal: "3%",
  },
  labelAndIcon:
  {
    ...G.S.center,
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  iconLabel:
  {
    ...G.S.center,
    marginRight: "3%",
    paddingHorizontal: 3,
  },
  label:
  {
    ...G.S.center,
    paddingBottom: 2,
  },
  buttonAction:
  {
    ...G.S.center,
    ...G.S.height(90),
    position:'absolute',
    right:0,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: 15,
    position:'absolute',
    right:0,
  },
  list:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    marginTop: 10,
  },
  guideContainer:
  {
    ...G.S.center,
    ...G.S.width(50),
    padding: 5,
    paddingHorizontal: 5,
  },
  guide:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.width(),
    aspectRatio: 0.8,
    borderRadius: 12,
    justifyContent: "flex-end",
    alignContent: "flex-end",
  },
  guideTitle:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 4,
    backgroundColor: G.Colors().Foreground(),
  },
  guideTitleText:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1.5,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
});
