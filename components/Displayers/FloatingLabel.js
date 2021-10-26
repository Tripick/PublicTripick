import * as React from "react";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
// Components
import Frame from "./Frame";

export default function FloatingLabel(props) {
  return (
    <Frame style={props.style} onPress={props.onPress}>
      <Texts.Label left style={{ ...G.S.height(), paddingLeft: 10 }}>
        {props.val}
      </Texts.Label>
    </Frame>
  );
}
