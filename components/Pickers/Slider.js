import React from "react";
import { StyleSheet, View, PanResponder, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Slider(props)
{
  // ------------------ OPTIONS ------------------------ //
  const name = props.name;
  const icon = props.icon;
  const type = props.type;
  const minBoundary = props.boundaryMin;
  const maxBoundary = props.boundaryMax;
  const initVal = props.initVal;

  // ----------------- Variables ----------------------- //

  const pan = React.useRef(new Animated.ValueXY()).current;
  const [forceRender, setForceRender] = React.useState(0);
  const animState = React.useRef(
  {
    displayMinVal:0,
    sliderWidth:0,
    stepWidth:0,
    minBoundary:0,
    maxBoundary:0,
    minBoundaryPosition:0,
    maxBoundaryPosition:0,
    offSet: 0,
    clampOffSet: 0,
    initOffSet: 0,
  }).current;

  const [sliderHeight, setSliderHeight] = React.useState(0);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [sliderCenter, setSliderCenter] = React.useState(0);
  const [initOffset, setInitOffset] = React.useState(0);
  const [minBoundaryPosition, setMinBoundaryPosition] = React.useState(0);
  const [maxBoundaryPosition, setMaxBoundaryPosition] = React.useState(0);
  const setSliderSize = (height, width) =>
  {
    setSliderHeight(height);
    const sWidth = width - height // - height : Avoid the slider to overlap the borders
    setSliderWidth(sWidth);
    animState.sliderHeight = height;
    animState.sliderWidth = sWidth;
    const stepWidth = sWidth / (maxBoundary - minBoundary);
    animState.stepWidth = stepWidth;
    animState.minBoundary = minBoundary;
    animState.maxBoundary = maxBoundary;

    const center = sWidth / 2;
    setSliderCenter(center);
    const initOff = (initVal - ((maxBoundary - minBoundary) / 2)) * stepWidth;
    setInitOffset(initOff);
    animState.initOffSet = initOff;
    animState.minBoundaryPosition = (-sWidth / 2) - initOff;
    animState.maxBoundaryPosition = (sWidth / 2) - initOff;
    setMinBoundaryPosition((-sWidth / 2) - initOff);
    setMaxBoundaryPosition((sWidth / 2) - initOff);

    placeSlider();
  };

  const placeSlider = () =>
  {
    const newVal =
      pan.x._value +
      animState.offSet +
      animState.initOffSet -
      animState.clampOffSet;
    setForceRender(newVal); // Update the state so the render function is called (and elements are updated on screen)
    
    let filterVal = Math.trunc((newVal + animState.sliderWidth/2 + animState.stepWidth/2) / animState.stepWidth);
    filterVal = Math.min(maxBoundary, filterVal);
    filterVal = Math.max(minBoundary, filterVal);
    animState.displayMinVal = filterVal;
  };

  const getPanResponder = () =>
  {
    return PanResponder.create(
    {
        onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
        onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () =>
        {
          const clamp = Math.max(animState.minBoundaryPosition, Math.min(animState.maxBoundaryPosition, pan.x._value));
          animState.clampOffSet = animState.clampOffSet + pan.x._value - clamp;
          pan.setOffset({x:clamp, y:0});
        },
        onPanResponderMove: (e, gesture) =>
        {
          placeSlider();
          Animated.event([null, { dx: pan.x, dy: pan.y }], {})(e, {dx:gesture.dx, dy:0});
          // Apply values
          props.onLiveValue(animState.displayMinVal);
        },
        onPanResponderRelease: (e, gesture) =>
        {
          animState.offSet = animState.offSet + pan.x._value;
          pan.flattenOffset();
          // Apply values
          props.onSetValue(animState.displayMinVal);
        }
    });
  };
  const [panResponder, setPanResponder] = React.useState(getPanResponder());

  const stepRender = (value, step = 5) => { if(step === 0) return 0; else return Math.trunc(value/step) * step; };

  return (
    <View style={s.mainContainer}>
      <View style={s.container}>
        {props.numberDisplay === true ? 
          <View style={s.labelValue}>
            <Texts.Label style={s.labelValueText}>{animState.displayMinVal}</Texts.Label>
          </View>
          :
          <View/>
        }
        <View
          style={s.sliderContainer}
          onLayout={(event) => setSliderSize(event.nativeEvent.layout.height, event.nativeEvent.layout.width)}
        >
          <View style={s.lineContainer}>
            <Animated.View style={[
              s.line,
              [{ translateX: pan.x.interpolate(
                {
                  inputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                  outputRange: [
                    Math.min(minBoundaryPosition + initOffset - sliderWidth/2, maxBoundaryPosition + initOffset - sliderWidth/2),
                    Math.max(minBoundaryPosition + initOffset - sliderWidth/2, maxBoundaryPosition + initOffset - sliderWidth/2)
                  ],
                  extrapolate: 'clamp'
                })
              }],
              ]} />
          </View>
          <Animated.View
            style={[
              s.draggable,
              { transform:
                [{ translateX: pan.x.interpolate(
                  {
                    inputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                    outputRange: [Math.min(minBoundaryPosition, maxBoundaryPosition), Math.max(minBoundaryPosition, maxBoundaryPosition)],
                    extrapolate: 'clamp'
                  })
                }]
              },
              {left:sliderCenter + initOffset}
            ]}
            {...panResponder.panHandlers}
          >
            <View style={s.circle}>
              <View style={s.icon} >
                <Displayers.Icon
                  type={type}
                  name={icon}
                  size={25}
                  color={G.Colors().Highlight()}
                />
              </View>
              <View style={s.labelContainer}>
                <Texts.Label style={s.label}>{name}</Texts.Label>
              </View>
            </View>
          </Animated.View>
          <View style={[s.boundary, {left:0 }]}/>
        </View>
        {props.numberDisplay === true ? 
          <View style={s.labelValue}>
            <Texts.Label style={s.labelValueText}>{animState.displayMinVal}</Texts.Label>
          </View>
          :
          <View/>
        }
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  mainContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:4,
  },
  container:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
  },

  labelValue:
  {
    ...G.S.center,
    flex: 1,
  },
  labelValueText:
  {
    fontSize:11,
  },

  sliderContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex: 8,
  },
  lineContainer:
  {
    ...G.S.center,
    height:4,
    ...G.S.width(80),
    flexDirection:'row',
    position: "absolute",
    left:"10%",
    top:"50%",
    marginTop:-3,
    borderRadius: 60,
    backgroundColor:G.Colors().Neutral(0.1),
  },
  line:
  {
    ...G.S.full,
    backgroundColor:G.Colors().Highlight(),
  },
  draggable:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    top:-5,
    borderRadius:100,
    overflow: "visible",
  },
  circle:
  {
    ...G.S.shadow(3),
    ...G.S.center,
    flexDirection: "row",
    aspectRatio: 1,
    backgroundColor: G.Colors().Foreground(),
    borderRadius: 15,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderWidth: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: G.Colors().Important(0.2),
    overflow: "visible",
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(80),
    paddingBottom:10
  },
  labelContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:3,
    position:'absolute',
    bottom:0,
  },
  label:
  {
    fontSize:9,
  },
});
