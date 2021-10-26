import React from "react";
import { StyleSheet, View, ScrollView, Keyboard, TextInput, Text } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Buttons from "../../Libs/Buttons";
import * as Pickers from "../../Libs/Pickers";
import * as Popups from "../../Libs/Popups";
import * as Displayers from "../../Libs/Displayers";

export default function AddFlagPopup(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const [selectedFlag, setSelectedFlag] = React.useState(props.selectedFlag);
  React.useEffect(() => { setSelectedFlag(props.selectedFlag); }, [props.show]);
  
  const [newFlagValue, setNewFlagValue] = React.useState(0);
  const [newFlagMaxValue, setNewFlagMaxValue] = React.useState(0);
  React.useEffect(() => { if(selectedFlag !== null) setSelectedFlag({...selectedFlag, value:newFlagValue}); }, [newFlagValue]);
  React.useEffect(() => { if(selectedFlag !== null) setSelectedFlag({...selectedFlag, maxValue:newFlagMaxValue}); }, [newFlagMaxValue]);

  const save = () =>
  {
    props.save(selectedFlag);
    setSelectedFlag(null);
  };

  const deleteFlag = () =>
  {
    props.delete(selectedFlag);
    setSelectedFlag(null);
  };

  const [listWidth, setListWidth] = React.useState(0);
  const flagSelector = () =>
  {
    return(
      <View style={fs.container}>
        <View style={fs.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name={props.icon ? props.icon : "bookmark-outline"}
            type="mci"
            size={30}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={fs.title}>
          <Texts.Label style={{ fontSize: 16, color:G.Colors().Highlight() }}>
            {props.title ? props.title : "Select a tag"}
          </Texts.Label>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={fs.list}
          contentContainerStyle={{ ...G.S.center, paddingBottom:22, }}
        >
          {displayAllFlags()}
        </ScrollView>
        <View style={fs.applyButton}>
          <Buttons.Label
            center
            iconRight
            alignWidth
            contentForeground
            backgroundHighlight
            iconName="check"
            type="mci"
            style={fd.buttonLabel}
            size={20}
            containerStyle={{...G.S.width()}}
            contentStyle={{...G.S.width(), borderWidth:1, borderColor:G.Colors().Foreground()}}
            iconStyle={{right:10}}
            onPress={props.applyFilters}
          >
            Apply filters
          </Buttons.Label>
        </View>
      </View>
    );
  };
  const displayAllFlags = () =>
  {
    let elements = [];
    for(let i=0; i < context.config.flags.length; i+=3)
    {
      elements.push(displayFlagSelection(i));
    }
    return elements;
  };
  const displayFlagSelection = (index) =>
  {
    const flag1 = index < context.config.flags.length ? {value:context.config.flags[index].minVal + "", config:context.config.flags[index]} : null;
    const flag2 = (index + 1) < context.config.flags.length ? {value:context.config.flags[index+1].minVal + "", config:context.config.flags[index+1]} : null;
    const flag3 = (index + 2) < context.config.flags.length ? {value:context.config.flags[index+2].minVal + "", config:context.config.flags[index+2]} : null;
    return (
      <View key={index} style={fs.line} onLayout={(event) => setListWidth(event.nativeEvent.layout.width)}>
        {displayFlagSelectionItem(flag1)}
        {flag2 === null ? <View/> : displayFlagSelectionItem(flag2)}
        {flag3 === null ? <View/> : displayFlagSelectionItem(flag3, true)}
      </View>
    );
  };
  const displayFlagSelectionItem = (f, noMargin = false) =>
  {
    const isExisting = props.existingFlags.filter((t) => t.config.id === f.config.id).length > 0;
    const flag = isExisting === true ? props.existingFlags.filter((t) => t.config.id === f.config.id)[0] : f;
    return (
      <Displayers.Touchable onPress={() => flagClick(flag)}>
        <View style={[
            fs.toSelect,
            {width:(listWidth-20*2)/3}, noMargin === true ? {marginRight:0}: {},
            isExisting === true ? {backgroundColor:G.Colors().Highlight()} : {backgroundColor:G.Colors().Foreground()}
          ]}
        >
          <View style={fs.toSelectIcon}>
            <Displayers.Icon
              name={flag.config.icon}
              type="mci"
              size={25}
              color={isExisting === true ? G.Colors().Foreground() : G.Colors().Highlight()}
            />
          </View>
          <View style={fs.toSelectTitle}>
            <Texts.Label
              style={[
                { ...G.S.width(), fontSize: 12 },
                isExisting === true ? {color:G.Colors().Foreground()} : {color:G.Colors().Highlight()}
              ]}
            >
              <Text style={isExisting === true ? { fontWeight: "bold" } : {}}>{flag.config.name}</Text>
              <Text>{isExisting === true ? "\n" + G.Functions.displayFlag(flag) : ""}</Text>
              <Text>{isExisting === true ? " to " + G.Functions.displayFlag(flag, true) : ""}</Text>
            </Texts.Label>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };
  const flagClick = (flag) =>
  {
    const isExisting = props.existingFlags.filter((t) => t.config.id === flag.config.id).length > 0;
    const existing = props.existingFlags.filter((t) => t.config.id === flag.config.id)[0];
    setSelectedFlag(
    {
      ...flag,
      value:isExisting === true ? existing.value : flag.config.minVal,
      maxValue:isExisting === true ? existing.maxValue : flag.config.maxVal,
    });
  };

  const getSlider = (isMax = false) =>
  {
    let val = isMax === true ? selectedFlag.maxValue : selectedFlag.value;
    return (
      <View style={[fd.content, selectedFlag.config.type !== "Input" ? {overflow:'visible', borderWidth:0} : {}]}>
        {selectedFlag.config.type === "Input" ?
          <TextInput
            style={fd.input}
            onChangeText={(val) => onInputChange(val, isMax)}
            value={val + ""}
            placeholderTextColor={G.Colors().placeHolderText}
            autoFocus={false}
            keyboardType={
              selectedFlag.config.valType === "Integer" ? "numeric" :
              selectedFlag.config.valType === "Double" ? "decimal-pad" :
              "default" }
            onSubmitEditing={() => {Keyboard.dismiss(); save();}}
          /> :
          selectedFlag.config.type === "Slider" ?
            (props.isRange === true ?
              <Pickers.SliderRange
                nameMin={G.Functions.displayFlag(selectedFlag)}
                nameMax={G.Functions.displayFlag(selectedFlag, true)}
                icon={selectedFlag.config.icon}
                type="mci"
                initValMin={selectedFlag.value}
                initValMax={selectedFlag.maxValue}
                boundaryMin={selectedFlag.config.minVal}
                boundaryMax={selectedFlag.config.maxVal}
                
                numberDisplay={false}
                rendering={() => ""}
                onSetValue={(minVal, maxVal) => { setNewFlagValue(minVal); setNewFlagMaxValue(maxVal); }}
                onLiveValue={(minVal, maxVal) => { setNewFlagValue(minVal); setNewFlagMaxValue(maxVal); }}
              />
              :
              <Pickers.Slider
                numberDisplay={false}
                name={selectedFlag.config.name}
                icon={selectedFlag.config.icon}
                type="mci"
                boundaryMin={isMax === true ? selectedFlag.value : selectedFlag.config.minVal}
                boundaryMax={isMax === true ? selectedFlag.config.maxVal : selectedFlag.maxValue}
                initVal={val}
                rendering={() => ""}
                onSetValue={isMax === true ? setNewFlagMaxValue : setNewFlagValue}
                onLiveValue={isMax === true ? setNewFlagMaxValue : setNewFlagValue}
              />
            )
            :
            <View style={fd.lineInput}>
              <TextInput
                style={fd.partInput}
                onChangeText={(val) => onInputChangeHour(val, isMax)}
                autoFocus={false}
                value={Math.trunc(val/60) + ""}
                placeholderTextColor={G.Colors().placeHolderText}
                keyboardType="numeric"
                maxLength={2}
              />
              <Texts.Label left style={[fd.hourDisplay, { aspectRatio:0.3 }]}>h</Texts.Label>
              <TextInput
                style={fd.partInput}
                onChangeText={(val) => onInputChangeMin(val, isMax)}
                value={val%60 + ""}
                placeholderTextColor={G.Colors().placeHolderText}
                keyboardType="numeric"
                maxLength={2}
              />
              <Texts.Label left style={fd.hourDisplay}>min</Texts.Label>
            </View>
        }
      </View>
    );
  };

  const flagDetails = () =>
  {
    const isExisting = props.existingFlags.filter((t) => t.config.id === selectedFlag.config.id).length > 0;
    return(
      <View style={fd.container}>
        <View style={fd.icon}>
          <Displayers.Icon
            alignWidth
            dark
            backgroundBright
            name={selectedFlag.config.icon}
            type="mci"
            size={50}
            color={G.Colors().Highlight()}
          />
        </View>
        <View style={fd.title}>
          <Texts.Label style={{ fontSize: 20, color:G.Colors().Highlight() }}>
            {selectedFlag.config.name + (props.isRange === true ? "" : (" : " + G.Functions.displayFlag(selectedFlag)))}
          </Texts.Label>
        </View>
        {props.isRange === true ? 
          (selectedFlag.config.type === "Slider" ?
            <View style={fd.valueContainer}>
              <Texts.Label style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {(selectedFlag.value === selectedFlag.maxValue ?
                  G.Functions.displayFlag(selectedFlag, false)
                  :
                  G.Functions.displayFlag(selectedFlag, false) + " to " + G.Functions.displayFlag(selectedFlag, true)
                ) + "\n"}
              </Texts.Label>
              {getSlider()}
            </View>
            :
            <View style={fd.valueContainer}>
              <Texts.Label style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {"From: " + G.Functions.displayFlag(selectedFlag, false)}
              </Texts.Label>
              {getSlider()}
              <Texts.Label style={{ fontSize: 14, color:G.Colors().Neutral(0.6) }}>
                {"\n\n\nTo: " + G.Functions.displayFlag(selectedFlag, true)}
              </Texts.Label>
              {getSlider(true)}
            </View>
          )
          :
          getSlider()
        }
        {
          isExisting === true ?
          <View style={fd.footerContainer}>
            <View style={fd.footer}>
              <View style={[fd.buttonContainer, {marginRight:5}]}>
                <Buttons.Label
                  center
                  iconLeft
                  iconName="trash-can-outline"
                  type="mci"
                  alignWidth
                  contentForeground
                  backgroundBright
                  style={fd.buttonLabel}
                  borderStyle={{borderWidth:1, borderColor:G.Colors().Fatal}}
                  color={G.Colors().Fatal}
                  size={20}
                  containerStyle={{...G.S.width()}}
                  contentStyle={{...G.S.width(), paddingLeft:20}}
                  iconStyle={{left:10}}
                  onPress={deleteFlag}
                >
                  Delete
                </Buttons.Label>
              </View>
              <View style={[fd.buttonContainer, {marginLeft:5}]}>
                <Buttons.Label
                  center
                  iconRight
                  alignWidth
                  contentForeground
                  backgroundHighlight
                  iconName="check"
                  type="mci"
                  style={fd.buttonLabel}
                  size={20}
                  containerStyle={{...G.S.width()}}
                  contentStyle={{
                    ...G.S.width(),
                    paddingRight:15,
                    borderWidth:1,
                    borderColor:G.Colors().Foreground(),
                  }}
                  iconStyle={{right:10}}
                  onPress={save}
                >
                  Save
                </Buttons.Label>
              </View>
            </View>
          </View>
          :
          <View style={fd.button}>
            <Buttons.Round
              shadow
              backgroundHighlight
              name="check"
              type="mci"
              size={22}
              color={G.Colors().Background()}
              onPress={save}
              contentStyle={{borderWidth:1, borderColor:G.Colors().Foreground(),}}
            />
          </View>
        }
      </View>
    );
  };
  const onInputChange = (val, isMax = false) =>
  {
    let newVal = null;
    if(val === "")
      newVal = "0";
    else if(selectedFlag.config.valType === "Integer")
    {
      const cleanResult = G.Functions.cleanInteger(val);
      if(cleanResult.isValid === true)
        newVal = (parseInt(cleanResult.val) + "");
    }
    else if(selectedFlag.config.valType === "Double")
    {
      const cleanResult = G.Functions.cleanDouble(val);
      if(cleanResult.isValid === true)
        newVal = parseFloat(cleanResult.val);
    }
    else
      newVal = G.Functions.cleanText(val);

    if(newVal !== null && newVal !== "")
      isMax === true ? setNewFlagMaxValue(newVal) : setNewFlagValue(newVal);
  };

  const onInputChangeHour = (val, isMax = false) =>
  {
    if(val === "")
      val = "0";
    const cleanResult = G.Functions.cleanInteger(val);
    if(cleanResult.isValid === true)
    {
      isMax === true ?
        setNewFlagMaxValue(parseInt(selectedFlag.maxValue)%60 + parseInt(cleanResult.val) * 60)
        :
        setNewFlagValue(parseInt(selectedFlag.value)%60 + parseInt(cleanResult.val) * 60);
    }
  };

  const onInputChangeMin = (val, isMax = false) =>
  {
    if(val === "")
      val = "0";
    const cleanResult = G.Functions.cleanInteger(val);
    if(cleanResult.isValid === true)
    {
      isMax === true ?
        setNewFlagMaxValue(Math.trunc(parseInt(selectedFlag.maxValue)/60)*60 + parseInt(cleanResult.val))
        :
        setNewFlagValue(Math.trunc(parseInt(selectedFlag.value)/60)*60 + parseInt(cleanResult.val));
    }
  };
  
  return (
    <Displayers.Touchable onPress={() => Keyboard.dismiss()}>
      <Popups.Popup
        top={false}
        transparent={true}
        containerStyle={{ ...G.S.height(97), ...G.S.width(96) }}
        visible={props.show}
        hide={() => selectedFlag === null ? props.hide() : setSelectedFlag(null)}
      >
        <View style={s.container}>
          {selectedFlag === null ? flagSelector() : flagDetails()}
        </View>
      </Popups.Popup>
    </Displayers.Touchable>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    //paddingBottom:"10%",
    //justifyContent:'space-evenly',
  },
  button:
  {
    ...G.S.center,
    height:60,
    ...G.S.width(),
    marginTop:10,
  },
});

let fs = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.full,
    paddingVertical:"5%",
    paddingHorizontal:"5%",
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    marginTop:15,
    marginBottom:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    marginBottom:25,
  },
  applyButton:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:6,
  },
  list:
  {
    ...G.S.full,
    backgroundColor: G.Colors().Foreground(),
  },
  line:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection:'row',
    alignContent:'flex-start',
    justifyContent:'flex-start',
    marginBottom: 10,
  },
  toSelect:
  {
    ...G.S.center,
    aspectRatio: 1,
    backgroundColor: G.Colors().Foreground(),
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    borderRadius:17,
    marginRight:20,
    marginBottom:15,
    paddingBottom:5,
  },
  toSelectIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:3,
  },
  toSelectTitle:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:3,
  },
});

let fd = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:"10%",
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5,
    marginTop:-15,
  },
  valueContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingVertical:20,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(80),
    aspectRatio:7,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
    marginTop:15,
  },
  button:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:5.5,
    marginTop:15,
  },
  input:
  {
    ...G.S.full,
    fontSize:16,
    color:G.Colors().Highlight(),
    textAlign:'center',
  },
  lineInput:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:3.5,
    flexDirection:"row",
  },
  partInput:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    textAlign:'center',
    borderRadius:5,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
  },
  hourDisplay:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    marginLeft:5,
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


