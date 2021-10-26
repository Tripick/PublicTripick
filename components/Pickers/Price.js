import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
} from "react-native";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";
// Components
import PickerCurrency from "./Currency";

export default function Price(props) {
  const [selectedCurrency, setSelectedCurrency] = useState(props.currency);
  const [showPickerCurrency, setShowPickerCurrency] = useState(false);

  const [value, setValue] = useState(props.val);
  const handleValueChanged = (newVal) => {
    let nextValue = value;
    if (newVal === "") nextValue = 0;
    else if (!Number.isNaN(newVal)) nextValue = Number.parseInt(newVal);
    setValue(nextValue);
  };
  const valueDisplay = value.toString();

  const onSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setShowPickerCurrency(false);
  };

  return (
    <Popups.Popup
      alignement="top"
      containerStyle={{ ...G.S.height(60), ...G.S.width(96) }}
      visible={props.show}
      hide={props.hide}
    >
      <Views.Center containerStyle={{ flex: 2 }}>
        <Views.Center containerStyle={{ flex: 2 }}>
          <Displayers.Icon
            fa
            name="piggy-bank"
            size={50 - 10}
            color={G.Colors().Altlight()}
          />
        </Views.Center>
        <Views.Center containerStyle={{ flex: 1 }}>
          <Texts.Title bold>{props.title}</Texts.Title>
        </Views.Center>
      </Views.Center>
      <View style={{ flex: 2 }}>
        <Views.Right containerStyle={s.arrowLine} width={18}>
          <TouchableWithoutFeedback onPress={() => setShowPickerCurrency(true)}>
            <Displayers.Icon
              fa
              name="angle-up"
              size={20}
              color={G.Colors().Highlight()}
              style={s.iconUp}
            />
          </TouchableWithoutFeedback>
        </Views.Right>
        <View style={s.inputGlobalContainer}>
          <Views.Center containerStyle={s.inputContainer} width={95}>
            <TextInput
              style={s.input}
              placeholderTextColor={G.Colors().placeHolderText}
              keyboardType={"numeric"}
              onChangeText={handleValueChanged}
              value={valueDisplay}
            />
          </Views.Center>
          <TouchableWithoutFeedback onPress={() => setShowPickerCurrency(true)}>
            <Views.Center containerStyle={s.currencyContainer}>
              <Texts.Label style={s.text}>
                {selectedCurrency.Symbol + " (" + selectedCurrency.Code + ")"}
              </Texts.Label>
            </Views.Center>
          </TouchableWithoutFeedback>
        </View>
        <Views.Right containerStyle={s.arrowLine} width={18}>
          <TouchableWithoutFeedback onPress={() => setShowPickerCurrency(true)}>
            <Displayers.Icon
              fa
              name="angle-down"
              size={20}
              color={G.Colors().Highlight()}
              style={s.iconUp}
            />
          </TouchableWithoutFeedback>
        </Views.Right>
      </View>
      {props.warning === "" ? (
        <View style={s.warningInvisible}></View>
      ) : (
        <View style={s.warning}>
          <View style={{ flex: 1 }}>
            <Displayers.Icon
              fa
              name="exclamation-triangle"
              size={30}
              color={G.Colors().Warning}
              style={s.iconWarning}
            />
          </View>
          <View style={{ flex: 5 }}>
            <Texts.Label style={{ color: G.Colors().Warning }}>
              {props.warning}
            </Texts.Label>
          </View>
        </View>
      )}
      <View style={s.buttons}>
        <Buttons.Label dark noBackground onPress={props.hide}>
          Cancel
        </Buttons.Label>
        <Buttons.Label
          backgroundHighlight
          onPress={() => props.save(value, selectedCurrency)}
        >
          Save
        </Buttons.Label>
      </View>
      <PickerCurrency
        iconName="dollar-sign"
        title="What is your favorite currency?"
        show={showPickerCurrency}
        hide={() => setShowPickerCurrency(false)}
        onSelect={onSelectCurrency}
      />
    </Popups.Popup>
  );
}

const s = StyleSheet.create({
  title: {
    ...G.S.center,
    flex: 2,
  },
  inputFlex: {
    ...G.S.center,
    flex: 2,
    overflow: "visible",
  },
  arrowLine: {
    height: 20,
    flexDirection: "row",
    width: "90%",
    marginHorizontal: "5%",
  },
  inputGlobalContainer: {
    ...G.S.shadow(),
    ...G.S.center,
    flexDirection: "row",
    height: 50,
    width: "90%",
    marginHorizontal: "5%",
    borderRadius: 8,
    backgroundColor: G.Colors().Foreground(),
  },
  listContainer: {
    ...G.S.center,
    flex: 1,
  },
  container: {
    ...G.S.center,
    flex: 1,
  },
  text: { fontFamily: "labelBold", color: G.Colors().Background() },
  inputContainer: {
    flex: 3,
  },
  currencyContainer: {
    flex: 1,
    backgroundColor: G.Colors().Highlight(),
  },
  input: {
    ...G.S.full,
    textAlign: "right",
    textAlignVertical: "center",
    color: G.Colors().Neutral(),
    fontSize: 16,
    backgroundColor: G.Colors().Foreground(),
  },
  warning: {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  warningInvisible: {
    flex: 0,
  },
  iconWarning: {
    height: 40,
    width: 40,
    marginTop: 3,
    marginLeft: 10,
  },
  buttons: {
    ...G.S.center,
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  iconUp: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
});
