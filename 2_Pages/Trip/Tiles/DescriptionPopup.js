import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
// Libs
import * as G from "../../../Libs/Globals";
import * as Texts from "../../../Libs/Texts";
import * as Popups from "../../../Libs/Popups";
import * as Buttons from "../../../Libs/Buttons";
import * as Pickers from "../../../Libs/Pickers";
import * as Inputs from "../../../Libs/Inputs";
import * as Displayers from "../../../Libs/Displayers";

export default function DescriptionPopup(props) {
  const originalDescription = "Describe your trip in a few words here...";
  const getDescription = () => 
  {
    return typeof props.trip !== "undefined" &&
    props.trip !== null &&
    typeof props.trip.description !== "undefined" &&
    props.trip.description !== null && props.trip.description !== "" ? props.trip.description
      : originalDescription;
  };

  const updateDescription = (newDescription) =>
  {
    props.setShowDescriptionInput(false);
    props.updateTrip({
      ...props.trip,
      description: newDescription
    });
  };

  return (
    <Pickers.Multilines
        top={true}
        width={97}
        show={props.showDescriptionInput}
        hide={() => props.setShowDescriptionInput(false)}
        value={getDescription() === originalDescription ? "" : getDescription()}
        icon="file-document-edit-outline"
        title="What is the purpose of your trip?"
        save={updateDescription}
      />
  );
}
