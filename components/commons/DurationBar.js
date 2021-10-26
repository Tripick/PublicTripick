import React from "react";
import { StyleSheet, View, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function DurationBar(props)
{
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  React.useEffect(() =>
  {
    if(props.isStarted === true)
    {
      Animated.timing(animation,
      {
        toValue: 1,
        duration: props.duration,
      }).start(() => { props.hide() });
    }
    return () => { animation.stopAnimation(); };
  }, [props.isStarted]);
  const animationWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "0%"],
  });

  if (props.isVisible === true)
  {
    return (
      <View style={[s.container, props.opaque ? {backgroundColor: G.Colors().Foreground()} : {}]}>
        <View style={[s.bar, props.opaque ? {backgroundColor: G.Colors().Background()} : {}]}>
          <Animated.View style={[s.filling, {left:animationWidth}]} />
        </View>
      </View>
    );
  }
  return <View />;
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.full,
    ...G.S.center,
    position: "absolute",
    backgroundColor: G.Colors().Foreground(0.6),
  },
  bar:
  {
    ...G.S.center,
    height:8,
    ...G.S.width(70),
    position: "absolute",
    flexDirection:'row',
    justifyContent:'flex-start',
    backgroundColor:G.Colors().Foreground(),
    borderRadius:20,
  },
  filling:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(),
    position: "absolute",
    left:"-100%",
    backgroundColor:G.Colors().Highlight(),
  }
});
