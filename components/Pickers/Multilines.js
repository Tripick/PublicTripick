import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function Multilines(props)
{
  const [value, setValue] = useState(props.value);
  React.useEffect(() => { setValue(props.value); }, [props.value]);
  return (
    <Popups.Popup
      top={props.top}
      transparent={true}
      containerStyle={props.width ? {...G.S.width(props.width)} : {}}
      visible={props.show}
      hide={() => {setValue(props.value); props.hide()}}
    >
      <View style={popup.icon}>
        <Displayers.Icon
          alignWidth
          dark
          backgroundBright
          name={props.icon ? props.icon : "compass-rose"}
          type="mci"
          size={40}
          color={G.Colors().Highlight()}
        />
      </View>
      <View style={popup.title}>
        <Texts.Label style={{ fontSize: 16, color:G.Colors().Highlight() }}>
          {props.title}
        </Texts.Label>
      </View>
      <View style={popup.input}>
        <TextInput
          style={popup.inputField}
          onChangeText={(val) => setValue(val)}
          value={value}
          maxLength={props.maxLength ? props.maxLength : 300}
          autoFocus={true}
          keyboardType="default"
          returnKeyType="done"
          multiline={true}
          blurOnSubmit={true}
          onSubmitEditing={()=>props.save(value)}
        />
      </View>
      <View style={popup.buttons}>
        <Buttons.Round
          shadow
          backgroundHighlight
          name="check"
          type="mci"
          size={25}
          color={G.Colors().Background()}
          onPress={() => props.save(value)}
          contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
        />
      </View>
    </Popups.Popup>
  );
}

let popup = StyleSheet.create(
{
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    marginTop:"5%",
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:7,
    paddingHorizontal:"5%",
    marginBottom:10,
  },
  input:
  {
    ...G.S.center,
    ...G.S.width(94),
    aspectRatio:2,
    borderRadius: 10,
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    backgroundColor:G.Colors().Background(0.5),
  },
  inputField:
  {
    ...G.S.full,
    padding: 10,
    textAlign: "left",
    textAlignVertical: "top",
    color: G.Colors().Neutral(),
    fontSize: 14,
  },
  buttons:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    marginVertical:10,
  },
});
