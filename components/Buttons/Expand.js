import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";

export default function Expand(props)
{
  return (
    <View style={[s.container, { height: props.height }]}>
      <TouchableWithoutFeedback onPress={props.toggle}>
        <Texts.Label style={s.viewMore}>View {props.isExpanded === true ? "less" : "more"}</Texts.Label>
      </TouchableWithoutFeedback>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.width(),
    position: "absolute",
    bottom: 0,
  },
  viewMore:
  {
    position: "absolute",
    right: 10,
    marginTop:-10,
    padding:15,
    borderRadius:100,
    color:G.Colors().Highlight(),
    fontWeight:'bold',
    backgroundColor:G.Colors().Foreground()
  }
});
