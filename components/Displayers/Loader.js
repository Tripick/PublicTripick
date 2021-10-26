import React from "react";
import { ActivityIndicator, StyleSheet, View, Image, Animated } from "react-native";
// Libs
import * as G from "../../Libs/Globals";

export default function Loader(props)
{
  const numberOfWaves = 3;
  const numberOfRockets = 6;
  React.useEffect(() =>
  {
    if(props.isVisible === true && typeof(animations) !== 'undefined' && animations !== null)
    {
      for(let w = 0; w < numberOfWaves; w++)
      {
        if(typeof(animations[w]) !== 'undefined' && animations[w] !== null)
        {
          animations[w].setValue(0);
          // Start animations
          Animated.loop(
            Animated.sequence([Animated.delay(0), Animated.timing(animations[w], { toValue: 1, duration: durations[w] })]),
            { iterations: 100 }
          ).start();
        }
      }
    }
  }, [props.isVisible]);

  const [rockets, setRockets] = React.useState([]);
  const [animations, setAnimations] = React.useState([]);
  const [wavesX, setWavesX] = React.useState([]);
  const [wavesY, setWavesY] = React.useState([]);
  const [angles, setAngles] = React.useState([]);
  const [scales, setScales] = React.useState([]);
  const [durations, setDurations] = React.useState([]);
  React.useEffect(() =>
  {
    let anims = [];
    let durs = [];
    let wX = [];
    let wY = [];
    let as = [];
    let ss = [];
    for(let w = 0; w < numberOfWaves; w++)
    {
      anims.push(new Animated.Value(0));
      durs.push(Math.random()*10000 + 1500);

      let posX = [];
      let posY = [];
      let angs = [];
      let scas = [];
      for(let r = 0; r < numberOfRockets; r++)
      {
        // Trajectory
        let xDirection = Math.random() < 0.5 ? -1 : 1;
        let yDirection = Math.random() < 0.5 ? -1 : 1;
        const offsetPos = 110;
        let startPosX = (Math.random() * 100) + (xDirection * offsetPos); // Between -100,0 & 100,200
        let endPosX = startPosX - (xDirection * offsetPos * 2);
        let startPosY = (Math.random() * 125); // Between 0 & 100
        let endPosY = (Math.random() * 125);

        posX.push(anims[w].interpolate({inputRange: [0, 1], outputRange: [startPosX + "%", endPosX + "%"]}));
        posY.push(anims[w].interpolate({inputRange: [0, 1], outputRange: [startPosY + "%", endPosY + "%"]}));
        
        // Angle
        const ratio = G.Layout.window.height / G.Layout.window.width;
        const x1 = startPosX;
        const y1 = startPosY * ratio;
        const x2 = endPosX;
        const y2 = endPosY * ratio;
        const opp = Math.abs(y2 - y1);
        const dist = Math.abs(Math.sqrt(Math.pow((x2 - x1),2)+Math.pow((y2 - y1),2)));
        let angle = Math.asin(opp / dist) * (180/Math.PI);
        if(x1 < x2 && y1 < y2) angle = 90 - angle;
        else if(x1 > x2 && y1 > y2) angle = -angle - 90;
        else if(x1 > x2 && y1 < y2) angle = angle - 90;
        else if(x1 < x2 && y1 > y2) angle = 90 + angle;
        angs.push(angle);

        // Scale
        scas.push(anims[w].interpolate({inputRange: [0, 0.5, 1], outputRange: [1.5, Math.random()*3 + 0.5, 1.5]}));
      }
      wX.push(posX);
      wY.push(posY);
      as.push(angs);
      ss.push(scas);

      // Start animation
      Animated.loop(
        Animated.sequence([Animated.delay(0), Animated.timing(anims[w], { toValue: 1, duration: durs[w] })]),
        { iterations: 100 }
      ).start();
    }
    
    // Save state
    setAnimations(anims);
    setDurations(durs);
    setWavesX(wX);
    setWavesY(wY);
    setAngles(as);
    setScales(ss);

    // Generate rockets
    let rts = [];
    for(let w = 0; w < numberOfWaves; w++)
    {
      for(let r = 0; r < numberOfRockets; r++)
      {
        rts.push({w:w, r:r});
      }
    }
    setRockets(rts);

    // Cleanup
    return () =>
    {
      for(let w = 0; w < numberOfWaves; w++)
      {
        if(animations.length > w) animations[w].stopAnimation();
      }
    };
  }, []);

  const getRocket = (waveIndex, rocketIndex) =>
  {
    return (
      (animations.length > 0 && wavesX.length > 0) ?
        <Animated.View key={rocketIndex + waveIndex * numberOfRockets} style={[
          s.rocketContainer,
          {left:wavesX[waveIndex][rocketIndex], bottom:wavesY[waveIndex][rocketIndex]},
          {transform:[{rotateZ:(angles[waveIndex][rocketIndex]+'deg')}, {scale:scales[waveIndex][rocketIndex]}]}
        ]}>
          <Image source={G.Images.logo} style={s.rocket} resizeMode='contain'/>
        </Animated.View>
        :
        <View key={rocketIndex + waveIndex * numberOfRockets} />
    );
  };

  if(props.isVisible === true)
    return (
      <View style={[s.container, s.horizontal, props.noBackground === true ? {} : {backgroundColor: G.Colors().Foreground(0.6)}]}>
        <ActivityIndicator size="small" color={G.Colors().Altlight()} />
        {rockets.map((rocket) => getRocket(rocket.w, rocket.r))}
      </View>
    );
  return <View/>
}

const rocketSize = 30;
const s = StyleSheet.create({
  container:
  {
    ...G.S.full,
    ...G.S.center,
    position: "absolute",
    justifyContent: "space-around",
    padding: 10,
    zIndex:1000,
  },
  rocketContainer:
  {
    ...G.S.center,
    height:rocketSize,
    aspectRatio:1,
    position: "absolute",
    bottom:rocketSize,
    zIndex:1001,
  },
  rocket:
  {
    ...G.S.height(),
  },
});
