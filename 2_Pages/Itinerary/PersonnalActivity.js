import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Pickers from "../../Libs/Pickers";
import LocationPicker from "../Trip/Tiles/LocationPicker";

export default function PersonnalActivity(props)
{
  const textSize = 14;
  const [labelMaxWidth, setLabelMaxWidth] = React.useState(0);
  const [showNameInput, setShowNameInput] = React.useState(false);
  const [showTimeInput, setShowTimeInput] = React.useState(false);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = React.useState(false);
  const [showPositionInput, setShowPositionInput] = React.useState(false);

  const renderLabel = (required, label, flex = 1) =>
  {
    return (
      <View style={[s.labelContainer, {flex:flex}]}>
        <View style={[s.fieldLabel, labelMaxWidth > 0 ? {width:labelMaxWidth} : {}]}
          onLayout={e => {if(e.nativeEvent.layout.width > labelMaxWidth) setLabelMaxWidth(e.nativeEvent.layout.width);}}
        >
          <Texts.Label right>
            <Text style={{fontSize: 14, color:G.Colors().Neutral(0.6)}}>
              {label}
            </Text>
            <Text style={{fontSize: 10, color:required === true ? G.Colors().Fatal : G.Colors().Neutral(0.3)}}>
              {(required === true ? "\n(Required)" : "\n(Optionnal)")}
            </Text>
          </Texts.Label>
        </View>
      </View>
    );
  };

  const renderName = () =>
  {
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable onPress={() => setShowNameInput(true)}>
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
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable onPress={() => setShowTimeInput(true)}>
          <View style={s.input}>
            <Texts.Label>
              <Text style={{fontSize: textSize, color:typeof(props.activity.time) === 'undefined' || props.activity.time === null ? G.Colors().Neutral(0.5) : G.Colors().Highlight()}}>
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
    return (
      <View style={s.fieldContainer}>
        <Displayers.Touchable onPress={() => setShowLinkInput(true)}>
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
      <View style={[s.fieldContainer, {flex:2}]}>
        <Displayers.Touchable onPress={() => setShowDescriptionInput(true)} style={{...G.S.center, ...G.S.width()}}>
          <View style={s.inputFull}>
            <Texts.Label>
              <Text style={{fontSize: textSize, color:typeof(props.activity.description) === 'undefined' || props.activity.description === null || props.activity.description.length === 0 ? G.Colors().Neutral(0.5) : G.Colors().Highlight()}}>
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
      <View style={[s.fieldContainer, {flex:2}]}>
        <LocationPicker
          helpMessage={"Move the map to place the marker"}
          showPointPicker={showPositionInput}
          setShowPointPicker={setShowPositionInput}
          onPoint={(lat, lon) => {setShowPositionInput(false); props.setActivity({...props.activity, latitude:lat, longitude:lon});}}
          latitude={typeof(props.activity.latitude) === 'undefined' || props.activity.latitude === null ? props.position.latitude : props.activity.latitude}
          longitude={typeof(props.activity.longitude) === 'undefined' || props.activity.longitude === null ? props.position.longitude : props.activity.longitude}
          latitudeDelta={G.Constants.defaultMapPoint.latitudeDelta}
          longitudeDelta={G.Constants.defaultMapPoint.longitudeDelta}
          drawPolygon={false}
          borderColor={G.Colors().Highlight()}
        />
      </View>
    );
  };

  return (
    <View style={s.container}>
      <View style={s.names}>
        {renderLabel(true, "Name")}
        {renderLabel(true, "Position", 2)}
        {renderLabel(false, "Time")}
        {renderLabel(false, "Description", 2)}
        {renderLabel(false, "Link")}
      </View>
      <View style={s.values}>
        {renderName()}
        {renderPosition()}
        {renderTime()}
        {renderDescription()}
        {renderLink()}
      </View>
      <Pickers.Multilines
        top={true}
        width={96}
        maxLength={500}
        show={showNameInput}
        hide={() => setShowNameInput(false)}
        value={props.activity.name}
        icon="file-edit-outline"
        title={"Name your personnal activity"}
        save={(newName) =>
        {
          setShowNameInput(false);
          const cleanName = G.Functions.cleanText(newName);
          props.setActivity({...props.activity, name:cleanName});
        }}
      />
      <Pickers.Time
        visible={showTimeInput}
        date={G.Functions.toMoment(typeof(props.activity.time) === 'undefined' || props.activity.time === null ? props.day.date : props.activity.time)}
        onChange={(newTime) => {setShowTimeInput(false); if (typeof(newTime?.nativeEvent?.timestamp) !== "undefined") props.setActivity({...props.activity, time:newTime.nativeEvent.timestamp})}}
      />
      <Pickers.Multilines
        top={true}
        width={96}
        maxLength={500}
        show={showLinkInput}
        hide={() => setShowLinkInput(false)}
        value={props.activity.link}
        icon="file-edit-outline"
        title={"Add a link to your personnal activity"}
        save={(newLink) =>
        {
          setShowLinkInput(false);
          const cleanLink = G.Functions.cleanURL(newLink);
          console.log(cleanLink);
          props.setActivity({...props.activity, link:cleanLink});
        }}
      />
      <Pickers.Multilines
        top={true}
        width={96}
        maxLength={500}
        show={showDescriptionInput}
        hide={() => setShowDescriptionInput(false)}
        value={props.activity.description}
        icon="file-edit-outline"
        title={"Describe your personnal activity"}
        save={(newDescription) =>
        {
          setShowDescriptionInput(false);
          const cleanDescription = G.Functions.cleanText(newDescription);
          props.setActivity({...props.activity, description:cleanDescription});
        }}
      />
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:'row',
  },
  names:
  {
    ...G.S.center,
    ...G.S.height(),
    paddingHorizontal:10,
  },
  values:
  {
    ...G.S.center,...G.S.height(),
    flex:1,
    paddingHorizontal:10,
  },
  labelContainer:
  {
    ...G.S.center,
    flex:1,
    marginBottom:10,
  },
  fieldLabel:
  {
    ...G.S.center,
    ...G.S.height(),
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  fieldContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginBottom:10,
  },
  input:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.width(96),
    aspectRatio:6,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  inputFull:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.height(92),
    ...G.S.width(96),
    paddingHorizontal:10,
    borderRadius:10,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
});
  