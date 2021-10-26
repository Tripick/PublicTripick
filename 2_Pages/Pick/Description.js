import React from "react";
import { StyleSheet, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default function Description(props)
{
  const [expandDescr, setExpandDescr] = React.useState(false);
  const expandButtonHeight = G.Layout.window.width / 12;

  const getDescr = () =>
  {
    return props.place.description === null || typeof(props.place.description) === "undefined" ?
      "This place does not have a description yet." :
      props.place.description;
  }

  const getLabel = () => (
    <Texts.Label style={s.descr}>
      {getDescr()}
    </Texts.Label>
  );

  return props.expandable === 'true' ? (
    <View style={expandDescr ? {} : { maxHeight: 250, overflow:'hidden' }}>
      {getLabel()}
      {getDescr().length > 500 ? 
        <Buttons.Expand
          noIcon
          height={expandButtonHeight}
          isExpanded={expandDescr}
          toggle={() => setExpandDescr(!expandDescr)}
        /> :
        <View/>
      }
    </View>
  ) : (
    getLabel()
  );
}

let s = StyleSheet.create(
{
  descr:
  {
    textAlign: "justify",
    fontSize: 14,
    lineHeight: 25,
    marginVertical: 10,
    marginTop: 3,
    paddingHorizontal: 20,
    color:G.Colors().Neutral(0.7),
  },
});
