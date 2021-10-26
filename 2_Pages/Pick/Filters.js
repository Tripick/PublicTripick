import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";

export default function Filters(props)
{
  // Context
  const [context, setContext] = React.useContext(AppContext);

  // Message popup
  const [messagePopup, setMessagePopup] = React.useState("");
  const [showMessagePopup, setShowMessagePopup] = React.useState(false);
  const [messagePopupDuration, setMessagePopupDuration] = React.useState(1500);
  const displayMessage = (message, duration = 1500, callback = () => {}) =>
  {
    setContext({...context, userContext:{...context.userContext, displayMessageCallback: callback}});
    setMessagePopup(message);
    setMessagePopupDuration(duration);
    setShowMessagePopup(true);
  }

  // Init
  const getFilters = (idTrip) =>
  {
    const trip = [...context.userContext.trips].filter((t) => t.id === idTrip)[0];
    return trip.filters;
  };
  const [filters, setFilters] = React.useState([]);
  React.useEffect(() =>
  {
    setFilters(getFilters(context.currentTripId));
  }, [context.currentTripId]);

  React.useEffect(() =>
  {
    setFilters(getFilters(context.currentTripId));
  }, [context.userContext.trips]);

  const [tooltipIsVisible, setTooltipIsVisible] = React.useState(false);
  const [currentTooltip, setCurrentTooltip] = React.useState({
    iconStart: "clipboard",
    iconEnd: "clipboard-list",
    text: "",
  });

  const onSaveFilters = () =>
  {
    const filtersData = [];
    filters.forEach(f =>
    {
      filtersData.push(
      {
        Name:f.name,
        Min:f.min,
        Max:f.max
      });
    });
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"trip_saveFilters",
      isRetribution:false,
      data:{ idTrip:context.currentTripId, filtersData:filtersData, quantityToLoad:0 },
      callback:requestSaveFiltersOnSuccess
    }]});
  };
  const requestSaveFiltersOnSuccess = (response) =>
  {
    displayMessage("Applying filters...", 2000, () =>
    {
      console.log("Filters saved, reloading picks...");
      props.hide();
      props.reloadPicks();
    });
  };

  const filtersConfig = [
    {
      name: "Price",
      icon: "ticket-percent-outline",
      type: "mci",
      label: "Price",
      text: "Description.",
      rendering: (val) => { return "$" + val; },
      min: 0,
      max: 99
    },
    {
      name: "Length",
      icon: "hiking",
      type: "mci",
      label: "Length",
      text: "Description.",
      rendering: (val) => { return val + "km"; },
      min: 0,
      max: 300
    },
    {
      name: "Duration",
      icon: "clock-fast",
      type: "mci",
      label: "Duration",
      text: "Description.",
      rendering: (val) =>
      {
        return val < 60 ? val + "min" : (Math.trunc(val/60) +"h" + (val%60 >= 10 ? val%60 : "0" + val%60));
      },
      min: 0,
      max: 999
    },
    {
      name: "Difficulty",
      icon: "weight-lifter",
      type: "mci",
      label: "Difficulty",
      text: "Description.",
      rendering: (val) =>
      {
        if(val === 0) return "Easy";
        if(val === 1) return "Soft";
        if(val === 2) return "Simple";
        if(val === 3) return "Doable";
        if(val === 4) return "Hard";
        return "Rough";
      },
      min: 0,
      max: 5
    },
    {
      name: "Touristy",
      icon: "account-group-outline",
      type: "mci",
      label: "Touristy",
      text: "Description.",
      rendering: (val) =>
      {
        if(val === 0) return "Desert";
        if(val === 1) return "Quiet";
        if(val === 2) return "Calm";
        if(val === 3) return "Dense";
        if(val === 4) return "Busy";
        return "Crowded";
      },
      min: 0,
      max: 5
    },
  ];
  const getFilter = (fConfig, index) =>
  {
    const filter = filters.filter(f => f.name === fConfig.name)[0];
    if(filter !== null && typeof(filter) !== 'undefined')
    {
      return (
        <Pickers.SliderRange
          key={index}
          name={fConfig.name}
          icon={fConfig.icon}
          type={fConfig.type}
          boundaryMin={fConfig.min}
          boundaryMax={fConfig.max}
          initValMin={filter.min}
          initValMax={filter.max}
          rendering={fConfig.rendering}
          onSetValue={(min,max) =>
          {
            const indexOfFilter = filters.filter((t) => t.name === filter.name).length <= 0 ? -1 :
              filters.indexOf(filters.filter((t) => t.name === filter.name)[0]);
            let newFilters = [...filters];
            newFilters[indexOfFilter].min = min;
            newFilters[indexOfFilter].max = max;
            setFilters([...newFilters]);
          }}
        />
      );
    }
    else
    {
      return <View key={index}/>
    }
  };

  const getPopup = () =>
  {
    return (
      <Popups.Popup
        transparent={true}
        containerStyle={{ ...G.S.height(40), ...G.S.width(80) }}
        visible={tooltipIsVisible}
        hide={() => {setTooltipIsVisible(false);}}
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
      containerStyle={{ ...G.S.height(), ...G.S.width() }}
      style={{ borderWidth:0 }}
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
          <Texts.Label style={{ fontSize: 16, fontWeight:'bold', color:G.Colors().Neutral(0.7) }}>
            Show places between:
          </Texts.Label>
        </View>
        <View style={s.subtitle}>
          <Texts.Label style={{ fontSize: 12, color:G.Colors().Neutral(0.6) }}>
            Select a range of values so we can suggest you all places that satisfy your preferences.
          </Texts.Label>
        </View>
        <View style={s.list}>
          {filters === null ? <View/> : filtersConfig.map(getFilter)}
        </View>
        <View style={s.buttonContainer}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="check"
            type="mci"
            size={20}
            color={G.Colors().Background()}
            onPress={onSaveFilters}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
        {getPopup()}
        <Popups.PopupTemporary time={messagePopupDuration} visible={showMessagePopup} hide={() => setShowMessagePopup(false)} message={messagePopup} context={context.userContext} />
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingVertical:5,
  },
  name:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:4,
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
    aspectRatio:8,
    marginTop: -15,
  },
  subtitle:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:8,
  },

  list:
  {
    ...G.S.width(94),
    marginTop: 20,
    marginBottom: 10,
    paddingVertical:8,
    borderColor:G.Colors().Neutral(0.1),
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
  backButton:
  {
    ...G.S.center,
    height:65,
    aspectRatio: 1,
    position:'absolute',
    top:10,
    left:10,
  },
});
