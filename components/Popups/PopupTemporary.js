import * as React from "react";
import { StyleSheet, View, Modal, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function PopupTemporary(props)
{
  const animationTime = 300;
  const [visible, setVisible] = React.useState(props.visible);
  const [time, setTime] = React.useState(props.time);
  const [message, setMessage] = React.useState(props.message);
  React.useEffect(() =>
  {
    setTime(props.time);
    setMessage(props.message);
    setVisible(props.visible);
    if (props.visible === true)
    {
      setTimeout(function()
      {
        setVisible(false);
        if(props.context?.displayMessageCallback)
          props.context.displayMessageCallback();
      }, time);
    }
  }, [props.visible, props.time, props.message]);

  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const [iconAnimation, setIconAnimation] = React.useState(new Animated.Value(0));
  React.useEffect(() =>
  {
    Animated.timing(animation,
    {
      toValue: visible === true ? 1 : 0,
      duration: animationTime,
    }).start(() =>
      {
        if(visible === false)
          props.hide();
        Animated.timing(iconAnimation,
        {
          toValue: visible === true ? 1 : 0,
          duration: animationTime/3,
        }).start();
      });
    return () => { animation.stopAnimation(); iconAnimation.stopAnimation(); };
  }, [visible]);
  
  const animationPosition = animation.interpolate({
    inputRange: [0, 0.75, 0.83, 1],
    outputRange: ["-10%", "6%", "4%", "2%"],
  });
  const animationIconRotation = iconAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["90deg", "0deg"],
  });
  const getAnimatedWindow = () =>
  {
    return (
      <Animated.View style={[s.popupFrame, {top:animationPosition}]}>
        <Animated.View style={[s.icon, {transform: [{ rotateX: animationIconRotation }]}]}>
          <Displayers.Icon
            name={props.icon ? props.icon : "check"}
            type="mci"
            size={28}
            color={G.Colors().Highlight()}
          />
        </Animated.View>
        <View style={s.message}>
          <Texts.Label>{message}</Texts.Label>
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.hide}
    >
      <Wrappers.PopupFrame transparent>
        <View style={s.modalBackground}>
          {getAnimatedWindow()}
        </View>
      </Wrappers.PopupFrame>
    </Modal>
  );
}

let s = StyleSheet.create({
  modalBackground:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent: "flex-start",
  },
  popupFrame:
  {
    ...G.S.center,
    height: 55,
    ...G.S.width(90),
    ...G.S.shadow(),
    position:'absolute',
    top:"2%",
    flexDirection:'row',
    padding: 5,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 100,
    borderWidth:0,
    borderColor:G.Colors().Neutral(),
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    //...G.S.shadow(),
    position:'absolute',
    left:5,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 100,
  },
  message:
  {
    ...G.S.center,
    flex:1,
  },
});
