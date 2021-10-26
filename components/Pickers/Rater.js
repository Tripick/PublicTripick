import React, { Component } from 'react';
import { View, Image, StyleSheet, PanResponder, Animated } from 'react-native';
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Inputs from "../../Libs/Inputs";
import * as Displayers from "../../Libs/Displayers";

export default class Rater extends Component
{
  icon = G.Images.picksIcon;
  inactiveIcon = G.Images.picksIconDisabled;

  constructor(props)
  {
    super(props);
    let position = new Animated.ValueXY();
    const panResponder = PanResponder.create(
    {
       onStartShouldSetPanResponder: () => true,
       onPanResponderMove: (event, gesture) =>
       {
          const draggableSize = G.Layout.window.width / 8;
          let pos = Math.min((G.Layout.window.width / 2) - (G.Layout.window.width * 0.1) - draggableSize, gesture.dx);
          if(gesture.dx < 0)
            pos = Math.max((-G.Layout.window.width / 2) + (G.Layout.window.width * 0.1) + draggableSize , gesture.dx);
          position.setValue({ x: pos, y: 0 });
          this.getRating(pos + (G.Layout.window.width / 2) - (G.Layout.window.width * 0.1));
       },
       onPanResponderRelease: (evt, gestureState) =>
       {
          position.setValue({ x: 0, y: 0 });
          this.setState({ ...this.state, everMoved: false });
          this.props.onRate(this.state.currentRating);
       }
    });

    this.state =
    {
      panResponder,
      position,
      currentRating: 2.5,
      everMoved: false,
      //animation: new Animated.Value(0),
    };
 }

//  startAnimation = () =>
//  {
//   Animated.timing(this.state.animation,
//   {
//     toValue: 1,
//     duration: 200,
//   }).start();
//  }

 getRating(x)
 {
   const stepWidth = (G.Layout.window.width * 0.8) / 8;
   const stepValue = Math.trunc(x / stepWidth) - 1;
   this.props.onMove();
   this.setState({ ...this.state, everMoved: true, currentRating: stepValue });
 }
 getLabel(val)
 {
   if (val === 0) return "No";
   if (val === 1) return "Okay";
   if (val === 2) return "Nice";
   if (val === 2.5) return "How does it look?";
   if (val === 3) return "Great";
   if (val === 4) return "Amazing";
   if (val === 5) return "Fabulous!";
   return "Okay";
 }

 render()
 {
    // let animationColor = this.state.animation.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [G.Colors().Transparent, G.Colors().Highlight()],
    // });
    let handles = this.state.panResponder.panHandlers;
    return (
      <View style={s.mainContainer}>
        <Animated.View style={[s.draggable, this.state.position.getLayout()]} {...handles}>
          <View style={s.circle}>
            <View style={{...G.S.height(), ...G.S.center, width: "80%", paddingBottom:3}} >
              <Image source={this.icon} style={s.icon} />
            </View>
          </View>
        </Animated.View>
        {this.state.everMoved === true ? (
          <View style={s.indicatorContainer}>
            <View style={s.indicator}>
              <View style={s.arrow} />
              <View style={{ ...G.S.full, ...G.S.center, backgroundColor: G.Colors().Foreground(), }}>
                <View style={{ flex: 1, marginTop: 5 }}>
                  <Texts.Label style={s.indicatorText}>
                    {this.getLabel(this.state.currentRating)}
                  </Texts.Label>
                </View>
                <View style={{ flex: 1, marginBottom: 5 }}>
                  {Platform.OS == "android" ?
                    <Displayers.Rating
                      iconSize={40}
                      noValue
                      value={this.state.currentRating - 1}
                      activeImage={this.icon}
                      inactiveImage={this.inactiveIcon}
                    />
                    :
                    <Displayers.RatingIos
                      iconSize={40}
                      noValue
                      value={this.state.currentRating - 1}
                      activeImage={this.icon}
                      inactiveImage={this.inactiveIcon}
                    />
                  }
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
 }
}

const s = StyleSheet.create({
  mainContainer:
  {
    ...G.S.height(),
    ...G.S.center,
    overflow: "visible",
    flexDirection: "row",
  },
  draggable:
  {
    ...G.S.center,
    ...G.S.height(90),
    aspectRatio:1,
    borderRadius:100,
    overflow: "visible",
  },
  pan:
  {
    position: "absolute",
    left: 0,
    justifyContent: "flex-end",
    overflow: "visible",
  },
  circle:
  {
    ...G.S.shadow(),
    ...G.S.center,
    flexDirection: "row",
    aspectRatio: 1,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 60,
    borderWidth: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: G.Colors().Important(0.2),
    overflow: "visible",
  },
  icon:
  {
    ...G.S.full,
    marginTop: 3,
    resizeMode: "contain",
  },
  indicatorContainer:
  {
    ...G.S.center,
    overflow: "visible",
    position: "absolute",
    top: "-230%",
    height: "230%",
    paddingTop: 40,
  },
  indicator:
  {
    ...G.S.height(),
    ...G.S.shadow(),
    ...G.S.center,
    overflow: "visible",
    flexDirection: "row",
    marginBottom: 40,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 15,
    borderWidth: 0,
    borderColor: G.Colors().Important(0.4),
  },
  indicatorText:
  {
    ...G.S.full,
    fontSize: 16,
  },
  arrow:
  {
    position: "absolute",
    bottom: -10,
    height: 40,
    width: 40,
    transform: [{ rotateZ: "45deg" }],
    backgroundColor: G.Colors().Foreground(),
    borderWidth: 1,
    borderColor: G.Colors().Important(0.2),
  },
});
