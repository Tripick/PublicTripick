import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";

export default function ImportActivityPopup(props)
{
  const [selected, setSelected] = React.useState([]);
  React.useEffect(() => { setSelected([]); }, [props.show]);
  const save = () =>
  {
    const activitiesToImport = props.activities.filter(a => selected.indexOf(a.id) > -1);
    props.save(activitiesToImport);
  };
  
  const selectActivity = (activityId) =>
  {
    if(selected.indexOf(activityId) > -1) setSelected(selected.filter(s => s !== activityId));
    else setSelected([...selected, activityId]);
  };

  const getItem = (activity, index) =>
  {
    const isSelected = selected.indexOf(activity.id) > -1;
    const isPersonnal = typeof(activity.visit) ==='undefined' || activity.visit === null;
    return (
      <View key={index} style={[
        ss.container,
        activity.isVisit === false ? {borderColor:G.Colors().Grey(0.3)} : {},
        isSelected === true ? {backgroundColor:G.Colors().Highlight()} : {},
      ]}>
        <View style={ss.selectButton}>
          <Displayers.IconRound
            name={activity.isVisit === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
            size={25}
            type={"mci"}
            color={G.Colors().Green()}
          />
          <Displayers.TouchableOverlay onPress={() => selectActivity(activity.id)} />
        </View>
        <View style={ss.name}>
          <Displayers.Touchable onPress={() => selectActivity(activity.id)} style={{...G.S.width()}}>
            <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
              <Text style={{fontSize: 11, color:(isSelected === true ? G.Colors().Foreground() : G.Colors().Highlight())}}>
                {isPersonnal ? activity.name : activity.visit?.place.nameTranslated}
              </Text>
            </Texts.Label>
            {activity.day === null ? <View/> :
              <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
                  <Text style={{fontSize: 9, color:(isSelected === true ? G.Colors().Foreground(0.6) : G.Colors().Neutral(0.6))}}>
                    {"Day " + (activity.day.index + 1) + " - " + G.Functions.dateToText(activity.day.date)}
                  </Text>
              </Texts.Label>
            }
          </Displayers.Touchable>
        </View>
        <View style={ss.orderButton}>
          <Displayers.IconRound
            name={"file-eye-outline"}
            size={25}
            type={"mci"}
            color={isSelected === true ? G.Colors().Foreground() : G.Colors().Highlight()}
          />
          <Displayers.TouchableOverlay onPress={() => props.setPlaceToDisplay(isPersonnal === true ? -1 : activity.visit.place.id)} />
        </View>
      </View>
    );
  };
  
  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:0 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="calendar-arrow-left"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Import activities in Day " + (props.day.index + 1)}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n" + G.Functions.dateToText(props.day.date)}
            </Text>
          </Texts.Label>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={s.list}
          contentContainerStyle={{...G.S.center}}
        >
          {props.activities.map((a, index) => getItem(a, index))}
        </ScrollView>
        <View style={s.footerContainer}>
          <View style={s.footer}>
            <View style={[s.buttonContainer, {marginLeft:5}]}>
              <Buttons.Label
                center
                shadow
                iconRight
                alignWidth
                contentForeground
                backgroundHighlight
                iconName="check"
                type="mci"
                style={s.buttonLabel}
                size={20}
                containerStyle={{...G.S.width()}}
                contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
                iconStyle={{right:10}}
                onPress={save}
              >
                Save
              </Buttons.Label>
            </View>
          </View>
        </View>
      </View>
    </Popups.Popup>
  );
}

let ss = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(94),
    aspectRatio:6,
    flexDirection:'row',
    marginVertical:5,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  index:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
  },
  name:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
  },
  selectButton:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
    marginLeft:10,
  },
  orderButton:
  {
    ...G.S.height(),
    aspectRatio:0.5,
    marginHorizontal:10,
  },
});

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingTop:30,
    justifyContent:'space-evenly',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:8,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginBottom:"5%",
  },
  buttonAdd:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    marginBottom:"5%",
  },
  list:
  {
    ...G.S.width(96),
    flex:1,
    borderWidth:1,
    borderRadius:10,
    borderColor:G.Colors().Neutral(0.2),
    backgroundColor: G.Colors().Background(),
  },
  contentContainer:
  {
    ...G.S.width(),
  },
  footerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    marginVertical:5,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:"row",
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.width(50),
    aspectRatio:3.5,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
  },
});
  