import React from "react";
import { StyleSheet, View, ScrollView, TextInput, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";

export default function SearchContent(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [searchText, setSearchText] = React.useState(props.searchText ? props.searchText : "");
  const [results, setResults] = React.useState(props.results ? props.results : []);
  const onInputChange = (text) =>
  {
    if(text === null || text.length === 0)
    {
      setResults([]);
      if(props.onResultsChange) props.onResultsChange([]);
    }
    const cleanText = G.Functions.cleanText(text);
    setSearchText(cleanText);
    if(props.onTextChange) props.onTextChange(cleanText);
  };

  // Search places
  const search = () =>
  {
    if(searchText !== null && searchText.length > 0)
    {
      setContext({ ...context, ordersQueue:[...context.ordersQueue,
      {
        id:G.Functions.newGUID(),
        actionName:"place_autocomplete",
        isRetribution:false,
        data:{ text:searchText, quantity:5, loadPlace:props.noAdd },
        callback:autocompleteOnSuccess
      }]});
    }
  };
  const autocompleteOnSuccess = (response) =>
  {
    setResults(response);
    if(props.onResultsChange)
      props.onResultsChange(response);
  };

  const displayResult = (result, index) =>
  {
    return (
      <View key={index} style={sResult.container}>
        <Displayers.Touchable onPress={() => props.goToPlace(result.id, result)}>
          <View style={sResult.content}>
            <View style={sResult.label}>
              <Texts.Label singleLine left style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                <Text style={{fontFamily:"labelBold"}}>{result.country !== null && result.country.length > 0 ? "(" + result.country.substring(0, 2) + ") "  : ""}</Text>
                {result.name}
              </Texts.Label>
            </View>
            <View style={sResult.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  }

  const addAPlace = () =>
  {
    setContext({ ...context, previousPageName: "Search", currentPlace:null });
    context.navigate(props.navigation, "ModifyPlace");
  };
  const getNoResult = () =>
  {
    return (
      <View style={sNoResult.container}>
        <View style={sNoResult.textContainer}>
          <Texts.Label style={{color:G.Colors().Neutral(0.6)}}>Can't find the place you're looking for?</Texts.Label>
        </View>
        <View style={[sNoResult.textContainer, {marginTop:5}]}>
          <Texts.Label style={{color:G.Colors().Neutral(0.6)}}>Add a new place:</Texts.Label>
        </View>
        <View style={sNoResult.buttonContainer}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="plus"
            type="mci"
            size={25}
            color={G.Colors().Foreground()}
            onPress={addAPlace}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground()}}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.inputContainer}>
        <View style={s.inputFrame}>
          <View style={s.inputBack}>
            {searchText === null || searchText.length === 0 ?
              <Texts.Label left singleLine style={{...G.S.width(), paddingLeft:2, color:G.Colors().Highlight()}}>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}>Search</Text>
                <Text style={{ fontSize: 13 }}> or</Text>
                <Text style={{ fontWeight: "bold", fontSize: 14 }}> Add</Text>
                <Text style={{ fontSize: 13 }}> places...</Text>
              </Texts.Label> : 
              <View/>
            }
          </View>
          <View style={s.inputFront}>
            <TextInput
              style={s.input}
              onChangeText={onInputChange}
              value={searchText}
              placeholderTextColor={G.Colors().placeHolderText}
              autoFocus={false}
              onSubmitEditing={search}
            />
          </View>
        </View>
        <View style={s.clearButton}>
          <Buttons.Round
            alignWidth
            dark
            noBackground
            name="magnify"
            type="mci"
            size={25}
            color={G.Colors().Highlight()}
            onPress={search}
          />
        </View>
      </View>
      <View style={s.resultsContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={s.list}
          contentContainerStyle={{ ...G.S.center }}
        >
          {results.map(displayResult)}
          {props.noAdd === true ? <View/> : getNoResult()}
        </ScrollView>
      </View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent:'flex-start',
    paddingHorizontal: 10,
  },
  inputContainer:
  {
    ...G.S.center,
    ...G.S.shadow(),
    ...G.S.width(),
    aspectRatio:7,
    position:'absolute',
    top:12,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    borderRadius: 100,
    zIndex:10,
    backgroundColor: G.Colors().Foreground(),
    flexDirection:'row',
  },
  backButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
  },
  clearButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio: 1,
  },
  inputFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  inputBack:
  {
    ...G.S.center,
    ...G.S.full,
    position:'absolute',
    left:25,
    zIndex:1,
  },
  inputFront:
  {
    ...G.S.full,
    position:'absolute',
    left:25,
    zIndex:2,
  },
  input:
  {
    ...G.S.full,
    paddingRight: 20,
    textAlign: "left",
    textAlignVertical: "center",
    color:G.Colors().Neutral(0.6),
    fontSize: 14,
  },
  resultsContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    paddingHorizontal: 10,
    zIndex:1,
  },
  list:
  {
    ...G.S.full,
    borderRadius: 20,
    paddingTop:G.Layout.window.width / 5,
  },
  result:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio: 6,
    marginBottom: 10,
    borderRadius: 100,
    backgroundColor: G.Colors().Background(0.7),
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.3)
  },
});

let sResult = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(5),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:7,
    marginBottom:3,
    paddingHorizontal:20,
    paddingLeft:15,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
    overflow:'visible'
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom: 2,
  },
  iconGo:
  {
    ...G.S.center,
    position:'absolute',
    right:10,
  },
});

let sNoResult = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(90),
    padding:5,
  },
  textContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:25,
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    marginTop:0,
  },
});