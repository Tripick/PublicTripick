import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
// Libs
import * as G from "../../Libs/Globals";

export default function WebViewGoogleSearch(props)
{
  const webview = React.useRef();
  
  return (
    <View style={{ ...G.S.full }}>
      <WebView
        automaticallyAdjustContentInsets={false}
        ref={webview}
        source={{
          uri: 'https://www.google.com/search?lr=lang_en&q=' + props.country + '+"' + props.name + '"',
        }}
        style={{...G.S.center, ...G.S.full, flex:1}}
        //javaScriptEnabled={true}
      />
    </View>
  );
}
