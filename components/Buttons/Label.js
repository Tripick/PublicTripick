import * as React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Label(props)
{
  const contentStyle = props.backgroundDark
    ? s.contentDark
    : props.backgroundForeground
    ? s.contentForeground
    : props.backgroundBright
    ? s.contentBright
    : props.backgroundHighlight
    ? s.contentHighlight
    : props.backgroundAltlight
    ? s.contentAltlight
    : props.noBackground
    ? s.contentTransparent
    : props.backgroundDanger
    ? s.contentDanger
    : s.content;
  const shadow = props.shadow ? s.shadow : s.noShadow;
  const textColor = props.dark ? G.Colors().Neutral() : G.Colors().Foreground();

  const getIcon = () =>
  {
    return props.iconName ? (
      <View style={[s.iconContainer, props.iconRight ? {right:8} : {left:8}, props.iconStyle]}>
        <Displayers.Icon
          style={s.icon}
          type={props.type ? props.type : null}
          name={props.iconName}
          size={props.size ? props.size : 20 + (props.sizeAjuster ? props.sizeAjuster : 0)}
          color={props.color ? props.color : textColor}
        />
      </View>
    ) : (
      <View />
    );
  };

  return (
    <Displayers.Touchable {...props} underlayColor="transparent">
      <View
        style={[
          {
            ...G.S.center,
            flexDirection: props.alignWidth ? "column" : "row",
          },
          props.style,
        ]}
      >
        <View
          style={[
            s.container,
            props.fullWidth ? { ...G.S.width() } : {},
            props.shadow ? { padding: 5 } : {},
            props.alignWidth ? { ...G.S.width(), maxWidth: "100%" } : { ...G.S.height(), maxHeight: "100%" },
            props.containerStyle,
          ]}
        >
          <View
            style={[
              shadow,
              contentStyle,
              props.borderStyle,
              props.contentStyle,
            ]}
          >
            {getIcon()}
            {props.iconName ? (
              <View style={[s.label, props.center ? {} : {flexDirection:'row', justifyContent:'flex-start'}]} >
                <Texts.Label style={[s.text, { color: props.color ? props.color : textColor },
                    props.style && props.style.fontSize ? { fontSize: props.style.fontSize } : {}]}
                >
                  {props.children}
                </Texts.Label>
              </View>
            ) : (
              <Texts.Label style={[
                s.text,
                props.chevron === true ? {paddingRight:25} : {},
                props.color ? { color: props.color } : {},
                props.style && props.style.fontSize ? { fontSize: props.style.fontSize } : {},]}
              >
                {props.children}
              </Texts.Label>
            )}
            {props.chevron === true ? 
              <View style={[s.chevron, props.chevronStyle ? props.chevronStyle : {}]}>
                <Displayers.Icon
                  alignWidth
                  dark
                  noBackground
                  name={props.chevronIcon ? props.chevronIcon : "chevron-right"}
                  type="mci"
                  size={props.chevronSize ? props.chevronSize : 20}
                  color={props.color ? props.color : textColor}
                />
              </View>
              :
              <View/>
            }
          </View>
        </View>
      </View>
    </Displayers.Touchable>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
  },
  content:
  {
    ...G.S.center,
    ...G.S.height(),
    flexDirection: "row",
    borderRadius: 100,
    backgroundColor: G.Colors().Neutral(0.4),
  },
  noShadow: {},
  shadow:
  {
    ...G.S.shadow(2),
  },
  text:
  {
    ...G.S.center,
    paddingHorizontal:10,
  },
  iconContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    position:'absolute',
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
  },
  chevron:
  {
    ...G.S.center,
    position:'absolute',
    right:5,
  },
});
s.contentDark = {
  ...s.content,
  backgroundColor: G.Colors().Important(),
};
s.contentForeground = {
  ...s.content,
  backgroundColor: G.Colors().Foreground(),
};
s.contentBright = {
  ...s.content,
  backgroundColor: G.Colors().Foreground(),
};
s.contentHighlight = {
  ...s.content,
  backgroundColor: G.Colors().Highlight(),
};
s.contentAltlight = {
  ...s.content,
  backgroundColor: G.Colors().Altlight(),
};
s.contentTransparent = {
  ...s.content,
  backgroundColor: G.Colors().Transparent,
};
s.contentDanger = {
  ...s.content,
  backgroundColor: G.Colors().Fatal,
};
