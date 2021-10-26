import React from "react";
import { View } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Redirector(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState(" ");

  React.useEffect(() =>
  {
    if (props.execute === true)
      launch();
  }, [props.execute]);

  const onSuccess = (response) =>
  {
    setLoading(false);
    console.log("Reached [" + props.url + "] successfully");
    props.onSuccess(response);
  };

  const onError = (error) =>
  {
    setLoading(false);
    console.log("Reaching [" + props.url + "] failed");
    console.log(error);
    setMessage(error);
    props.onBack();
  };

  launch = () =>
  {
    setLoading(true);
    console.log("Reaching [" + props.url + "]...");
    const callServer = async () => {
      await G.Functions.serverRequest(
        context.userContext,
        props.url,
        props.data,
        onSuccess,
        onError
      );
    };
    callServer();
  };

  if(props.execute === true)
  {
    return (
      <View style={{ ...G.S.center, ...G.S.full }}>
        <Texts.Label style={{ paddingTop: 70 }} numberOfLines={3}>
          {message}
        </Texts.Label>
        <Displayers.LoaderVertical isVisible={loading} />
      </View>
    );
  }
  else
  {
    return props.children;
  }
}
