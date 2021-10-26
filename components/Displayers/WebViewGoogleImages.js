import React from "react";
import { StyleSheet, View, Linking, Image, TouchableWithoutFeedback } from "react-native";
import { WebView } from "react-native-webview";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
// Components
import ProgressionBar from "../../components/commons/ProgressionBar";

export default function WebViewGoogleImages(props)
{
  const webview = React.useRef();
  const uri = G.Constants.googleImagesQueryId + props.placeId;

  // Carousel
  const jsInjected = `
    var ready = function(fn)
    {
      if (typeof fn !== 'function') return;
      if (document.readyState === 'complete') return fn();
      document.addEventListener('complete', fn, false);
    };
    ready(function() { setTimeout(function () { window.ReactNativeWebView.postMessage('jsInitInjection'); }, 3000); });
  `;
  const jsToInject = `
    var imagesFetched = false;
    var iterations = 0;
    var timerInjected = setInterval(function()
    {
      if(imagesFetched === true)
      {
        clearInterval(timerInjected);
      }
      else
      {
        var allImageElements = document.querySelectorAll('img[src^="https://lh5"]');
        if(allImageElements.length > 0)
        {
          var allImageURLs = [];
          allImageElements.forEach(i => allImageURLs.push(i.getAttribute('src')));
          window.ReactNativeWebView.postMessage(allImageURLs.join(';;;;;'));
          imagesFetched = true;
        }
        else
        {
          iterations++;
          if(iterations > 10) window.ReactNativeWebView.postMessage("NoResult");
        }
      }
    }, 100);
  `;

  const [jsAlreadyInjected, setJsAlreadyInjected] = React.useState(false);
  const [imagesFetched, setImagesFetched] = React.useState(false);
  const onMessage = (event) =>
  {
    if (event.nativeEvent.data === ('jsInitInjection'))
    {
      if (jsAlreadyInjected === false && webview && webview.current)
      {
        setJsAlreadyInjected(true);
        webview.current.injectJavaScript(jsToInject);
      }
    }
    else if(imagesFetched === false)
    {
      setImagesFetched(true);
      if(event.nativeEvent.data === "NoResult")
      {
        props.saveImages(props.id, ["NO_IMAGE"]);
      }
      else
      {
        let allImagesURL = event.nativeEvent.data.split(";;;;;");
        props.saveImages(props.id, allImagesURL);
      }
    }
  };

  const linkingTo = (uri) => { Linking.openURL(uri); };
  const googlePanel = (
    <View style={s.googlePanel}>
      <View style={s.googleFrame}>
        <View style={s.googlePropertyBig}>
          <TouchableWithoutFeedback onPress={() => linkingTo(G.Constants.googleSearch)}>
            <View style={s.googleLogoContainerBig}>
              <Image source={G.Images.googleLogo} style={s.googleLogoBig} resizeMode="contain" />
            </View>
          </TouchableWithoutFeedback>
          <View style={s.disclaimerBig}>
            <Texts.Label style={{fontSize:10}}>This frame is a web view, its content is a Google search.{"\n"}Tripick is not responsible for it. Content may be subject to copyright.</Texts.Label>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <View style={s.frame}>
        <View style={s.webViewContainer}>
          <WebView
            ref={webview}
            source={{ uri: uri }}
            style={{ ...G.S.full }}
            javaScriptEnabled={true}
            onLoadEnd={() => webview.current.injectJavaScript(jsInjected)}
            onMessage={onMessage}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  frame:
  {
    ...G.S.height(300),
    ...G.S.width(),
    ...G.S.center,
  },
  webViewContainer:
  {
    ...G.S.full,
    backgroundColor:G.Colors().Foreground(),
  },
  loaderVisible:
  {
    ...G.S.center,
    ...G.S.full,
    position:'absolute',
  },
  loaderHidden:
  {
    height:0,
    width:0,
    overflow:'hidden'
  },
  googlePanel:
  {
    ...G.S.height(33.5),
    ...G.S.width(),
    backgroundColor:G.Colors().Foreground(),
  },
  googleFrame:
  {
    ...G.S.center,
    ...G.S.height(),
    ...G.S.width(),
    position:'absolute',
    top:0,
    backgroundColor:G.Colors().Foreground(),
  },
  googlePropertyBig:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  googleLogoContainerBig:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  googleLogoBig:
  {
    ...G.S.height(50),
    ...G.S.width(50),
  },
  disclaimerBig:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
});