import React from "react";
import { StyleSheet, View, Image } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default function Comment(props)
{
  // const getPoints = () => (
  //   <View style={s.pointsContainer}>
  //     <View style={s.pointsSquare}>
  //       <Buttons.Round
  //         alignWidth
  //         name="angle-up"
  //         type="fa"
  //         size={20}
  //         dark
  //         noBackground
  //         style={{ marginTop: -3 }}
  //       />
  //     </View>
  //     <View style={s.pointsSquare}>
  //       <Texts.Label
  //         singleLine
  //         style={props.data.points > 10000 ? { fontSize: 12 } : {}}
  //       >
  //         {props.data.points}
  //       </Texts.Label>
  //     </View>
  //     <View style={s.pointsSquare}>
  //       <Buttons.Round
  //         name="angle-down"
  //         type="fa"
  //         size={20}
  //         dark
  //         noBackground
  //         style={{ marginTop: -4 }}
  //       />
  //     </View>
  //     <View style={[s.pointsSquare, { position: "absolute", bottom: 8 }]}>
  //       <Buttons.LabelMini
  //         dark
  //         backgroundBright
  //         style={{ fontSize: 8, padding: 3 }}
  //         contentStyle={{ paddingHorizontal: 3 }}
  //       >
  //         Report
  //       </Buttons.LabelMini>
  //     </View>
  //   </View>
  // );

  const getText = () =>
  (
    <View style={s.textContainer}>
      <Texts.Label style={s.text}>
        {props.data?.message}
      </Texts.Label>
    </View>
  );

  const getAuthor = () =>
  {
    const photo = props.data?.author?.photo &&
    props.data?.author?.photo !== null &&
    typeof(props.data?.author?.photo) != 'undefined'&&
    props.data?.author?.photo.image !== null &&
    typeof(props.data?.author?.photo.image) != 'undefined' ? props.data?.author?.photo.image : "_";
    return (
      <View style={s.authorContainer}>
        <View style={s.avatarContainer}>
          <View style={s.avatar}>
            <Image
              source={{ uri:photo }}
              style={s.avatarImage}
              resizeMode='cover'
            />
          </View> 
        </View>
        <View style={s.nameRating}>
          <View style={s.name}>
            <Texts.Label left singleLine style={s.authorText}>
              {props.data?.author?.userName}
            </Texts.Label>
          </View>
          <View style={s.ratingAndDate}>
            <View style={s.rating}>
              {Platform.OS == "android" ? 
                <Displayers.Rating noValue iconSize={15} value={props.data?.rating} />
                :
                <Displayers.RatingIos noValue iconSize={15} value={props.data?.rating} />
              }
            </View>
            <View style={s.date}>
              <Texts.Label right singleLine style={s.ratingDateText}>
                {G.Functions.dateToText(props.data.creationDate, "MMM Do YYYY")}
              </Texts.Label>
            </View>
          </View>
          {/* <View style={s.rank}>
            <Texts.Label singleLine style={s.authorText}>
              {props.data.rank}
            </Texts.Label>
          </View> */}
        </View>
      </View>
    );
  };

  return (
    <View>
      <Displayers.Separator aspectRatio={12} />
      <View style={s.title}>
        {getAuthor()}
      </View>
      <View style={s.message}>
        {getText()}
        {/* {getPoints()} */}
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    marginTop:-10,
  },
  authorContainer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection: "row",
  },
  avatarContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    padding:5,
  },
  avatar:
  {
    ...G.S.center,
    ...G.S.full,
    ...G.S.shadow(3),
    borderRadius: 100,
    overflow:'visible',
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  avatarImage:
  {
    ...G.S.height(),
    borderRadius: 100,
    aspectRatio:1
  },
  nameRating:
  {
    ...G.S.center,
    flex:1,
    paddingVertical:"3%",
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingLeft:6,
  },
  authorText:
  {
    ...G.S.width(),
    fontSize: 14,
    fontWeight:'bold',
    color:G.Colors().Highlight(),
  },
  ratingAndDate:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    flexDirection: "row",
  },
  rating:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 4,
  },
  date:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  ratingDateText:
  {
    ...G.S.width(),
    fontSize: 12,
    paddingRight:10,
    color:G.Colors().Neutral(0.6),
  },

  message:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  textContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent: "flex-start",
    paddingHorizontal: "2%",
  },
  text:
  {
    ...G.S.width(),
    minHeight: 40,
    //maxHeight: 140,
    paddingHorizontal: 10,
    fontSize: 14,
    lineHeight: 25,
    textAlign: "justify",
    textAlignVertical: "top",
    color:G.Colors().Neutral(0.8),
  },

  pointsContainer:
  {
    ...G.S.center,
    flex: 1,
    ...G.S.height(),
    justifyContent: "flex-start",
    marginRight: 5,
  },
  pointsSquare:
  {
    ...G.S.width(),
    aspectRatio: 1.7,
  },
  
  
  rank:
  {
    ...G.S.width(),
    ...G.S.center,
    aspectRatio: 5,
  },
});
