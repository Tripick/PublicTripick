import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";
// Components
import Search from "../Search/SearchContent";
import PickSingle from "../Pick/PickSingle";

export default function SearchActivityPopup(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [selected, setSelected] = React.useState(null);
  const displayPlace = (placeId, place) =>
  {
    setContext({ ...context, currentPlaceId: place.id });
    setSelected(place);
  };

  const [results, setResults] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const onTextChange = (text) =>
  {
    setSearchText(text);
  };
  const onResultsChange = (res) =>
  {
    setResults(res);
  };

  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:7 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="magnify"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Search an activity to add in Day " + (props.day.index + 1)}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n" + G.Functions.dateToText(props.day.date)}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.content}>
          {selected === null ?
          <Search
            navigation={props.navigation}
            goToPlace={displayPlace}
            noAdd={true}
            onTextChange={onTextChange}
            searchText={searchText}
            onResultsChange={onResultsChange}
            results={results}
          />
          :
          <PickSingle
            navigation={props.navigation}
            onGoBack={() => setSelected(null)}
          />
          }
        </View>
        {selected === null ? <View/> :
          <View style={s.footer}>
            <Buttons.Label
              center
              iconRight
              alignWidth
              contentForeground
              backgroundHighlight
              iconName="check"
              type="mci"
              style={s.buttonLabel}
              size={20}
              containerStyle={{...G.S.width()}}
              contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
              iconStyle={{right:10}}
              onPress={() => props.save(selected)}
            >
              Import
            </Buttons.Label>
          </View>
        }
      </View>
    </Popups.Popup>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingTop:30,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:8,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(96),
    flex:1,
    borderWidth:1,
    borderRadius:20,
    borderColor:G.Colors().Neutral(0.2),
    zIndex:1000,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:10,
    marginVertical:20,
  },
});
  