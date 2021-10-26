import React from "react";
import { StyleSheet, View, Text } from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
import * as Popups from "../../Libs/Popups";
import * as Buttons from "../../Libs/Buttons";
import * as Lists from "../../Libs/Lists";
// Components
import Step from "./Step";

export default function DaysPopup(props)
{
  const createDaysObjects = (days) =>
  {
    return JSON.parse(JSON.stringify(days)).map(d => {return {...d, isSelected:true, isExpanded:false};});
  };
  const refreshIndexes = (days) =>
  {
    const activeDays = days.filter(d => d.isSelected !== false);
    if(activeDays.length > 0)
    {
      const startDayDate = days.filter(d => d.isSelected === true)
        .filter(d => d.index === Math.min(...(days.filter(d => d.isSelected === true)).map(d => d.index)))[0].date;
      activeDays.forEach((s,i) => { s.index = i; s.date = G.Functions.addDays(startDayDate, i); });
    }
  };
  const [days, setDays] = React.useState(createDaysObjects(props.days));
  React.useEffect(() => { setDays(createDaysObjects(props.days)); }, [props.days, props.show]);

  const save = () =>
  {
    let daysCopy = JSON.parse(JSON.stringify(days.filter(d => d.isSelected === true)));
    refreshIndexes(daysCopy);
    props.save(daysCopy);
  };
  
  const [tappedItem, setTappedItem] = React.useState(-1);
  const selectDay = (dayId) =>
  {
    const day = days.filter(x => x.id === dayId)[0];
    const indexOfDay = days.indexOf(day);
    const newDays = [...days];
    newDays[indexOfDay].isSelected = !newDays[indexOfDay].isSelected;
    refreshIndexes(newDays);
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
  
  const shrinkAllDays = () =>
  {
    const newDays = [...days];
    if(newDays.filter(x => x.isExpanded === true).length > 0)
    {
      newDays.filter(x => x.isExpanded === true).forEach(d => { d.isExpanded = false; });
      setDays([...newDays]);
    }
  };

  const getItem = (handler, id, day) =>
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
      if(steps.length === 0)
      {
        visits.push(
          <Texts.Label key={0} style={{ paddingVertical:10 }}>
            <Text style={{ fontSize: 11, color:G.Colors().Grey() }}>
              {"No activity to display\nSave and and click on the day to add activities."}
            </Text>
          </Texts.Label>
        );
      }
      return visits;
    };
    
    return (
      <View key={day.id} style={ss.container}>
        <View style={[
          ss.dayContainer,
          day.isSelected === false ? {borderColor:G.Colors().Fatal} : {},
          day.isExpanded === false ? {} : {backgroundColor:G.Colors().Highlight()},
        ]}>
          <View style={ss.selectButton}>
            <Displayers.IconRound
              name={day.isSelected === true ? "close" : "check"}
              size={25}
              type={"mci"}
              color={day.isSelected === true ? G.Colors().Fatal : G.Colors().Highlight()}
            />
            <Displayers.TouchableOverlay onPress={() => selectDay(day.id)} />
          </View>
          <View style={ss.name}>
            <Texts.Label left style={{ ...G.S.width(), paddingLeft:10 }}>
              <Text style={{fontSize: 14, color:(day.isSelected === false ? G.Colors().Fatal : (day.isExpanded === false ? G.Colors().Highlight() : G.Colors().Foreground()))}}>
                {"Day " + (day.isSelected === false ? "(" : "") + (day.index + 1) + (day.isSelected === false ? ")" : "")}
              </Text>
              <Text style={{fontSize: 10, color:(day.isSelected === false ? G.Colors().Fatal : (day.isExpanded === false ? G.Colors().Neutral() : G.Colors().Foreground(0.6)))}}>
                {"  " + G.Functions.dateToText(day.date, "MMM Do YYYY")}
              </Text>
              <Text style={{fontSize: 11, color:G.Colors().Fatal}}>
                {day.isSelected === false ? " (removed)" : ""}
              </Text>
            </Texts.Label>
            {typeof(day.name) === 'undefined' || day.name === null || day.name.length <= 0 ?
              <View/>
              : 
              <Texts.Label left singleLine style={{ ...G.S.width(), paddingLeft:10 }}>
                <Text style={{fontSize: 11, color:(day.isSelected === false ? G.Colors().Fatal : (day.isExpanded === false ? G.Colors().Neutral() : G.Colors().Foreground()))}}>
                  {day.name}
                </Text>
              </Texts.Label>
            }
            <Displayers.TouchableOverlay onPress={() => expandDay(day.id)} />
          </View>
          <View style={ss.orderButton} {...handler}>
            <Displayers.IconRound
              name={"compare-vertical"}
              size={25}
              type={"mci"}
              color={day.isExpanded === false ? G.Colors().Highlight() : G.Colors().Foreground()}
            />
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
          <View style={ss.expansion}>
            {getVisits(activeSteps)}
          </View>
        }
      </View>
    );
  };

  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [addAsFirst, setAddAsFirst] = React.useState(true);
  const showAdd = () =>
  {
    setAddAsFirst(true);
    setShowAddPopup(true);
  };

  const add = () =>
  {
    const newDay = {
      id: -(Math.min(...days.map(d => d.id))) - 1,
      index: addAsFirst === true ? Math.min(...days.map(d => d.index)) - 1 : Math.max(...days.map(d => d.index)) + 1,
      date: null,
      distanceToStart: 0,
      distanceToEnd: 0,
      steps: [],
    };
    let newDays = addAsFirst === true ? [newDay, ...days] : [...days, newDay];
    refreshIndexes(newDays);
    newDays = createDaysObjects(newDays);
    newDays.forEach((s,i) =>
    {
      const oldDay = days.filter(d => d.id === s.id)[0];
      if(typeof(oldDay) !== 'undefined' && oldDay !== null) s.isSelected = oldDay.isSelected;
    });
    setDays(newDays);
    setShowAddPopup(false);
  };
  
  const getOption = (isFirst) =>
  {
    return (
      <Displayers.Touchable onPress={() => setAddAsFirst(isFirst)}>
        <View style={[addP.option, addAsFirst === isFirst ? {} : addP.disabledOption]}>
          <Texts.Label>
            <Text style={[addP.optionText, addAsFirst === isFirst ? {} : addP.disabledOptionText]}>
              {isFirst === true ? "First" : "Last"}
            </Text>
          </Texts.Label>
        </View>
      </Displayers.Touchable>
    );
  };

  const getAddPopup = () =>
  {
    return (
      <Popups.Popup
        noCloseButton={false}
        top={false}
        transparent={true}
        containerStyle={{ ...G.S.width(85) }}
        style={{  }}
        visible={showAddPopup}
        hide={() => setShowAddPopup(false)}
      >
        <View style={addP.container}>
          <View style={addP.title}>
            <Texts.Label>
              <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
                {"Add a new day in the list as"}
              </Text>
            </Texts.Label>
          </View>
          <View style={addP.options}>
            {getOption(true)}
            {getOption(false)}
          </View>
          <View style={[addP.buttonContainer, {marginLeft:5}]}>
            <Buttons.Label
              center
              iconRight
              alignWidth
              contentForeground
              backgroundHighlight
              iconName="plus"
              type="mci"
              style={addP.buttonLabel}
              size={20}
              containerStyle={{...G.S.width()}}
              contentStyle={{...G.S.width(),paddingRight:5, borderWidth:1, borderColor:G.Colors().Foreground()}}
              iconStyle={{right:10}}
              onPress={add}
            >
              Add new day
            </Buttons.Label>
          </View>
        </View>
      </Popups.Popup>
    );
  };

  React.useEffect(() =>
  {
    if(showAddPopup === false && addAsFirst === false)
    {
      setTappedItem(days.length);
      setDays([...days]);
    }
  }, [showAddPopup]);
  
  return (
    <Popups.Popup
      noCloseButton={false}
      backButton={true}
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
            name="order-bool-descending-variant"
            type="mci"
            size={40}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={s.title}>
          <Texts.Label>
            <Text style={{fontSize: 16, color:G.Colors().Highlight()}}>
              {"Select and order days"}
            </Text>
            <Text style={{fontSize: 12, color:G.Colors().Neutral(0.6)}}>
              {"\n\nClick on a day for more details"}
            </Text>
          </Texts.Label>
        </View>
        <View style={s.buttonAdd}>
          <Buttons.Round
            shadow
            backgroundHighlight
            name="plus"
            type="mci"
            size={22}
            color={G.Colors().Background()}
            onPress={showAdd}
            contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
          />
        </View>
        <Lists.SortList
          horizontal={false}
          data={days}
          renderItem={getItem}
          save={setDays}
          edgingDelay={350}
          lockItemsOnEdges={false}
          edgeZonePercent={5}
          edgeColor={G.Colors().Highlight(0.3)}
          style={s.list}
          contentContainerStyle={s.contentContainer}
          onStartMoving={shrinkAllDays}
          forceScrollTo={tappedItem}
          resetForceScrollTo={() => setTappedItem(-1)}
        />
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
      {getAddPopup()}
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
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
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
    ...G.S.center,
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

let addP = StyleSheet.create(
  {
    container:
    {
      ...G.S.center,
      ...G.S.width(),
      paddingVertical:35,
    },
    title:
    {
      ...G.S.center,
      ...G.S.width(),
      paddingHorizontal:15,
    },
    options:
    {
      ...G.S.center,
      ...G.S.width(),
      marginVertical:15,
    },
    option:
    {
      ...G.S.center,
      ...G.S.width(50),
      aspectRatio:4,
      marginVertical:5,
      borderWidth:1,
      borderRadius:100,
      borderColor:G.Colors().Highlight(),
      backgroundColor: G.Colors().Foreground(),
    },
    disabledOption:
    {
      borderWidth:0,
      backgroundColor: G.Colors().Background(),
    },
    optionText:
    {
      fontSize: 16,
      color:G.Colors().Highlight(),
    },
    disabledOptionText:
    {
      color:G.Colors().Grey(),
    },
    buttonContainer:
    {
      ...G.S.center,
      ...G.S.width(75),
      aspectRatio:6,
    },
    buttonLabel:
    {
      ...G.S.center,
      ...G.S.width(),
      flex: 1,
    },
  });
  