import React from "react";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as Wrappers from "../../Libs/Wrappers";
// Component
import SearchContent from "./SearchContent";

export default function Search({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);
  const goToPlace = (idPlace) =>
  {
    setContext({ ...context, currentPlaceId: idPlace, previousPageName: "Search" });
    context.navigate(navigation, "PickSingle");
  };

  return (
    <Wrappers.AppFrame>
      {typeof(context.userContext) === 'undefined' || context.userContext === null ?
        <View/>
        :
        <SearchContent navigation={navigation} goToPlace={goToPlace} />
      }
    </Wrappers.AppFrame>
  );
}
