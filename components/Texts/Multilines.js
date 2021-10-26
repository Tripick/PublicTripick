import * as React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Multilines(props) {
  return (
    <View style={s.container}>
      <ScrollView
        style={[{ marginTop: -2 }, props.containerStyle]}
        centerContent="true"
        contentContainerStyle={{
          ...G.S.center,
          flexGrow: 1,
        }}
      >
        {props.title ? props.title : <View />}
        <Text
          {...props}
          style={[
            s.text,
            {
              fontFamily:
                props.style && props.style.fontFamily
                  ? props.style.fontFamily
                  : "multilines",
            },
            props.style,
          ]}
        />
      </ScrollView>
    </View>
  );
}

const s = {
  container: {
    flex: 1,
    overflow: "hidden",
  },
  text: {
    textAlign: "justify",
    color: G.Colors().Neutral(),
  },
};
