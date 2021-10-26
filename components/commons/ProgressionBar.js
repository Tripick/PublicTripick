import React from "react";
import { StyleSheet, View, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function ProgressionBar(props)
{
  const [step, setStep] = React.useState(0);
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  let anims = [];
  let interps = [];
  for(var i = 0; i <= props.steps; i++)
  {
    anims.push(i);
    interps.push("-"+(100 - (100 / props.steps) * i)+"%");
  }
  let interpolation = animation.interpolate({inputRange: anims, outputRange: interps});

  const progressTo = (stepToProgress) =>
  {
    setStep(stepToProgress);
    Animated.timing(animation,
    {
      toValue: stepToProgress,
      duration: 300,
    }).start();
  };

  React.useEffect(() =>
  {
    if(props.currentStep === props.steps)
      props.hide();
    else
      progressTo(props.currentStep);
    return () => { animation.stopAnimation(); };
  }, [props.currentStep]);

  if (props.isVisible === true)
  {
    return (
      <View style={s.container}>
        <View style={s.bar}>
          <Animated.View style={[s.filling, {left:interpolation}]} />
        </View>
      </View>
    );
  }
  return <View />;
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.width(70),
    ...G.S.center,
    position: "absolute",
  },
  bar:
  {
    ...G.S.center,
    height:8,
    ...G.S.width(),
    flexDirection:'row',
    justifyContent:'flex-start',
    backgroundColor:G.Colors().Background(),
    borderRadius:20,
  },
  filling:
  {
    ...G.S.center,
    ...G.S.full,
    position: "absolute",
    left:"-100%",
    backgroundColor:G.Colors().Highlight(),
  }
});
