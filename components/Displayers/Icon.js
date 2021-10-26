import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesomeIcon5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

/*
<Displayers.Icon
  type="fa"/"mi"/null
  name="angle-up"
  size={20}
  color={G.Colors().Highlight()}
  style={s.iconUp}
/>
*/
export default function Icon(props)
{
  return props.fa || (props.type && props.type === "fa") ? (
    <FontAwesomeIcon5 {...props} />
  ) : props.mi || (props.type && props.type === "mi") ? (
    <MaterialIcons {...props} />
  ) : props.mci || (props.type && props.type === "mci") ? (
    <MaterialCommunityIcons {...props} />
  ) : props.f || (props.type && props.type === "f") ? (
    <Feather {...props} />
  ) : (
    <Ionicons {...props} />
  );
}
