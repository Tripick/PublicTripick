import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";
import * as Lists from "../../Libs/Lists";
// Components
import Step from "./Step";

export default function MoveToDayPopup(props)
{
  const createDaysObjects = (days) =>
  {
    return JSON.parse(JSON.stringify(days)).map(d =>
    {
      let containSelectedStep = false;
      if(typeof(d.steps) !== 'undefined' && d.steps !== null)
        containSelectedStep = d.steps.filter(s => s.id === props.step.id).length > 0;
      return {...d, isSelected:containSelectedStep, isExpanded:false};
    });
  };
  const [days, setDays] = React.useState(createDaysObjects(props.days));
  React.useEffect(() => { setDays(createDaysObjects(props.days)); }, [props.days, props.show]);
  
  const save = () =>
  {
    const allSelectedDays = days.filter(x => x.isSelected === true);
    if(allSelectedDays.length === 1) props.save(allSelectedDays[0].id, props.step);
  };

  const [tappedItem, setTappedItem] = React.useState(-1);
  const selectDay = (dayId) =>
  {
    const day = days.filter(x => x.id === dayId)[0];
    const indexOfDay = days.indexOf(day);
    const newDays = [...days];
    newDays.filter(x => x.id !== dayId && x.isSelected === true).forEach(d => { d.isSelected = false; });
    newDays[indexOfDay].isSelected = true;
    setTappedItem(day.index);
    setDays([...newDays]);
  };
  const expandDay = (dayId) =>
  {
    const day = days.filter(x => x.id === dayId)[0];
    const indexOfDay = days.indexOf(day);
    const newDays = [...days];
    newDays.filter(x => x.id !== dayId && x.isExpanded === true).forEach(d => { d.isExpanded = false; });
    newDays[indexOfDay].isExpanded = !newDays[indexOfDay].isExpanded;
    setTappedItem(day.index);
    setDays([...newDays]);
  };

  const getItem = (day) =>
  {
    const activeSteps = day.steps.filter(s => s.isVisit === true);
    const inactiveSteps = day.steps.filter(s => s.isVisit === false);
    const getVisits = (steps) =>
    {
      let visits = [];
      for(let i = 0; i < steps.length; i++)
      {
        visits.push(<Step
          key={i}
          step={steps[i]}
          isActive={steps[i].isVisit}
          isFirst={steps[i].index === 0}
          isLastActive={steps[i].isVisit === true && ((i + 1) === steps.length || steps[i + 1].isVisit === false)}
          isLast={(i + 1) === steps.length}
          setPlaceToDisplay={props.setPlaceToDisplay}
        />);
      }
      return visits;
    };
    return (
      <View key={day.id} style={ss.container}>
        <View style={[
          ss.dayContainer,
          day.isSelected === false ? {borderColor:G.Colors().Highlight(), backgroundColor:G.Colors().Foreground()} : {},
          day.isExpanded === false ? {} : { backgroundColor:(day.isSelected === true ? G.Colors().Green() : G.Colors().Highlight())},
        ]}>
          {/* <View style={ss.selectButton}>
            <Displayers.IconRound
              name={day.isExpanded === false ? "chevron-right" : "chevron-down"}
              size={25}
              type={"mci"}
              color={day.isExpanded === true ? G.Colors().Foreground() : day.isSelected === false ? G.Colors().Highlight() : G.Colors().Foreground()}
            />
            <Displayers.TouchableOverlay onPress={() => expandDay(day.id)} />
          </View> */}
          <View style={ss.name}>
            <Texts.Label left style={{ ...G.S.width(), paddingLeft:10 }}>
              <Displayers.Touchable onPress={() => expandDay(day.id)}>
                <Texts.Label left style={{ ...G.S.width(), paddingLeft:10 }}>
                  <Text style={{fontSize: 14, color:(day.isExpanded === true ? G.Colors().Foreground() : (day.isSelected === true ? G.Colors().Foreground() : G.Colors().Highlight()))}}>
                    {"Day " + (day.index + 1)}
                  </Text>
                  <Text style={{fontSize: 10, color:(day.isExpanded === true ? G.Colors().Foreground() : (day.isSelected === true ? G.Colors().Foreground() : G.Colors().Neutral(0.6)))}}>
                    {"  " + G.Functions.dateToText(day.date, "MMM Do YYYY")}
                  </Text>
                </Texts.Label>
                {typeof(day.name) === 'undefined' || day.name === null || day.name.length <= 0 ?
                  <View/>
                  : 
                  <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
                    <Text style={{fontSize: 11, color:(day.isExpanded === true ? G.Colors().Foreground() : (day.isSelected === true ? G.Colors().Foreground() : G.Colors().Neutral(0.6)))}}>
                      {day.name}
                    </Text>
                  </Texts.Label>
                }
              </Displayers.Touchable>
            </Texts.Label>
          </View>
          <View style={ss.orderButton}>
            <Displayers.IconRound
              name={day.isSelected === false ? "checkbox-blank-circle-outline" : "check-circle-outline"}
              size={25}
              type={"mci"}
              color={day.isExpanded === true ? G.Colors().Foreground() : day.isSelected === false ? G.Colors().Highlight() : G.Colors().Foreground()}
            />
            <Displayers.TouchableOverlay onPress={() => selectDay(day.id)} />
          </View>
          {activeSteps.length <= 0 ? <View/> :
            <View style={[ss.nbSteps, {top:-3, left:-5}]}>
              <Texts.Label>
                <Text style={ss.nbStepsText}>
                  {activeSteps.length}
                </Text>
              </Texts.Label>
            </View>
          }
          {inactiveSteps.length <= 0 ? <View/> :
            <View style={[ss.nbSteps, {bottom:-3, left:-5, backgroundColor:G.Colors().Grey()}]}>
              <Texts.Label>
                <Text style={ss.nbStepsTextNeutral}>
                  {inactiveSteps.length}
                </Text>
              </Texts.Label>
            </View>
          }
        </View>
        {day.isExpanded === false ?
          <View/>
          :
          <View style={[ss.expansion, day.isSelected === true ? {borderColor:G.Colors().Green()} : {}]}>
            {getVisits(activeSteps)}
          </View>
        }
      </View>
    );
  };
  
  return (
    <Popups.Popup
      noCloseButton={false}
      top={false}
      transparent={true}
      containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
      style={{ paddingBottom:20 }}
      visible={props.show}
      hide={props.hide}
    >
      <View style={s.container}>
        <View style={s.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name="calendar-arrow-right"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Move activity to another day"}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n\nClick on a day for more details"}
            </Text>
          </Texts.Label>
        </View>
        {days === null ? <View/> : 
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={s.list}
            contentContainerStyle={{ ...G.S.center, paddingTop:5 }}
          >
            {days.map((d,i) => getItem(d))}
          </ScrollView>
        }
        <View style={s.footerContainer}>
          <View style={s.footer}>
            <View style={[s.buttonContainer, {marginLeft:5}]}>
              <Buttons.Label
                center
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
    ...G.S.width(96),
    marginVertical:8,
    overflow:'visible',
  },
  dayContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
    flexDirection:'row',
    borderRadius:10,
    borderWidth:1,
    borderColor:G.Colors().Green(),
    backgroundColor:G.Colors().Green(),
    zIndex:2,
    overflow:'visible',
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
  nbSteps:
  {
    ...G.S.center,
    position:'absolute',
    //borderWidth:1,
    borderColor:G.Colors().Foreground(),
    borderRadius:100,
    backgroundColor:G.Colors().Green(),
    paddingBottom:1,
    paddingHorizontal:5,
  },
  nbStepsText:
  {
    fontSize:12,
    color:G.Colors().Foreground(),
  },
  nbStepsTextNeutral:
  {
    fontSize:12,
    color:G.Colors().Foreground(0.8),
  },
  expansion:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:-((G.Layout.window.width * 0.96) / 6) / 2,
    paddingTop:((G.Layout.window.width * 0.96) / 6) / 2,
    borderWidth:1,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Background(),
    zIndex:1,
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
    aspectRatio:10,
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
    ...G.S.width(80),
    aspectRatio:7,
    marginTop:20,
  },
  footer:
  {
    ...G.S.center,
    ...G.S.full,
    flexDirection:"row",
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex: 1,
  },
  buttonLabel:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
  },
});
  