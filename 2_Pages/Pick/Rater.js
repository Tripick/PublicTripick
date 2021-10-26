import React from "react";
import { StyleSheet, View, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Buttons from "../../Libs/Buttons";
// Components
import RaterSlider from "./RaterSlider";
import RatingPopup from "./RatingPopup";

export default function Rater(props)
{
  const [moved, setMoved] = React.useState(false);
  const [currentRating, setCurrentRating] = React.useState(0);
  const [rated, setRated] = React.useState(false);
  const onRate = (rating) =>
  {
    setMoved(false);
    setRated(true);
    animation.setValue(0);
    //loopAnimation.setValue(0);
    props.onRate(rating);
  }
  React.useEffect(() =>
  {
    if(rated === true)
      setRated(false);
  }, [rated]);
  
  const [loopAnimation, setLoopAnimation] = React.useState(new Animated.Value(0));
  // React.useEffect(() =>
  // {
  //   if(props.noEffects !== true)
  //   {
  //     Animated.loop(
  //       Animated.sequence([Animated.delay(1000), Animated.timing(loopAnimation, { toValue: 1, duration: 1500 })]),
  //       { iterations: 3 }
  //     ).start();
  //   }
  //   return () =>
  //   {
  //     animation.stopAnimation();
  //     loopAnimation.stopAnimation();
  //   };
  // }, []);

  const animationTime = 500;
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const onMove = (rating) =>
  {
    setCurrentRating(rating);
    if(moved === false)
    {
      setMoved(true);
      Animated.timing(animation,
      {
        toValue: 1,
        duration: animationTime,
      }).start();
    }
  };
  // const animationSphereColor = loopAnimation.interpolate({
  //   inputRange: [0, 0.5, 1],
  //   outputRange: [G.Colors().Foreground(0.3), G.Colors().Foreground(0.3), G.Colors().Foreground(0)],
  // });
  const animationOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Rating popup
  const [raterSize, setRaterSize] = React.useState(0);
  return (
    <View style={props.showRater === true ? s.container : G.S.hidden} onLayout={(event) => setRaterSize(event.nativeEvent.layout.height)}>
      <View style={s.ratingContainer}>
        <RatingPopup
          show={moved}
          rated={rated}
          currentRating={currentRating}
          currentIndex={props.index}
          existingPicksCount={props.existingPicksCount}
          raterSize={raterSize}
        />
      </View>
      <View style={[s.content, props.noBorder === true ? {borderWidth:0} : {}]}>
        <View style={s.contentFrame}>
          <View style={props.occupied === true ? G.S.hidden : s.raterContent}>
            <View style={s.inside}>
              {/* {moved === false ?
                <View style={s.sphereContainer}>
                  <Animated.View style={[s.sphere, {backgroundColor:animationSphereColor, transform: [{ scale: loopAnimation }]}]} />
                </View> :
                <View />
              } */}
              {rated === true ? <View/> : <RaterSlider onMove={onMove} onRate={onRate} />}
            </View>
            <Animated.View style={[s.button, {left:0, opacity:animationOpacity}]}>
              {props.index > 1 && props.noNextPrevious !== true ?
                <Buttons.Round
                  alignWidth
                  dark
                  noBackground
                  name="undo"
                  type="mci"
                  size={25}
                  color={G.Colors().Foreground()}
                  onPress={props.snapToPrevious}
                />
                :
                <View/>
              }
            </Animated.View>
            <Animated.View style={[s.button, {right:0, opacity:animationOpacity}]}>
              {props.index < props.totalPicksCount && props.noNextPrevious !== true ?
                <Buttons.Round
                  alignWidth
                  dark
                  noBackground
                  name="redo"
                  type="mci"
                  size={25}
                  color={G.Colors().Foreground()}
                  onPress={props.snapToNext}
                />
                :
                <View/>
              }
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5.5,
    paddingVertical:5,
    overflow: "visible",
    zIndex:1003,
  },
  ratingContainer:
  {
    ...G.S.center,
    overflow: "visible",
    zIndex:1000,
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection: "row",
    borderRadius: 100,
    backgroundColor: G.Colors().Highlight(),
    // borderWidth:2,
    // borderColor:G.Colors().Foreground(),
    zIndex:1003,
    overflow: "visible",
  },
  contentFrame:
  {
    ...G.S.center,
    ...G.S.full,
    overflow: "visible",
    //borderRadius: 100,
  },
  raterContent:
  {
    ...G.S.center,
    ...G.S.full,
    overflow: "visible",
  },
  button:
  {
    ...G.S.center,
    ...G.S.height(),
    position:'absolute',
    aspectRatio:1,
    zIndex:2,
  },
  inside:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
    zIndex:1,
    overflow: "visible",
  },
  sphereContainer:
  {
    ...G.S.center,
    ...G.S.full,
    position: "absolute",
    borderRadius: 100,
    overflow: "visible",
  },
  sphere:
  {
    ...G.S.center,
    ...G.S.width(50),
    aspectRatio:1,
    backgroundColor: G.Colors().Foreground(0.1),
    borderRadius: 100,
    overflow: "visible",
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(70),
    position: "absolute",
    top:"42%",
    height: 5,
    backgroundColor: G.Colors().Foreground(0.1),
    borderRadius: 60,
  },
  title:
  {
    ...G.S.width(),
  },
});
