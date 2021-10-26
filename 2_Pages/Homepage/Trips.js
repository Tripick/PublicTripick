import React from "react";
import {StyleSheet, View, Text, ScrollView, Image} from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";

export default function Trips(props)
{
  const [context, setContext] = React.useContext(AppContext);

  // Trip list : init and update via context
  const getTripList = () =>
  {
    return context.userContext !== null ? context.userContext.trips.filter(t => t.idOwner === context.userContext.user.id) : [];
  };

  const [tripsList, setTripsList] = React.useState(getTripList());
  React.useEffect(() =>
  {
    setTripsList(getTripList());
  }, [context.userContext.trips]);

  const getTrip = (trip, index) =>
  {
    const isOdd = index%2 !== 0;
    return (
      <Displayers.Touchable noFade key={index} onPress={() => props.onTripClick(trip.id)}>
        <View style={s.tripContainer}>
          <View style={s.tripFrame}>
            <View style={s.trip}>
              <View style={[s.tripTitle, isOdd === true ? s.tripTitleOdd : s.tripTitleEven]}>
                <View style={[s.dates, isOdd === true ? {justifyContent: "flex-end"} : {}]}>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{fontSize: 14, color: G.Colors().Highlight()}}>
                      {trip.startDate === null ? "-" : G.Functions.dateYearToText(trip.startDate)}
                    </Texts.Label>
                  </View>
                </View>
                <View style={s.tripTitleText}>
                  {isOdd === true ? 
                    <Texts.Label right numberOfLines={3} style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Neutral(0.8) }}>
                      {trip.name}
                    </Texts.Label>
                    :
                    <Texts.Label left numberOfLines={3} style={{ ...G.S.width(), fontSize: 14, color: G.Colors().Neutral(0.8) }}>
                      {trip.name}
                    </Texts.Label>
                  }
                </View>
                <View style={[s.dates, isOdd === true ? {justifyContent: "flex-end"} : {}]}>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{ fontSize: 12, color: G.Colors().Grey() }} >
                      {trip.startDate === null ? "-" : G.Functions.dateToText(trip.startDate, "MMM Do")}
                    </Texts.Label>
                  </View>
                  <View style={{ ...G.S.center, marginHorizontal:1 }}>
                    <Displayers.Icon
                      alignWidth
                      dark
                      noBackground
                      name="chevron-forward"
                      size={12}
                      color={G.Colors().Grey()}
                    />
                  </View>
                  <View style={{ ...G.S.center }}>
                    <Texts.Label style={{ fontSize: 12, color: G.Colors().Grey() }}>
                      {trip.endDate === null ? "-" : G.Functions.dateToText(trip.endDate, "MMM Do")}
                    </Texts.Label>
                  </View>
                </View>
              </View>
              <View style={[s.cover, isOdd === true ? {right:0} : {left:0}]}>
                <View style={s.coverFrame}>
                  <Image style={s.coverImage} source={{ uri:typeof trip !== "undefined" && trip !== null && trip.coverImage !== null && trip.coverImage !== "" ? trip.coverImage : "_"}}/>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Displayers.Touchable>
    );
  };

  const createTripWizard = () =>
  {
    setContext({ ...context, wizardTripId: null });
    props.goTo("TripWizard");
  };

  const getHeader = () =>
  {
    return (
      <View style={h.addButton}>
        <View style={h.icon}>
          <Displayers.Icon
            alignWidth
            dark
            noBackground
            name="plus"
            type="mci"
            size={20}
            color={G.Colors().Foreground()}
          />
        </View>
        <View style={h.text}>
          <Texts.Label style={{ fontSize: 14, color: G.Colors().Foreground() }}>
            Create a trip
          </Texts.Label>
        </View>
        <Displayers.TouchableOverlay onPress={createTripWizard} />
      </View>
    );
  };

  return (
    <View style={s.container}>
      {getHeader()}
      <View style={s.list}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={s.scrollView}
          contentContainerStyle={{...G.S.center, paddingTop:90}}
        >
          {tripsList.map((trip, index) => getTrip(trip, index))}
        </ScrollView>
      </View>
    </View>
  );
}

let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    backgroundColor:G.Colors().Background(),
  },
  label:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:3
  },
  list:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  scrollView:
  {
    ...G.S.full,
  },
  tripContainer:
  {
    ...G.S.center,
    paddingTop:1,
    overflow: "visible",
  },
  tripFrame:
  {
    ...G.S.center,
    ...G.S.width(98),
    overflow: "visible",
  },
  trip:
  {
    ...G.S.center,
    ...G.S.width(98),
    aspectRatio:3,
    flexDirection:'row',
  },
  cover:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    borderRadius:100,
    overflow:'visible',
    borderWidth:2,
    borderColor:G.Colors().Highlight(),
  },
  coverFrame:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
    //...G.S.shadow(5),
  },
  coverImage:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius:100,
  },
  tripTitle:
  {
    ...G.S.center,
    ...G.S.height(85),
    flex:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  tripTitleEven:
  {
    marginLeft:(G.Layout.window.width/3)/2,
    paddingLeft:(G.Layout.window.width/3)/2,
    borderTopRightRadius:100,
    borderBottomRightRadius:100,
  },
  tripTitleOdd:
  {
    marginRight:(G.Layout.window.width/3)/2,
    paddingRight:(G.Layout.window.width/3)/2,
    borderTopLeftRadius:100,
    borderBottomLeftRadius:100,
  },
  tripTitleText:
  {
    ...G.S.center,
    ...G.S.width(),
    paddingBottom:5,
  },
  dates:
  {
    ...G.S.center,
    ...G.S.width(),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "center",
    marginBottom:5,
  },
  button:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    height:35,
    marginBottom:40,
    paddingBottom:2,
    paddingHorizontal:40,
    borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  buttonText:
  {
    fontSize: 14,
    fontFamily: "label",
    color:G.Colors().Foreground(),
  },
  chevronContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    position:'absolute',
    right:0,
  },
});

let h = StyleSheet.create({
  addButton:
  {
    ...G.S.center,
    ...G.S.shadow(),
    height:40,
    aspectRatio:4,
    position:'absolute',
    top:30,
    flexDirection:'row',
    zIndex:100,
    backgroundColor:G.Colors().Highlight(),
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Foreground(),
  },
  icon:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
  },
  text:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingRight:30,
  },
});