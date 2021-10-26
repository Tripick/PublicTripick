import React from "react";
import { StyleSheet, View } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import Icon from "./Icon";
import Touchable from "./Touchable";

export default function Flag(props)
{
  return (
    <View style={s.container}>
      <View style={[s.content, props.noShadow === true ? {} : {...G.S.shadow()}]}>
        <Touchable
          onPress={() => (props.onClick ? props.onClick() : null)}
        >
          <View style={[
            s.flag,
            props.containerStyle ? props.containerStyle : {},
            props.label === "" ? {} : { paddingBottom:5 }
          ]}>
            <View style={{ flex: 1 }}>
              <View style={[s.flagIconContainer, props.label === "" ? {} : { justifyContent: "flex-end" }]}>
                <View style={{paddingLeft:0}}>
                  <Icon {...props} size={ 20 + (props.sizeModifier ? props.sizeModifier : 0)}
                    color={props.color ? props.color : G.Colors().Important()}
                  />
                </View>
              </View>
              {props.label === "" ?
                <View/> : 
                <View style={s.flagLabelContainer}>
                  <Texts.Label
                    top
                    style={[
                      props.warning && props.warning === true
                        ? s.flagLabelWarning
                        : s.flagLabel,
                        {color:props.color ? props.color : G.Colors().Important()}
                      ]}
                  >
                    {props.label}
                  </Texts.Label>
                </View>
              }
            </View>
          </View>
        </Touchable>
      </View>
    </View>
  );
}
let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
    padding: 8,
  },
  content:
  {
    ...G.S.center,
    flex: 1,
    borderRadius: 100,
    overflow:'visible',
  },
  flag:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 1,
    flexDirection: "row",
    borderRadius: 100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  flagIconContainer:
  {
    ...G.S.center,
    flex: 1.5,
  },
  flagLabelContainer:
  {
    ...G.S.center,
    flex: 1,
    justifyContent:'flex-start',
  },
  flagLabel: {
    textAlign: "center",
    fontSize: 11,
    color: G.Colors().Important(),
  },
});

s.flagLabelWarning =
{
  ...s.flagLabel,
  color: G.Colors().Warning,
};
