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

export default function Label(props) {
  const [value, setValue] = useState(props.val);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Popups.Popup
        alignement="top"
        containerStyle={{ ...G.S.height(30), ...G.S.width(96) }}
        visible={props.show}
        hide={() => {
          setValue(props.val);
          props.hide();
        }}
      >
        <View style={s.inputFlex}>
          <TextInput
            style={s.input}
            onChangeText={(val) => setValue(val)}
            value={value}
            autoFocus={true}
            maxLength={props.maxLength}
          />
        </View>

        <View style={s.buttons}>
          <Buttons.Label dark noBackground onPress={props.hide}>
            Cancel
          </Buttons.Label>
          <Buttons.Label backgroundHighlight onPress={() => props.save(value)}>
            Save
          </Buttons.Label>
        </View>
      </Popups.Popup>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  inputFlex: {
    ...G.S.width(),
    flex: 1,
    overflow: "hidden",
    backgroundColor: G.Colors().Foreground(),
  },
  input: {
    ...G.S.full,
    padding: 10,
    textAlign: "center",
    textAlignVertical: "center",
    color: G.Colors().Neutral(),
    fontSize: 14,
  },
  buttons: {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
});
