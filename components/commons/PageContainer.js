import * as React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function PageContainer(props) {
  return (
    // <ImageBackground
    //   source={require("...")}
    //   style={s.background}
    //   imageStyle={s.backgroundImage}
    // >
    //   <View style={s.root}>{props.children}</View>
    // </ImageBackground>
    <View style={s.root}>{props.children}</View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: G.Colors().Background() },
  // background: { flex: 1 },
  // backgroundImage: { resizeMode: "cover" }
});
