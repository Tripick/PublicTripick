import * as React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function Currency(props) {
  let currencies = [
    { Id: 1, Code: "GBP", Symbol: "£" },
    { Id: 2, Code: "USD", Symbol: "$" },
    { Id: 3, Code: "EUR", Symbol: "€" },
    { Id: 4, Code: " ", Symbol: " " },
    { Id: 5, Code: "ARS", Symbol: "$" },
    { Id: 6, Code: "ANG", Symbol: "ƒ" },
    { Id: 7, Code: "AUD", Symbol: "$" },
    { Id: 8, Code: "AWG", Symbol: "ƒ" },
    { Id: 9, Code: "AZN", Symbol: "₼" },
    { Id: 10, Code: "BAM", Symbol: "K" },
    { Id: 11, Code: "BBD", Symbol: "$" },
    { Id: 12, Code: "BGN", Symbol: "л" },
    { Id: 13, Code: "BMD", Symbol: "$" },
    { Id: 14, Code: "BND", Symbol: "$" },
    { Id: 15, Code: "BOB", Symbol: "$" },
    { Id: 16, Code: "BRL", Symbol: "R" },
    { Id: 17, Code: "BSD", Symbol: "$" },
    { Id: 18, Code: "BWP", Symbol: "P" },
    { Id: 19, Code: "BYN", Symbol: "B" },
    { Id: 20, Code: "BZD", Symbol: "B" },
    { Id: 21, Code: "CAD", Symbol: "$" },
    { Id: 22, Code: "CHF", Symbol: "C" },
    { Id: 23, Code: "CLP", Symbol: "$" },
    { Id: 24, Code: "CNY", Symbol: "¥" },
    { Id: 25, Code: "COP", Symbol: "$" },
    { Id: 26, Code: "CRC", Symbol: "₡" },
    { Id: 27, Code: "CUP", Symbol: "₱" },
    { Id: 28, Code: "CZK", Symbol: "K" },
    { Id: 29, Code: "DKK", Symbol: "k" },
    { Id: 30, Code: "DOP", Symbol: "R" },
    { Id: 31, Code: "EGP", Symbol: "£" },
    { Id: 32, Code: "FJD", Symbol: "$" },
    { Id: 33, Code: "FKP", Symbol: "£" },
    { Id: 34, Code: "GGP", Symbol: "£" },
    { Id: 35, Code: "GHS", Symbol: "¢" },
    { Id: 36, Code: "GIP", Symbol: "£" },
    { Id: 37, Code: "GTQ", Symbol: "Q" },
    { Id: 38, Code: "GYD", Symbol: "$" },
    { Id: 39, Code: "HKD", Symbol: "$" },
    { Id: 40, Code: "HNL", Symbol: "L" },
    { Id: 41, Code: "HRK", Symbol: "k" },
    { Id: 42, Code: "HUF", Symbol: "F" },
    { Id: 43, Code: "IDR", Symbol: "R" },
    { Id: 44, Code: "ILS", Symbol: "₪" },
    { Id: 45, Code: "IMP", Symbol: "£" },
    { Id: 46, Code: "ISK", Symbol: "k" },
    { Id: 47, Code: "JEP", Symbol: "£" },
    { Id: 48, Code: "JMD", Symbol: "J" },
    { Id: 49, Code: "JPY", Symbol: "¥" },
    { Id: 50, Code: "KGS", Symbol: "л" },
    { Id: 51, Code: "KHR", Symbol: "៛" },
    { Id: 52, Code: "KPW", Symbol: "₩" },
    { Id: 53, Code: "KRW", Symbol: "₩" },
    { Id: 54, Code: "KYD", Symbol: "$" },
    { Id: 55, Code: "KZT", Symbol: "л" },
    { Id: 56, Code: "LAK", Symbol: "₭" },
    { Id: 57, Code: "LBP", Symbol: "£" },
    { Id: 58, Code: "LKR", Symbol: "₨" },
    { Id: 59, Code: "LRD", Symbol: "$" },
    { Id: 60, Code: "MKD", Symbol: "д" },
    { Id: 61, Code: "MNT", Symbol: "₮" },
    { Id: 62, Code: "MUR", Symbol: "₨" },
    { Id: 63, Code: "MXN", Symbol: "$" },
    { Id: 64, Code: "MYR", Symbol: "R" },
    { Id: 65, Code: "MZN", Symbol: "M" },
    { Id: 66, Code: "NAD", Symbol: "$" },
    { Id: 67, Code: "NGN", Symbol: "₦" },
    { Id: 68, Code: "NIO", Symbol: "C" },
    { Id: 69, Code: "NOK", Symbol: "k" },
    { Id: 70, Code: "NPR", Symbol: "₨" },
    { Id: 71, Code: "NZD", Symbol: "$" },
    { Id: 72, Code: "PAB", Symbol: "B" },
    { Id: 73, Code: "PEN", Symbol: "S" },
    { Id: 74, Code: "PHP", Symbol: "₱" },
    { Id: 75, Code: "PKR", Symbol: "₨" },
    { Id: 76, Code: "PLN", Symbol: "z" },
    { Id: 77, Code: "PYG", Symbol: "G" },
    { Id: 78, Code: "RON", Symbol: "l" },
    { Id: 79, Code: "RSD", Symbol: "Д" },
    { Id: 80, Code: "RUB", Symbol: "₽" },
    { Id: 81, Code: "SBD", Symbol: "$" },
    { Id: 82, Code: "SCR", Symbol: "₨" },
    { Id: 83, Code: "SEK", Symbol: "k" },
    { Id: 84, Code: "SGD", Symbol: "$" },
    { Id: 85, Code: "SHP", Symbol: "£" },
    { Id: 86, Code: "SOS", Symbol: "S" },
    { Id: 87, Code: "SRD", Symbol: "$" },
    { Id: 88, Code: "SVC", Symbol: "$" },
    { Id: 89, Code: "SYP", Symbol: "£" },
    { Id: 90, Code: "THB", Symbol: "฿" },
    { Id: 91, Code: "TRY", Symbol: " " },
    { Id: 92, Code: "TTD", Symbol: "T" },
    { Id: 93, Code: "TVD", Symbol: "$" },
    { Id: 94, Code: "TWD", Symbol: "N" },
    { Id: 95, Code: "UAH", Symbol: "₴" },
    { Id: 96, Code: "UYU", Symbol: "$" },
    { Id: 97, Code: "UZS", Symbol: "л" },
    { Id: 98, Code: "VEF", Symbol: "B" },
    { Id: 99, Code: "VND", Symbol: "₫" },
    { Id: 100, Code: "XCD", Symbol: "$" },
    { Id: 101, Code: "ZAR", Symbol: "R" },
    { Id: 102, Code: "ZWD", Symbol: "Z" },
  ];

  return (
    <Popups.Popup
      alignement="top"
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      visible={props.show}
      hide={props.hide}
    >
      <Views.Center containerStyle={{ flex: 2 }}>
        <Views.Center containerStyle={{ flex: 1 }}>
          <Displayers.Icon
            name="md-cash"
            size={50}
            color={G.Colors().Altlight()}
          />
        </Views.Center>
        <Views.Center containerStyle={{ flex: 1 }}>
          <Texts.Title bold>{props.title}</Texts.Title>
        </Views.Center>
      </Views.Center>
      <View style={s.listContainer}>
        <ScrollView style={s.list}>
          {currencies.map((currency) => (
            <TouchableWithoutFeedback
              key={currency.Id}
              onPress={() => props.onSelect(currency)}
            >
              <Views.Center containerStyle={s.item}>
                <Texts.Label style={s.text}>
                  {currency.Symbol + " - " + currency.Code}
                </Texts.Label>
              </Views.Center>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      </View>
    </Popups.Popup>
  );
}

const s = StyleSheet.create({
  container: {
    ...G.S.center,
    flex: 1,
  },
  title: {
    ...G.S.center,
    flex: 2,
  },
  listContainer: {
    ...G.S.center,
    flex: 7,
  },
  list: {
    flex: 1,
  },
  item: {
    height: 30,
    width: "90%",
    margin: 10,
    borderBottomWidth: 1,
    borderColor: G.Colors().Neutral(),
  },
  text: { color: G.Colors().Neutral() },
});
