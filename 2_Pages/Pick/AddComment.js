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
// Components
import Review from "./Review";

export default function AddComment(props)
{
  const [review, setReview] = React.useState(null);
  const loadUserReview = () =>
  {
    let userReviews = props.reviews.filter(r => r?.idAuthor === props.user.id);
    if(userReviews !== null && userReviews.length > 0 && userReviews[0] !== null)
      setReview(userReviews[0]);
  };
  React.useEffect(() => { loadUserReview(); }, [props.reviews]);

  return (
    <View style={s.container}>
      <View style={s.title}>
        <View style={s.avatarContainer}>
          <View style={s.avatar}>
            <Image
              source={{
                uri: props.user.photo && props.user.photo !== null && typeof(props.user.photo) != 'undefined' &&
                props.user.photo.image !== null && typeof(props.user.photo.image) != 'undefined' ? props.user.photo.image : "_"}}
              style={s.avatarImage}
              resizeMode='cover'
            />
          </View> 
        </View>
        <View style={s.nameRating}>
          <View style={s.name}>
            <Texts.Label left singleLine style={s.authorText}>
              {props.user.userName}
            </Texts.Label>
          </View>
          <View style={s.ratingAndDate}>
            <View style={s.rating}>
              {Platform.OS == "android" ? 
                <Displayers.Rating noValue iconSize={30} value={review?.rating ? review?.rating : -1} />
                :
                <Displayers.RatingIos noValue iconSize={30} value={review?.rating ? review?.rating : -1} />
              }
            </View>
            <Displayers.TouchableOverlay onPress={() => props.setShowPopup(true)}/>
          </View>
          <View style={s.messageContainer}>
            <View style={s.message}>
              <Texts.Label left style={{ fontSize: 14, color:G.Colors().Neutral(0.8) }}>
                {review?.message ? review?.message : ""}
              </Texts.Label>
            </View>
            <Displayers.TouchableOverlay onPress={() => props.setShowPopup(true)}/>
          </View>
        </View>
      </View>
      <Review
        mode="Review"
        show={props.showPopup}
        hide={() => props.setShowPopup(false)}
        save={props.saveComment}
        rating={review?.rating ? review?.rating : -1}
        message={review?.message ? review?.message : ""}
        flags={review?.flags ? review?.flags : []}
        pictures={review?.pictures ? review?.pictures : []}
      />
    </View>
  );
  
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
  },
  avatarContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    padding:5,
  },
  avatar:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
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
    ...G.S.width(),
  },
  name:
  {
    ...G.S.center,
    paddingBottom:5,
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
    ...G.S.width(80),
    marginTop:10,
  },
  rating:
  {
    ...G.S.center,
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
  messageContainer:
  {
    ...G.S.center,
    ...G.S.width(85),
    paddingVertical:15,
  },
  message:
  {
    ...G.S.center,
    ...G.S.width(),
  },
});
