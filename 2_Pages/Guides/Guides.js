import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Wrappers from "../../Libs/Wrappers";
// Components

export default function Gudies({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const [backPage, setBackPage] = React.useState(context.previousPageName);
  const goBack = () => { context.navigate(navigation, backPage); }
  
  return (
    <Wrappers.AppFrame>
      <View style={{...G.S.width(), flex:1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={s.container}
          contentContainerStyle={{...G.S.center}}
        >
          <View style={s.text}>
            <Texts.Label style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
              {"Guides functionality coming soon!"}
            </Texts.Label>
          </View>
        </ScrollView>
      </View>
    </Wrappers.AppFrame>
  );
}

const s = StyleSheet.create(
{
  container:
  {
    ...G.S.full,
  },
  content:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(70),
    position:'absolute',
    top:0,
    right:0,
    justifyContent:'flex-start',
    paddingVertical:30,
    backgroundColor:G.Colors().Highlight(),
  },
  text:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:50,
    marginBottom:20,
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:7,
  },
  button:
  {
    ...G.S.center,
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
    borderRadius:100,
    paddingBottom:2,
  },
});
  