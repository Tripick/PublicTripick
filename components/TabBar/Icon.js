import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Icon(props) {
  let icon = { type: null, name: "md-person" };
  if (props.name === "Trips") icon = { type: "mci", name: "compass-rose" };
  if (props.name === "Guides") icon = { type: null, name: "md-map" };
  if (props.name === "Contribute")
    icon = { type: "mci", name: "map-marker-plus" };
  if (props.name === "Search") icon = { type: "fa", name: "search-location" };
  if (props.name === "Account") icon = { type: "mci", name: "account-outline" };
  return (
    <View>
      <View
        style={{
          ...G.S.center,
        }}
      >
        <View
          style={{
            ...G.S.center,
            flexDirection: "row",
          }}
        >
          <Displayers.Icon
            type={icon.type}
            name={icon.name}
            size={24}
            color={
              props.focused ? G.Colors().Highlight() : G.Colors().Important(0.4)
            }
          />
        </View>
      </View>
      <View
        style={{
          ...G.S.center,
        }}
      >
        <Texts.Title
          style={[
            s.tabLabel,
            {
              color: props.focused
                ? G.Colors().Highlight()
                : G.Colors().Important(0.4),
            },
          ]}
        >
          {props.name}
        </Texts.Title>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  tabLabel: {
    textAlignVertical: "top",
    fontSize: 12,
    fontFamily: "title",
  },
});
