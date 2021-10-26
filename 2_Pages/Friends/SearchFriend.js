import React from "react";
import { StyleSheet, ScrollView, View, Text, TextInput } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Buttons from "../../Libs/Buttons";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";

export default function SearchFriend(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [results, setResults] = React.useState([]);
  const [noResultText, setNoResultText] = React.useState("");
  const search = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"friend_search",
      isRetribution:false,
      data:{ searchText:searchText },
      callback:searchOnSuccess
    }]});
  }
  const searchOnSuccess = (response) =>
  {
    if(typeof(response) === 'undefined' || response === null || response.length === 0)
    {
      setNoResultText("No result found with this username.");
      setResults([]);
    }
    else
    {
      setNoResultText("");
      setResults(response);
    }
  }

  const [searchText, setSearchText] = React.useState("");
  const onInputChange = (text) =>
  {
    if(text === null || text.length === 0)
      setResults([]);
    const cleanText = G.Functions.cleanText(text);
    setSearchText(cleanText);
  };

  const displayResult = (result, index) =>
  {
    return (
      <View key={index} style={sResult.container}>
        <Displayers.Touchable onPress={() => props.displayUser(result)}>
          <View style={sResult.content}>
            <View style={sResult.label}>
              <Texts.Label singleLine left style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                {result.userName}
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
  };

  const getNoResult = () =>
  {
    return(
      <Texts.Label singleLine style={{...G.S.width(), color:G.Colors().Grey()}}>
        <Text style={{ fontSize: 14 }}>{noResultText}</Text>
      </Texts.Label>
    );
  };

  const getContent = () =>
  {
    return (
      <View style={s.container}>
        <View style={s.inputContainer}>
          <View style={s.backButton}>
            <Buttons.Round
              alignWidth
              dark
              noBackground
              name="chevron-left"
              type="mci"
              size={30}
              color={G.Colors().Highlight()}
              onPress={props.hide}
            />
          </View>
          <View style={s.inputFrame}>
            <View style={s.inputBack}>
              {searchText === null || searchText.length === 0 ?
                <Texts.Label singleLine style={{...G.S.full, color:G.Colors().Grey()}}>
                  <Text style={{ fontSize: 14 }}>Search friend's username...</Text>
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
              name="account-search"
              type="mci"
              size={30}
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
            {getNoResult()}
          </ScrollView>
        </View>
      </View>
    );
  }
  
  return (
    <Popups.Popup
      noCloseButton={true}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:0 }}
      visible={props.show}
      hide={props.hide}
    >
      {getContent()}
    </Popups.Popup>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
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
    ...G.S.width(),
    position:'absolute',
    zIndex:1,
  },
  inputFront:
  {
    ...G.S.full,
    position:'absolute',
    zIndex:2,
  },
  input:
  {
    ...G.S.full,
    paddingRight: 20,
    textAlign: "left",
    textAlignVertical: "center",
    color: G.Colors().Highlight(),
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
