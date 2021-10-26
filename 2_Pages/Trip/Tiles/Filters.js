import React, { useContext, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
// Context
import { AppContext } from "../../../AppContext";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Views from "../../../Libs/Views";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Popups from "../../../Libs/Popups";
import * as Inputs from "../../../Libs/Inputs";
import * as Displayers from "../../../Libs/Displayers";
// Components
import Filter from "./Filter";

export default function Filters(props)
{
  const [context, setContext] = useContext(AppContext);

  const [filters, setFilters] = useState({
    PercentBusy: props.trip?.filterIntense,
    PercentActive: props.trip?.filterSportive,
    PercentCity: props.trip?.filterCity,
    PercentFamous: props.trip?.filterFamous,
    PercentFar: props.trip?.filterFar,
    PercentPaid: props.trip?.filterExpensive,
  });
  const reset = () =>
  {
    setFilters({
      PercentBusy: props.trip?.filterIntense,
      PercentActive: props.trip?.filterSportive,
      PercentCity: props.trip?.filterCity,
      PercentFamous: props.trip?.filterFamous,
      PercentFar: props.trip?.filterFar,
      PercentPaid: props.trip?.filterExpensive,
    });
  }
  React.useEffect(() => { reset(); }, [props.visible]);

  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState({
    iconStart: "clipboard",
    iconEnd: "clipboard-list",
    text: "",
  });
  const showTooltip = (tooltip) =>
  {
    setCurrentTooltip(tooltip);
    setTooltipIsVisible(true);
  };
  const onFilterChange = async (filterName, value) =>
  {
    setFilters({
      ...filters,
      PercentBusy: filterName === "Busy" ? value : filters.PercentBusy,
      PercentActive: filterName === "Sportive" ? value : filters.PercentActive,
      PercentCity: filterName === "City" ? value : filters.PercentCity,
      PercentFamous: filterName === "Touristy" ? value : filters.PercentFamous,
      PercentFar: filterName === "Scattered" ? value : filters.PercentFar,
      PercentPaid: filterName === "Expensive" ? value : filters.PercentPaid,
    });
  };

  const save = () =>
  {
    setTooltipIsVisible(false);
    props.save(
      filters.PercentBusy,
      filters.PercentActive,
      filters.PercentCity,
      filters.PercentFamous,
      filters.PercentFar,
      filters.PercentPaid);
  }

  const filtersConfig = [
    {
      iconMin: "clipboard",
      labelMin: "Lazy",
      iconMax: "clipboard-list", //clock-fast(mci)
      labelMax: "Busy",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentBusy,
    },
    {
      iconMin: "umbrella-beach",
      labelMin: "Chilling",
      iconMax: "hiking",
      labelMax: "Sportive",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentActive,
    },
    {
      iconMin: "tree",
      labelMin: "Nature",
      iconMax: "city",
      labelMax: "City",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentCity,
    },
    {
      iconMin: "dungeon",
      labelMin: "Unknown",
      iconMax: "users",
      labelMax: "Touristy",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentFamous,
    },
    {
      iconMin: "street-view",
      labelMin: "Centered",
      iconMax: "road",
      labelMax: "Scattered",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentFar,
    },
    {
      iconMin: "unlock-alt",
      labelMin: "Free",
      iconMax: "coins",
      labelMax: "Expensive",
      text: "Chill-Busy refers to how dense your schedule will be per day.\n\nIf you want to visit a lot of places in a day, put the slider closer to the right.",
      value: filters.PercentPaid,
    },
  ];

  const getFilter = (filter, index) => (
    <Filter
      key={index}
      iconMin={filter.iconMin}
      labelMin={filter.labelMin}
      iconMax={filter.iconMax}
      labelMax={filter.labelMax}
      showTooltip={() =>
        showTooltip({
          iconStart: filter.iconMin,
          iconEnd: filter.iconMax,
          text: filter.text,
        })
      }
      value={filter.value}
      onValueChange={onFilterChange}
    />
  );

  const getPopup = () =>
  {
    return (
      <Popups.Popup
        transparent={true}
        containerStyle={{ ...G.S.height(40), ...G.S.width(80) }}
        visible={tooltipIsVisible}
        hide={() => setTooltipIsVisible(false)}
      >
        <View style={{ flex: 1, marginTop:20 }}>
          <View style={{ ...G.S.center, ...G.S.width(), flexDirection: "row", }} >
            <View style={{ flex: 3, flexDirection: "row", justifyContent: "flex-end", marginHorizontal: 5, }} >
              <Displayers.Icon
                type="fa"
                name={currentTooltip.iconStart}
                size={35}
                color={G.Colors().Important(0.6)}
                style={s.iconUp}
              />
            </View>
            <View style={{ ...G.S.center, flex: 1, flexDirection: "row", marginHorizontal: 5, }} >
              <Displayers.Icon
                type="mi"
                name="linear-scale"
                size={35}
                color={G.Colors().Important(0.6)}
                style={s.iconUp}
              />
            </View>
            <View style={{ ...G.S.center, flex: 3, flexDirection: "row", justifyContent: "flex-start", marginHorizontal: 5, }} >
              <Displayers.Icon
                type="fa"
                name={currentTooltip.iconEnd}
                size={35}
                color={G.Colors().Important(0.6)}
                style={s.iconUp}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 3, paddingHorizontal: 15 }}>
          <Text style={{ textAlign: "justify", fontSize: 15, lineHeight: 25 }} >
            {currentTooltip.text}
          </Text>
        </View>
        <View style={s.buttonPopupContainer}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="thumb-up-outline"
            type="mci"
            size={20}
            color={G.Colors().Background()}
            onPress={() => setTooltipIsVisible(false)}
          />
        </View>
      </Popups.Popup>
    );
  }

  return (
    <Popups.Popup
      top={props.top}
      transparent={true}
      containerStyle={{ ...G.S.height(props.height ? props.height : 60), ...G.S.width(props.width ? props.width : 90) }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.name}>
          <View style={[s.sectionName, { justifyContent: "flex-end", alignContent: "flex-end" }]}>
            <Displayers.Icon
              name={props.icon}
              type={props.iconType}
              size={32}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={[s.sectionName, { justifyContent: "flex-start", alignContent: "flex-start" }]}>
            <Texts.Label
              left singleLine
              style={{ fontSize: 18, color: G.Colors().Highlight()}}
            >
              {props.name}
            </Texts.Label>
          </View>
        </View>
        <View style={s.title}>
          <Texts.Label style={{ fontSize: 15, fontWeight:'bold', color:G.Colors().Neutral(0.6) }}>
            Set your trip preferences
          </Texts.Label>
        </View>
        <View style={s.subtitle}>
          <Texts.Label left style={{ fontSize: 12, color:G.Colors().Neutral(0.6) }}>
            Click on an icon to get more information about a slider{"\n"}
          </Texts.Label>
        </View>
        <View style={s.list}>
          {filtersConfig.map((f, index) => getFilter(f, index))}
        </View>
        <View style={s.buttonContainer}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="check"
            type="mci"
            size={25}
            color={G.Colors().Background()}
            onPress={() => save()}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
        {getPopup()}
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    padding:5,
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
    marginTop: 10,
  },
  sectionName:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop: -15,
  },
  subtitle:
  {
    ...G.S.center,
    ...G.S.width(90),
    flex:1,
  },

  list:
  {
    ...G.S.width(94),
    flex:10,
    marginTop: 20,
    marginBottom: 10,
    padding:8,
    paddingHorizontal:5,
    borderRadius:30,
    //borderWidth:1,
    borderColor:G.Colors().Neutral(0.1),
    //backgroundColor:G.Colors().Background(0.5),
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 6,
    marginBottom: 10,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
  },
  buttonPopupContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    aspectRatio: 2,
    marginBottom: 10,
  },
});
