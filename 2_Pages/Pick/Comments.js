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
// Components
import Comment from "./Comment";

export default function Comments(props)
{
  const getComments = () =>
  {
    props.reviews.map((comment, index) =>
    {
      // Don't show the user's review in the list
      //return (<Comment key={index} data={comment} expandable={false} />);
      if(comment?.idAuthor === props.user.id)
      {
        return (<View key={index} />);
      }
      else
      {
        return (<Comment key={index} data={comment} expandable={false} />);
      }
    });
  };

  return (
    <View style={s.container}>
      {getComments()}
      {props.reviews.length !== 0 ? <Buttons.LoadMore onPress={() => console.log("Load more !")} message="Load more comments"/> : <View/>}
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.width(),
    overflow: "hidden",
  },
});
