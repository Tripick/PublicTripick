import * as React from "react";
import {StyleSheet, ScrollView, View, TextInput} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Country(props)
{
  const [context, setContext] = React.useContext(AppContext);

  // Filter
  const initFilter = "Quick search among results...";
  const [filter, setFilter] = React.useState(initFilter);
  const [filtered, setFiltered] = React.useState([]);
  const clearInitFilter = () => { if(filter === initFilter) setFilter(""); }
  const resetInitFilter = () => { if(filter === "") setFilter(initFilter); }

  // Countries
  const [countries, setCountries] = React.useState([]);
  const [showChangeLocation, setShowChangeLocation] = React.useState(false);
  const [popupTitle, setPopupTitle] = React.useState("Retrieving the country of the place...");
  React.useEffect(() =>
  {
    if(props.show === true && props.latitude !== null && props.longitude !== null)
      getCountriesByLocation(props.latitude, props.longitude);
  }, [props.latitude, props.longitude]);
  React.useEffect(() =>
  {
    const filteredCountries = countries.filter((c) =>
    (
      filter === "" || filter === initFilter ||
      (typeof(c.name) !== 'undefined' && c.name !== null && c.name.startsWith(filter))
    ));
    setFiltered(filteredCountries);
  }, [filter, countries]);
  const getCountriesByLocation = (lat, lon) =>
  {
    setShowChangeLocation(false);
    setCountries([]);
    setPopupTitle("Retrieving the country...");
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"country_getByLocation",
      isRetribution:false,
      data:{ latitude:lat, longitude:lon },
      callback:getCountriesByLocationOnSuccess
    }]});
  };
  const getCountriesByLocationOnSuccess = (response) =>
  {
    setCountries(response);
    if(response.length === 0)
    {
      setShowChangeLocation(true);
      setPopupTitle("No country found at the location");
    }
    else if(response.length === 1)
      props.onSelect(response[0]);
    else
    {
      setFilter(initFilter);
      setPopupTitle("Select the correct country");
    }
  }

  const forceGetAll = () =>
  {
    setShowChangeLocation(false);
    setCountries([]);
    setPopupTitle("Retrieving the country...");
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"country_getAll",
      isRetribution:false,
      data:{ quantity:0 },
      callback:getCountriesByLocationOnSuccess
    }]});
  };

  const getCountry = (country, index) =>
  {
    return (
      <View key={index} style={sResult.container}>
        <Displayers.Touchable onPress={() => props.onSelect(country)}>
          <View style={sResult.content}>
            <View style={sResult.label}>
              <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                {country.name}
              </Texts.Label>
            </View>
            <View style={sResult.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const getChangeLocation = () =>
  {
    if(showChangeLocation === false) return <View />;
    return (
      <View style={sResult.container}>
        <Displayers.Touchable onPress={() => props.onCancel()}>
          <View style={sResult.content}>
            <View style={sResult.label}>
              <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                Change location
              </Texts.Label>
            </View>
            <View style={sResult.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  const getForceCountry = () =>
  {
    if(showChangeLocation === false) return <View />;
    return (
      <View style={sResult.container}>
        <Displayers.Touchable onPress={() => forceGetAll()}>
          <View style={sResult.content}>
            <View style={sResult.label}>
              <Texts.Label singleLine style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Foreground() }}>
                I'm sure of the location
              </Texts.Label>
            </View>
            <View style={sResult.iconGo}>
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name="chevron-right"
                type="mci"
                size={20}
                color={G.Colors().Foreground()}
              />
            </View>
          </View>
        </Displayers.Touchable>
      </View>
    );
  };

  return (
    <Popups.Popup
      transparent={true}
      containerStyle={countries.length > 0 || showChangeLocation === true ? (countries.length > 10 ? { ...G.S.height(), ...G.S.width() } : { ...G.S.width(80) }) : { ...G.S.height(), ...G.S.width() }}
      visible={props.show}
      hide={props.hide}
      noCloseButton={true}
    >
      {countries.length > 0 || showChangeLocation === true ?
        <View style={[s.container, countries.length > 10 ? { ...G.S.full } : {}]}>
          <View style={s.icon}>
            <Displayers.Icon
              alignWidth
              dark
              backgroundBright
              name={"comment-text-outline"}
              type="mci"
              size={35}
              color={G.Colors().Highlight()}
            />
          </View>
          <View style={s.title}>
            <Texts.Label style={{ fontSize: 14, color:G.Colors().Highlight() }}>
              {popupTitle}
            </Texts.Label>
          </View>
          {countries.length > 10 ? 
            <View style={s.filter}>
              <TextInput
                style={s.filterInput}
                onChangeText={(val) => setFilter(val)}
                value={filter}
                maxLength={100}
                onFocus={clearInitFilter}
                onBlur={resetInitFilter}
              />
            </View>
            :
            <View/>
          }
          <View style={s.listContainer}>
            <ScrollView style={s.list} contentContainerStyle={{paddingTop:10, paddingBottom:30}}>
              {filtered.map(getCountry)}
              {getForceCountry()}
              {getChangeLocation()}
            </ScrollView>
          </View>
        </View>
        :
        <View/>
      }
    </Popups.Popup>
  );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    justifyContent:'flex-start',
    alignContent:'flex-start',
  },
  icon:
  {
    ...G.S.center,
    ...G.S.width(),
    marginVertical:10,
    aspectRatio:6,
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingHorizontal:"5%",
    marginTop:"-5%",
    aspectRatio:6,
  },
  filter:
  {
    ...G.S.center,
    ...G.S.width(90),
    aspectRatio:8,
  },
  filterInput:
  {
    ...G.S.full,
    textAlign: "left",
    textAlignVertical: "center",
    paddingHorizontal:10,
    color: G.Colors().Neutral(0.7),
    fontSize: 12,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Neutral(0.3),
    backgroundColor:G.Colors().Background(0.5),
  },
  listContainer:
  {
    ...G.S.center,
    minHeight:100,
    maxHeight:"80%", 
    ...G.S.width(),
  },
  list:
  {
    ...G.S.width(),
    paddingHorizontal: 20,
  },
});

let sResult = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    padding:5,
  },
  content:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(3),
    flexDirection:'row',
    justifyContent:"flex-start",
    aspectRatio:6,
    marginTop:5,
    paddingHorizontal:20,
    paddingLeft:15,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
    borderRadius:100,
    backgroundColor:G.Colors().Highlight(),
    overflow:'visible'
  },
  label:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingBottom: 2,
  },
  iconGo:
  {
    ...G.S.center,
    marginRight: 5,
    position:'absolute',
    right:0,
  },
});
