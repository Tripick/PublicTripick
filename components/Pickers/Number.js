import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableWithoutFeedback,
} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function Number(props) {
  let numbers = [];
  for (
    let i = props.from ? props.from : 1;
    i <= (props.to ? props.to : 200);
    i++
  ) {
    numbers.push(i);
  }

  return (
    <Popups.Popup
      alignement="center"
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      visible={props.show}
      hide={props.hide}
    >
      <Views.Center containerStyle={{ flex: 2 }}>
        <Views.Center containerStyle={{ flex: 2 }}>
          <Displayers.Icon
            name={props.iconName}
            size={50}
            color={G.Colors().Altlight()}
          />
        </Views.Center>
        <Views.Center containerStyle={{ flex: 1 }}>
          <Texts.Title bold>{props.title}</Texts.Title>
        </Views.Center>
      </Views.Center>
      <View style={{ flex: 7 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
          {numbers.map((number) => (
            <TouchableWithoutFeedback
              key={number}
              onPress={() => props.onChange(number)}
            >
              <Views.Center containerStyle={s.item}>
                <Texts.Label>{number}</Texts.Label>
              </Views.Center>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
    </Popups.Popup>
  );
}

const s = StyleSheet.create({
  item: {
    height: 25,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
});
