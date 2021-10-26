import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";

export default function PageHeader(props) {
  return (
    <View style={s.container}>
      <Texts.Title style={s.title}>{props.title}</Texts.Title>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    ...G.S.center,
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
  },
});
