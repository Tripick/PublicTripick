import React from "react";
import { useFocusEffect } from '@react-navigation/native';
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";

export default function Initializer({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  useFocusEffect(React.useCallback(() =>
  {
    const loadingContext = async () =>
    {
      console.log("Trying to load context from storage for " + context.userContext.user.userName);
      const savedContext = await G.Functions.getStore("context" + context.userContext.user.userName);
      if(
        typeof(savedContext) === 'undefined' ||
        savedContext === null ||
        Math.abs(savedContext.userContext.user.newConnectionDate - context.userContext.user.lastConnectionDate) > 10)
      {
        console.log("No context found in storage, loading from server...");
        getUserContext();
      }
      else
      {
        console.log("Context found in storage, loading context...");
        console.log("Saving context in storage for connection date...");
        const updatedContext =
        {
          ...context,
          config:
          {
            ...savedContext.config
          },
          userContext:
          {
            ...savedContext.userContext,
            user:
            {
              ...savedContext.userContext.user,
              newConnectionDate:context.userContext.user.newConnectionDate
            }
          }
        };
        await G.Functions.saveStore("context" + context.userContext.user.userName, updatedContext);
        console.log("User context updated in storage.");
        setContext(updatedContext);
        console.log("Redirecting to Homepage...");
        context.navigate(navigation, "Homepage");
      }
    };
    loadingContext();
  }, []));

  const getUserContext = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"context_get",
      isRetribution:false,
      data:{ },
      callback:getUserContextOnSuccess
    }]});
  };
  const getUserContextOnSuccess = async (response) =>
  {
    context.navigate(navigation, "Homepage");
  };

  return (
    <Wrappers.AppFrame/>
  );
}
