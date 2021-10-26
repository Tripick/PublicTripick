import React from "react";
import {StyleSheet, View, Text, ScrollView} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";

export default function PickSlider(props)
{
  const [context, setContext] = React.useContext(AppContext);
  
  ////////////////////////////////////// Filters
  const [filterListWidth, setFilterListWidth] = React.useState(0);
  const [existingFlags, setExistingFlags] = React.useState([]);
  const [selectedFlag, setSelectedFlag] = React.useState(null);
  const displayAllFlags = () =>
  {
    let elements = [];
    for(let i=0; i < context.config.flags.length; i+=3)
    {
      elements.push(displayFlagSelection(i));
    }
    return elements;
  };
  const displayFlagSelection = (index) =>
  {
    const flag1 = index < context.config.flags.length ? {value:context.config.flags[index].minVal + "", config:context.config.flags[index]} : null;
    const flag2 = (index + 1) < context.config.flags.length ? {value:context.config.flags[index+1].minVal + "", config:context.config.flags[index+1]} : null;
    const flag3 = (index + 2) < context.config.flags.length ? {value:context.config.flags[index+2].minVal + "", config:context.config.flags[index+2]} : null;
    return (
      <View key={index} style={s.line} onLayout={(event) => { if(index === 0) setFilterListWidth(event.nativeEvent.layout.width); }}>
        {displayFlagSelectionItem(flag1)}
        {flag2 === null ? <View/> : displayFlagSelectionItem(flag2)}
        {flag3 === null ? <View/> : displayFlagSelectionItem(flag3, true)}
      </View>
    );
  };
  const displayFlagSelectionItem = (f, noMargin = false) =>
  {
    const isExisting = existingFlags.filter((t) => t.config.id === f.config.id).length > 0;
    const flag = isExisting === true ? existingFlags.filter((t) => t.config.id === f.config.id)[0] : f;
    return (
      <Displayers.Touchable onPress={() => flagClick(flag)}>
        <View style={[
            s.toSelect,
            {width:(filterListWidth-20*2)/3}, noMargin === true ? {marginRight:0}: {},
            isExisting === true ? {backgroundColor:G.Colors().Highlight()} : {backgroundColor:G.Colors().Foreground()}
          ]}
        >
          <View style={s.toSelectIcon}>
            <Displayers.Icon
              name={flag.config.icon}
              type="mci"
              size={25}
              color={isExisting === true ? G.Colors().Foreground() : G.Colors().Highlight()}
            />
          </View>
          <View style={s.toSelectTitle}>
            <Texts.Label
              style={[
                { ...G.S.width(), fontSize: 12 },
                isExisting === true ? {color:G.Colors().Foreground()} : {color:G.Colors().Highlight()}
              ]}
            >
              <Text style={isExisting === true ? { fontWeight: "bold" } : {}}>{flag.config.name}</Text>
              <Text>{isExisting === true ? "\n" + G.Functions.displayFlag(flag) : ""}</Text>
            </Texts.Label>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };
  const flagClick = (flag) =>
  {
    const isExisting = existingFlags.filter((t) => t.config.id === flag.config.id).length > 0;
    const existing = isExisting === true ? existingFlags.filter((t) => t.config.id === flag.config.id)[0] : flag;
    setSelectedFlag({...flag, value:existing.value});
  };

  const flagSelector = () =>
  {
    return (
      <View style={{...G.S.center, ...G.S.full}}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="filter"
            type="mci"
            size={30}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
              Filter places that match:
            </Text>
          </Texts.Label>
        </View>
        <View style={s.actionsList}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={s.list}
            contentContainerStyle={{ ...G.S.center, paddingBottom:22, }}
          >
            {displayAllFlags()}
          </ScrollView>
        </View>
      </View>
    );
  };

  const flagDetails = () =>
  {
    return (
      <View style={{...G.S.center, ...G.S.full}}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="filter"
            type="mci"
            size={30}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
              Filter places that match:
            </Text>
          </Texts.Label>
        </View>
        <View style={s.actionsList}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={s.list}
            contentContainerStyle={{ ...G.S.center, paddingBottom:22, }}
          >
            {displayAllFlags()}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <Popups.Popup
      transparent={true}
      containerStyle={{ ...G.S.height(), ...G.S.width(), }}
      visible={props.showFiltersPopup}
      hide={() => selectedFlag === null ? props.setShowFiltersPopup(false) : setSelectedFlag(null)}
    >
      <View style={s.container}>
        {selectedFlag === null ? flagSelector() : flagDetails()}
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    padding:4,
    paddingTop:"5%",
    paddingBottom:15,
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    paddingVertical:20,
  },
  actionsList:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  list:
  {
    ...G.S.full,
    paddingHorizontal:"5%",
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:'row',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    marginBottom: 10,
  },
  toSelect:
  {
    ...G.S.center,
    aspectRatio: 1,
    backgroundColor: G.Colors().Foreground(),
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    borderRadius:17,
    marginRight:20,
    marginBottom:15,
  },
  toSelectIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:2,
    marginTop:10,
  },
  toSelectTitle:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    marginTop:-10,
  },
});