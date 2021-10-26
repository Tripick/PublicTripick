import * as React from "react";
import { StyleSheet, Modal, SafeAreaView, View } from "react-native";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Wrappers from "../../Libs/Wrappers";

export default function Popup(props)
{
  return (
    <Modal
      animationType={props.animationType ? props.animationType : "slide"}
      transparent={true}
      visible={props.visible}
      onRequestClose={props.hide}
    >
      <SafeAreaView style={{ flex:1 }}>
        <Wrappers.PopupFrame>
          <View style={[s.modalBackground, props.top === true ? {justifyContent: "flex-start", alignItems: "center"} : {}]}>
            <View style={[s.popup, props.containerStyle, props.top === true ? {marginTop:"3%", marginBottom:"-10%"} : {}]}>
              <View style={[s.popupFrame, props.style, props.backgroundColor ? { backgroundColor: props.backgroundColor} : {}]}>
                {props.children}
                {props.noCloseButton === true || props.backButton === true ? <View/> :
                  <View style={[s.buttonClose, props.styleButtonClose]}>
                    <Buttons.Round close dark noBackground onPress={props.hide} />
                  </View>
                }
                {props.noCloseButton === true || props.backButton !== true ? <View/> :
                  <View style={[s.buttonBack, props.styleButtonBack]}>
                    <Buttons.Round back dark noBackground onPress={props.hide} />
                  </View>
                }
              </View>
            </View>
          </View>
        </Wrappers.PopupFrame>
        </SafeAreaView>
    </Modal>
  );
}

let s = StyleSheet.create(
{
  modalBackground:
  {
    ...G.S.center,
    ...G.S.full,
  },
  popup:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(),
    borderRadius: 26,
  },
  popupFrame:
  {
    ...G.S.center,
    ...G.S.width(),
    borderRadius: 26,
    backgroundColor: G.Colors().Foreground(),
    borderWidth:1,
    borderColor:G.Colors().Neutral(0.2),
  },
  buttonClose:
  {
    position: "absolute",
    maxHeight: 40,
    maxWidth: 40,
    right: 3,
    top: 3,
  },
  buttonBack:
  {
    position: "absolute",
    maxHeight: 40,
    maxWidth: 40,
    left: 3,
    top: 3,
  },
});
