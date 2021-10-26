import React from "react";
import { StyleSheet, View, Text, Linking } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import LocationPicker from "../Trip/Tiles/LocationPicker";

export default function PersonnalActivityReadOnly(props)
{
  const textSize = 14;
  const [showPositionInput, setShowPositionInput] = React.useState(false);

  const goToPosition = () =>
  {
    Linking.openURL(
      G.Constants.googlePlacesQuery +
      G.Functions.cleanCoordinate(props.activity.latitude) + "," +
      G.Functions.cleanCoordinate(props.activity.longitude));
  };

  const renderName = () =>
  {
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable noFade={true} onPress={() => setShowNameInput(true)}>
          <View style={s.input}>
              <Texts.Label>
                <Text style={{fontSize: textSize, color:typeof(props.activity.name) === 'undefined' || props.activity.name === null || props.activity.name.length === 0 ? G.Colors().Neutral(0.5) : G.Colors().Highlight()}}>
                  {typeof(props.activity.name) === 'undefined' || props.activity.name === null || props.activity.name.length === 0 ? "Name your activity..." : props.activity.name}
                </Text>
              </Texts.Label>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const renderTime = () =>
  {
    if(typeof(props.activity.time) === 'undefined' ||
      props.activity.time === null ||
      G.Functions.dateOnlyTime(props.activity.time) === "00:00")
      return <View/>;
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable noFade={true} onPress={() => setShowTimeInput(true)}>
          <View style={s.input}>
            <Texts.Label>
              <Text style={{fontSize: textSize, color:typeof(props.activity.time) === 'undefined' || props.activity.time === null ? G.Colors().Neutral(0.5) : G.Colors().Neutral(0.6)}}>
                {typeof(props.activity.time) === 'undefined' || props.activity.time === null ? "At what time?" : G.Functions.dateOnlyTime(props.activity.time)}
              </Text>
            </Texts.Label>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const renderLink = () =>
  {
    if(typeof(props.activity.link) === 'undefined' ||
      props.activity.link === null ||
      props.activity.link.length === 0)
      return <View/>;
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable noFade={true} onPress={() =>
        {
          if(typeof(props.activity.link) !== 'undefined' && props.activity.link !== null)
            Linking.openURL(props.activity.link);
          else
            setShowLinkInput(true);
        }}>
          <View style={s.input}>
            <Texts.Label singleLine>
              <Text style={{fontSize: 12, color:typeof(props.activity.link) === 'undefined' || props.activity.link === null || props.activity.link.length === 0 ? G.Colors().Neutral(0.5) : G.Colors().Highlight()}}>
                {typeof(props.activity.link) === 'undefined' || props.activity.link === null || props.activity.link.length === 0 ? "Add a link : https://..." : props.activity.link}
              </Text>
            </Texts.Label>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const renderDescription = () =>
  {
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable noFade={true} onPress={() => setShowDescriptionInput(true)} style={{...G.S.center, ...G.S.width()}}>
          <View style={s.input}>
            <Texts.Label>
              <Text style={{fontSize: textSize, color:typeof(props.activity.description) === 'undefined' || props.activity.description === null || props.activity.description.length === 0 ? G.Colors().Neutral(0.5) : G.Colors().Neutral(0.6)}}>
                {typeof(props.activity.description) === 'undefined' || props.activity.description === null || props.activity.description.length === 0 ? "Describe your activity..." : props.activity.description}
              </Text>
            </Texts.Label>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const renderPosition = () =>
  {
    return (
      <View style={[s.fieldContainer, {aspectRatio:2}]}>
        <LocationPicker
          helpMessage={"Move the map to place the marker"}
          showPointPicker={showPositionInput}
          setShowPointPicker={setShowPositionInput}
          onPoint={(lat, lon) => {setShowPositionInput(false); props.setActivity({...props.activity, latitude:lat, longitude:lon});}}
          latitude={typeof(props.activity.latitude) === 'undefined' || props.activity.latitude === null ? 0 : props.activity.latitude}
          longitude={typeof(props.activity.longitude) === 'undefined' || props.activity.longitude === null ? 0 : props.activity.longitude}
          latitudeDelta={G.Constants.defaultMapPoint.latitudeDelta}
          longitudeDelta={G.Constants.defaultMapPoint.longitudeDelta}
          drawPolygon={false}
          borderColor={G.Colors().Highlight()}
          readOnly={true}
        />
        <Displayers.TouchableOverlay onPress={goToPosition}/>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {typeof(props.activity) === 'undefined' || props.activity === null ? <View/> :
        <View style={s.values}>
          {renderName()}
          {renderTime()}
          {renderLink()}
          {renderDescription()}
          {renderPosition()}
        </View>
      }
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:'row',
  },
  values:
  {
    ...G.S.center,
    flex:1,
    paddingHorizontal:10,
  },
  fieldContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    marginBottom:5,
  },
  input:
  {
    ...G.S.center,
    ...G.S.width(96),
  },
});
  