import React from "react";
import { View, BackHandler } from "react-native";

export default function PreventBack(props) {
  const handleBackButton = () => {
    if (props.onBack) props.onBack();
    return true;
  };

  React.useEffect(() => {
    // componentDidMount
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    // componentDidUnmount
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  return <View />;
}
