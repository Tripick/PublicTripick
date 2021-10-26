import React from "react";
import {StyleSheet, View, ScrollView, Text, Linking} from "react-native";
// Libs
import * as G from "../../Libs/Globals";
import * as Texts from "../../Libs/Texts";
import * as Displayers from "../../Libs/Displayers";
// Components

export default function BookmarksSlider(props)
{
  const directionsTo = (startLat, startLon, endLat, endLon, withOrigin = true) =>
  {
    let url = G.Constants.googleDirectionsToLatLonWithOrigin + startLat + "," + startLon + "&destination=";
    if(withOrigin === false)
      url = G.Constants.googleDirectionsToLatLon;
    Linking.openURL(url + endLat + "," + endLon);
  };

  ////////////////////////////////////// Bookmark
  const bookmarkSlider = React.useRef(null);
  const [bookmarkSize, setBookmarkSize] = React.useState(0);
  const getBookmarks = () =>
  {
    let bookmarks = [];
    if(typeof(props.trip.itinerary.days) !== 'undefined' && props.trip.itinerary.days !== null)
    {
      bookmarks.push(
      {
        id:-2,
        index:-2,
        name:"Trip",
        subName:"",
        model:[],
        nbActiveSteps:"",
        nbSteps:""
      });
      bookmarks.push(
      {
        id:-1,
        index:-1,
        name:"Days",
        subName:"",
        model:props.trip.itinerary.days,
        nbActiveSteps:"",
        nbSteps:""
      });
      props.trip.itinerary.days.map(d => bookmarks.push(
      {
        id: d.id,
        index: d.index,
        name: ("Day " + (d.index + 1)),
        subName:G.Functions.dateToText(d.date, "MMM Do"),
        model: d,
        nbActiveSteps:(d.steps.filter(s => s.isVisit === true)).length,
        nbSteps:(d.steps.length - (d.steps.filter(s => s.isVisit === true)).length)
      }));
    }
    return bookmarks?.map((bookmark, index) => getBookmark(bookmark, index));
  };
  
  const getBookmark = (bookmark, index) =>
  {
    const isActive = props.currentDayId === bookmark.id;
    if(bookmark.index < 0) return <View key={index}/>
    return (
      <View
        key={index}
        style={s.bookmarkContainer}
        onLayout={(event) => setBookmarkSize(event.nativeEvent.layout.width)}
      >
        <View style={s.bookmark}>
          <Displayers.Touchable noFade={true} style={{...G.S.center, ...G.S.full}} onPress={() => props.selectDay(bookmark.id)}>
            <View style={[s.bookmarkContent, bookmark.index < 0 ? {borderRadius:10} : {}, isActive === true ? s.bookmarkContentActive : {}]}>
              <View style={s.title}>
                <Texts.Label>
                  <Text style={[s.titleText, isActive === true ? s.titleTextActive : {}]}>
                    {bookmark.name}
                  </Text>
                </Texts.Label>
              </View>
              {bookmark.subName.length <= 0 ?
                <View/>
                :
                <View style={s.subTitle}>
                  <Texts.Label>
                    <Text style={[s.subTitleText, isActive === true ? s.subTitleTextActive : {}]}>
                      {bookmark.subName}
                    </Text>
                  </Texts.Label>
                </View>
              }
              {bookmark.nbActiveSteps.length <= 0 ?
                <View/>
                :
                <View style={[s.nbSteps, {left:0}]}>
                  <Texts.Label>
                    <Text style={s.nbStepsText}>
                      {bookmark.nbActiveSteps}
                    </Text>
                  </Texts.Label>
                </View>
              }
              {bookmark.nbSteps.length <= 0 || bookmark.nbSteps == "0" ?
                <View/>
                :
                <View style={[s.nbSteps, {right:0, backgroundColor:G.Colors().Grey()}]}>
                  <Texts.Label>
                    <Text style={s.nbStepsTextNeutral}>
                      {bookmark.nbSteps}
                    </Text>
                  </Texts.Label>
                </View>
              }
            </View>
          </Displayers.Touchable>
        </View>
      </View>
    );
  };

  React.useEffect(() =>
  {
    const bkmIndex = props.trip.itinerary.days.indexOf(props.trip.itinerary.days.filter(d => d.id === props.currentDayId)[0]);
    const scrollPos = props.currentDayId < 0 ? 0 : (bookmarkSize * (bkmIndex - 1));
    bookmarkSlider.current.scrollTo({ x:scrollPos, y:0, animated:true });
  }, [props.currentDayId]);

  return (
    <View style={s.container}>
      <ScrollView
        ref={bookmarkSlider}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        style={s.list}
        decelerationRate="fast"
        contentContainerStyle={{paddingHorizontal:bookmarkSize/2}}
      >
        {getBookmarks()}
      </ScrollView>
      <View style={s.navButtons}>
        <View style={[s.navButton, {marginBottom:6}, props.currentDayId === -2 ? s.navButtonActive : {}]}>
          <Displayers.Touchable onPress={() => props.selectDay(-2)}>
            <Displayers.IconRound
              name={"compass-rose"} size={25} type={"mci"}
              color={props.currentDayId === -2 ? G.Colors().Foreground() : G.Colors().Highlight()}
            />
          </Displayers.Touchable>
        </View>
        <View style={[s.navButton, props.currentDayId === -1 ? s.navButtonActive : {}]}>
          <Displayers.Touchable onPress={() => props.selectDay(-1)}>
            <Displayers.IconRound
              name={"map"} size={25} type={"mci"}
              color={props.currentDayId === -1 ? G.Colors().Foreground() : G.Colors().Highlight()}
            />
          </Displayers.Touchable>
        </View>
      </View>
    </View>
  );
}

let s = StyleSheet.create(
{
  container:
  {
    ...G.S.center,
    ...G.S.width(),
    ...G.S.shadow(),
    backgroundColor:G.Colors().Foreground(),
    zIndex:2,
  },
  list:
  {
    ...G.S.width(),
  },
  navButtons:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:0.5,
    position:'absolute',
    left:0,
    paddingVertical:5,
    paddingRight:3,
  },
  navButton:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.width(),
    flex:1,
    //borderWidth:1,
    borderLeftWidth:0,
    borderTopRightRadius:100,
    borderBottomRightRadius:100,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  navButtonActive:
  {
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  bookmarkContainer:
  {
    ...G.S.center,
    height:G.Layout.window.width / 4,
    width:G.Layout.window.width / 4,
    flexDirection:'row',
  },
  bookmark:
  {
    ...G.S.center,
    height:G.Layout.window.width / 4,
    width:G.Layout.window.width / 4,
    overflow:'visible',
    paddingBottom:3,
  },
  bookmarkContent:
  {
    ...G.S.center,
    ...G.S.shadow(3),
    ...G.S.width(90),
    aspectRatio:1,
    paddingVertical:"20%",
    //borderWidth:1,
    borderRadius:100,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  bookmarkContentActive:
  {
    borderColor:G.Colors().Foreground(),
    backgroundColor:G.Colors().Highlight(),
  },
  title:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  titleText:
  {
    fontSize:16,
    color:G.Colors().Highlight(),
  },
  titleTextActive:
  {
    color:G.Colors().Foreground(),
  },
  subTitle:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginBottom:5,
  },
  subTitleText:
  {
    fontSize:12,
    color:G.Colors().Neutral(0.6),
  },
  subTitleTextActive:
  {
    color:G.Colors().Foreground(0.6),
  },
  nbSteps:
  {
    ...G.S.center,
    position:'absolute',
    bottom:0,
    borderWidth:1,
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
});
