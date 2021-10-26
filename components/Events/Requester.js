import React from "react";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";

export default function Requester(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() =>
  {
    if (props.requester !== null)
    {
      if(props.requester.noLoader !== true)
        setLoading(true);
      execute({...props.requester});
    }
  }, [props.requester]);

  const execute = (req) =>
  {
    const stopWatch = new Date();
    console.log("Requester  -> " + req.url);
    G.Functions.serverRequest(
      context.userContext,
      req.url,
      req.data,
      (response) =>
      {
        setLoading(false);
        console.log("Requester  -> Responded in " + (Math.trunc(((new Date()) - stopWatch)/100)/10) + " sec.");
        req.onSuccess(response, req.data);
      },
      (error) =>
      {
        const errorMessage = "Request error : [" + req.url + "]";
        console.log(errorMessage);
        console.log(error);
        if(props.displayMessage) props.displayMessage(errorMessage);
        setLoading(false);
      }
    );
  }
  return <Displayers.LoaderVertical isVisible={loading} />;
}
