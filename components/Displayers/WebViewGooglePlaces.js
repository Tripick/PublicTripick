import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
// Libs
import * as G from "../../Libs/Globals";

export default function WebViewGooglePlaces(props)
{
  const webview = React.useRef();
  return (
    <View style={{ ...G.S.full }}>
      <WebView
        automaticallyAdjustContentInsets={false}
        ref={webview}
        source={{
          uri: G.Constants.googlePlacesQuery + props.coordinates,
        }}
        style={{...G.S.center, ...G.S.full, flex:1}}
      />
    </View>
  );
}
