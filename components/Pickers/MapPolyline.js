import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT, MAP_TYPES, Polyline } from "react-native-maps";
// Libs
import * as Buttons from "../../Libs/Buttons";
import * as G from "../../Libs/Globals";
import * as Popups from "../../Libs/Popups";
import * as Texts from "../../Libs/Texts";
import * as Views from "../../Libs/Views";
import * as Displayers from "../../Libs/Displayers";

export default function MapPolyline(props)
{
  const precision = 40;
  
  const [loading, setLoading] = React.useState(false);
  const [isExecuting, setIsExecuting] = React.useState(false);
  React.useEffect(() =>
  {
    if (isExecuting === true)
    {
      setIsExecuting(false);
      calculateArea();
      setLoading(false);
    }
  }, [isExecuting]);

  const [region, setRegion] = React.useState({
    latitude: props.latitude !== null ? props.latitude : G.Constants.defaultMapPoint.latitude,
    longitude: props.longitude !== null ? props.longitude : G.Constants.defaultMapPoint.longitude,
    latitudeDelta: props.latitudeDelta !== null ? props.latitudeDelta : G.Constants.defaultMapPoint.latitudeDelta,
    longitudeDelta: props.longitudeDelta !== null ? props.longitudeDelta : G.Constants.defaultMapPoint.longitudeDelta,
  });
  const applyRegion = (newRegion) =>
  {
    setRegion({...newRegion, longitudeDelta: newRegion.longitudeDelta > -200 ? newRegion.longitudeDelta : 126});
  }
  
  const [polygon, setPolygon] = React.useState(typeof props.trip?.polygon === 'undefined' || props.trip?.polygon === null ? [] : props.trip?.polygon);
  const [lastDrawingTime, setLastDrawingTime] = React.useState(Date.now());
  const [messageToDisplay, setMessageToDisplay] = React.useState("");
  const [movable, setMovable] = React.useState(typeof props.trip?.polygon === 'undefined' || props.trip?.polygon === null);

  const getMessage = () =>
  {
    if(movable === true)
      return "Move and zoom on the map,\nthen click 'Draw here'";
    else
    {
      if(messageToDisplay === "")
        return "Draw on the map\nto select the area of your trip";
      else
        return messageToDisplay;
    }
  }

  const reset = () =>
  {
    setPolygon([]);
    setMessageToDisplay("");
    setMovable(true);
    if(typeof(props.setDirty) !== 'undefined') props.setDirty(true);
  }

  const onDrag = (e) =>
  {
    if(messageToDisplay !== "")
      setMessageToDisplay("");
    if(movable === true) return;
    if(polygon.length > 0 && (Date.now() - lastDrawingTime) > 300)
      setPolygon([]);
    else if(polygon.length <= 0 || (Date.now() - lastDrawingTime) > 60)
    {
      setPolygon([...polygon, e.nativeEvent.coordinate]);
      setLastDrawingTime(Date.now());
    }
  };

  const onValidate = () =>
  {
    setLoading(true);
    setIsExecuting(true);
  }

  const calculateArea = async () =>
  {
    if(movable === true)
      setMovable(false);
    else
    {
      let p = [...polygon];
      if(p.length <= 0)
        return;
      
      // Get maximums
      const lats = p.map((a) => a.latitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const lons = p.map((a) => a.longitude);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);
      const amplLat = maxLat - minLat;
      const amplLon = maxLon - minLon;

      // Create matrix
      const tileSize = amplLat / precision;
      //const tileSize = 0.5;
      const matrixWidth = Math.trunc(amplLat / tileSize) + 3;
      const matrixHeight = Math.trunc(amplLon / tileSize) + 3;
      const matrix = new Array(matrixWidth);
      for (var i = 0; i < matrixWidth; i++)
      {
        matrix[i] = new Array(matrixHeight);
      }
      
      // Populate matrix
      for (var x = 0; x < matrixWidth; x++)
      {
        for (var y = 0; y < matrixHeight; y++)
        {
          matrix[x][y] =
          {
            x: x,
            y: y,
            minLat: minLat + tileSize * x,
            maxLat: minLat + tileSize * (x + 1),
            minLon: minLon + tileSize * y,
            maxLon: minLon + tileSize * (y + 1),
            isPolygon: false,
            isInPolygon: false,
            isOut: false,
          };
        }
      }

      // Complete polygon
      // The lines between 2 points on the polygon can be big
      // In order to make sure that every line and column of the matrix contain at least one point
      // in the table if the polygon crosses this particular line or column
      // We add points between 2 points of the polygon (as if we added more resolution to our polygon)
      let pCompleted = [];
      const pLength = p.length;
      for (var i = 0; i < pLength; i++)
      {
        pCompleted.push(p[i]);
        const indexToNext = (i === pLength - 1 ? 0 : i + 1);
        const distanceToNextPoint = Math.sqrt(Math.pow(p[i].latitude - p[indexToNext].latitude, 2) + Math.pow(p[i].longitude - p[indexToNext].longitude, 2));
        const numberOfPointsToAdd = distanceToNextPoint / tileSize;
        if(numberOfPointsToAdd > 1)
        {
          for (var j = 1; j < numberOfPointsToAdd; j++)
          {
            const pointToAdd = {
              latitude: p[i].latitude + ((Math.abs(p[i].latitude - p[indexToNext].latitude) / numberOfPointsToAdd) * j) * (p[i].latitude > p[indexToNext].latitude ? -1 : 1),
              longitude: p[i].longitude + ((Math.abs(p[i].longitude - p[indexToNext].longitude) / numberOfPointsToAdd) * j) * (p[i].longitude > p[indexToNext].longitude ? -1 : 1),
            };
            pCompleted.push(pointToAdd);
          }
        }
      }
      p = [...pCompleted];

      // Flag polygon's tiles
      // For each point of the polygon, we mark their matrix point as "in" and "on" the polygon
      // This is useful to ensure the line and column of the matrix that cross the polygon are
      // flagged as "containing the polygon"
      for (var i = 0; i < p.length; i++)
      {
        const polygonPoint = p[i];
        const x = Math.trunc((polygonPoint.latitude - minLat) / tileSize) + 1;
        const y = Math.trunc((polygonPoint.longitude - minLon) / tileSize) + 1;
        matrix[x][y].isPolygon = true;
        matrix[x][y].isInPolygon = true;
      }

      // Eliminate all tiles who are directly connected to the border or a chained neighbour of one
      // From Top to Bottom then Bottom to Top : isOut = true
      for (var x = 0; x < matrixWidth; x++)
      {
        for (var y = 0; y < matrixHeight; y++)
        {
          if(matrix[x][y].isPolygon === true)
          {
            for (var yB = matrixHeight - 1; yB > y; yB--)
            {
              if(matrix[x][yB].isPolygon === true) break;
              else matrix[x][yB].isOut = true;
            }
            break;
          }
          else matrix[x][y].isOut = true;
        }
      }
      // From Left to Right then Right to Left : isOut = true
      for (var y = 0; y < matrixHeight; y++)
      {
        for (var x = 0; x < matrixWidth; x++)
        {
          if(matrix[x][y].isPolygon === true)
          {
            for (var xB = matrixWidth - 1; xB > x; xB--)
            {
              if(matrix[xB][y].isPolygon === true) break;
              else matrix[xB][y].isOut = true;
            }
            break;
          }
          else matrix[x][y].isOut = true;
        }
      }

      // Scan horizontal
      // Here is the real computation
      // Each line is scanned to make sure each matrix point contained in the polygon is flagged as "in"
      for (var x = 0; x < matrixWidth; x++)
      {
        let isIn = false;
        let isOn = false;
        let fromPrevious = false;
        for (var y = 0; y < matrixHeight; y++)
        {
          const tile = matrix[x][y];
          if(x > 0 && tile.isPolygon === false && matrix[x-1][y].isPolygon === false)
          {
            isOn = false;
            isIn = matrix[x-1][y].isInPolygon || (y > 0 && matrix[x][y-1].isPolygon === false && matrix[x][y-1].isInPolygon === true);
          }
          else
          {
            // White (out) -> Blue (?)
            if(isOn === false && isIn === false && tile.isPolygon === true)
            {
              isOn = true;
              fromPrevious = (matrix[x-1][y-1].isPolygon === true || matrix[x-1][y].isPolygon === true || matrix[x-1][y+1].isPolygon === true);
            }
            // Blue (out) -> White (?)
            else if (isOn === true && isIn === false && tile.isPolygon === false)
            {
              isOn = false;
              isIn = //matrix[x-1][y].isInPolygon === true &&
                  (
                    (fromPrevious === true && ((y > 2 && matrix[x+1][y-3].isPolygon === true) || matrix[x+1][y-2].isPolygon === true || matrix[x+1][y-1].isPolygon === true || matrix[x+1][y].isPolygon === true)) || 
                    (fromPrevious === false && ((y > 2 && matrix[x-1][y-3].isPolygon === true) || matrix[x-1][y-2].isPolygon === true || matrix[x-1][y-1].isPolygon === true || matrix[x-1][y].isPolygon === true))
                  );
              if(isIn === true)
              {
                let tileSwitch = 0;
                let restIsOn = false;
                for (var z = y + 1; z < matrixHeight; z++)
                {
                  if(matrix[x][z].isPolygon === true)
                  {
                    if(restIsOn === false)
                      tileSwitch++;
                    restIsOn = true;
                  }
                  else
                    restIsOn = false;
                }
                isIn = tileSwitch%2 !== 0;
              }
            }
            // White (in) -> Blue (?)
            else if (isOn === false && isIn === true && tile.isPolygon === true)
            {
              isOn = true;
              fromPrevious = (matrix[x-1][y-1].isPolygon === true || matrix[x-1][y].isPolygon === true || matrix[x-1][y+1].isPolygon === true);
            }
            // Blue (in) -> White (?)
            else if(isOn === true && isIn === true && tile.isPolygon === false)
            {
              isOn = false;
              isIn = !(fromPrevious === true && ((y > 2 && matrix[x+1][y-3].isPolygon === true) || matrix[x+1][y-2].isPolygon === true || matrix[x+1][y-1].isPolygon === true || matrix[x+1][y].isPolygon === true)) && 
                    !(fromPrevious === false && ((y > 2 && matrix[x-1][y-3].isPolygon === true) || matrix[x-1][y-2].isPolygon === true || matrix[x-1][y-1].isPolygon === true || matrix[x-1][y].isPolygon === true));
              
              // if(isIn === false && matrix[x-1][y].isPolygon === false)
              //   isIn = !(matrix[x-1][y].isInPolygon === true);
            }
          }
          
          if(tile.isPolygon === false)
            tile.isInPolygon = isIn;
        }
      }

      // Second pass to make sure some point contained in "bubbles" are correct
      // Horizontally
      for (var x = 1; x < matrixWidth-2; x++)
      {
        for (var y = 1; y < matrixHeight-2; y++)
        {
          const tile = matrix[x][y];
          if(tile.isPolygon === false && tile.isOut === false)
          {
            if(matrix[x-1][y].isPolygon === false && matrix[x-1][y].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x+1][y].isPolygon === false && matrix[x+1][y].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x][y-1].isPolygon === false && matrix[x][y-1].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x][y+1].isPolygon === false && matrix[x][y+1].isInPolygon === true)
              tile.isInPolygon = true;
          }
        }
      }
      // Vertically
      for (var x = matrixWidth-3; x > 1; x--)
      {
        for (var y = matrixHeight-3; y > 1; y--)
        {
          const tile = matrix[x][y];
          if(tile.isPolygon === false && tile.isOut === false)
          {
            if(matrix[x-1][y].isPolygon === false && matrix[x-1][y].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x+1][y].isPolygon === false && matrix[x+1][y].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x][y-1].isPolygon === false && matrix[x][y-1].isInPolygon === true)
              tile.isInPolygon = true;
            else if(matrix[x][y+1].isPolygon === false && matrix[x][y+1].isInPolygon === true)
              tile.isInPolygon = true;
          }
        }
      }

      // Merge tiles
      // In order to reduce the size of the matrix, each point will be merge into a line
      const mergeTiles = [];
      for (var x = 0; x < matrixWidth; x++)
      {
        let firstInRow = -1;
        let lastInRow = -1;
        for (var y = 0; y < matrixHeight; y++)
        {
          let tile = matrix[x][y];
          if(firstInRow === -1 && tile.isInPolygon === true)
            firstInRow = y > 0 ? y - 1 : y;
          if(firstInRow !== -1 && lastInRow === -1 && tile.isInPolygon === false)
          {
            lastInRow = y-1;
            mergeTiles.push(
            {
              latitude: matrix[x][firstInRow].minLat - tileSize,
              longitude: matrix[x][firstInRow].minLon - tileSize / 2,
              height: Math.abs(matrix[x][lastInRow].maxLat - matrix[x][firstInRow].minLat),
              width: Math.abs(matrix[x][lastInRow].maxLon - matrix[x][firstInRow].minLon)
            });
            firstInRow = -1;
            lastInRow = -1;
          }
        }
      }
      // Once each line is formed, each line can be merged with its next one to create a rectangle
      const mergedLines = [];
      for (var l = 0; l < mergeTiles.length; l++)
      {
        let nbLinesMerged = 0;
        let mergedHeight = mergeTiles[l].height;
        for (var n = l + 1; n < mergeTiles.length; n++)
        {
          // Go to next line if the longitude or width are different
          if(mergeTiles[l].longitude !== mergeTiles[n].longitude || mergeTiles[l].width !== mergeTiles[n].width)
          {
            n = mergeTiles.length;
          }
          // If it's the same longitude and width : merge 2 lines into one rectangle
          else
          {
            nbLinesMerged++;
            mergedHeight+=mergeTiles[n].height;
          }
        }

        // Save the area rectangle
        mergedLines.push(
        {
          latitude: mergeTiles[l].latitude,
          longitude: mergeTiles[l].longitude,
          height: mergedHeight,
          width: mergeTiles[l].width,
          idTrip: props.trip.id
        });
        l += nbLinesMerged;
      }

      // Calculate region
      const minLatitude = Math.min(...polygon.map(p => p.latitude));
      const maxLatitude = Math.max(...polygon.map(p => p.latitude));
      const minLongitude = Math.min(...polygon.map(p => p.longitude));
      const maxLongitude = Math.max(...polygon.map(p => p.longitude));
      const polygonRegion =
      {
        latitude:minLatitude + (maxLatitude - minLatitude)/2,
        longitude:minLongitude + (maxLongitude - minLongitude)/2,
        latitudeDelta:region.latitudeDelta,
        longitudeDelta:region.longitudeDelta
      };
      
      // Update trip
      props.updateTrip(
        polygon.length > 0 ? [...polygon, polygon[0]] : [],
        polygonRegion,
        mergedLines
      );
    }
  };

  const [mapSize, setMapSize] = React.useState(null);
  return (
    <View style={s.container}>
      <View style={s.mapContainer}
        onLayout={(event) => setMapSize({height: event.nativeEvent.layout.height, width:event.nativeEvent.layout.width })}>
        {mapSize !== null ? 
          <MapView
            style={{ ...G.S.mapHd(mapSize)}}
            provider={PROVIDER_DEFAULT}
            mapType={MAP_TYPES.NONE}
            initialRegion={region}
            onRegionChangeComplete={applyRegion}
            rotateEnabled={false}
            pitchEnabled={movable}
            scrollEnabled={movable}
            zoomEnabled={movable}
            draggable
            onPanDrag={(e) => onDrag(e)}
          >
            {Platform.OS == "android" ? <MapView.UrlTile style={{zIndex:-3}} urlTemplate={G.Constants.tileProvider} /> : <View/>}
            <Polyline
              coordinates={polygon.length > 0 ? [...polygon, polygon[0]] : []}
              strokeColor={G.Colors().Highlight()}
              strokeWidth={3}
              lineDashPattern={[1]}
            />
          </MapView>
          :
          <View/>
        }
      </View>
      <View style={s.bannerContainer}>
        <View style={s.bannerIconContainer}>
          <View style={s.bannerIcon}>
            <Displayers.Icon
              name={movable === true ? "arrow-all" : "circle-edit-outline"}
              type="mci"
              size={26}
              color={G.Colors().Highlight()}
            />
          </View>
          {/* <View style={s.bannerStep}>
            <Texts.Label style={{ fontWeight: "bold", fontSize: 16, color:G.Colors().Neutral(0.6) }}>
              {movable === true ? "1/2" : "2/2"}
            </Texts.Label>
          </View> */}
        </View>
        <View style={s.bannerTextContainer}>
          <Texts.Label left style={[s.tip, messageToDisplay === "" ? {color:G.Colors().Highlight()} : {color:G.Colors().Fatal}]}>
            {getMessage()}
          </Texts.Label>
        </View>
      </View>
      <View style={s.footerContainer}>
        <View style={s.footer}>
          <View style={s.buttonContainer}>
            {movable === false ? 
              <Buttons.Label
                center
                iconLeft
                iconName="arrow-all"
                type="mci"
                alignWidth
                contentForeground
                backgroundBright
                style={s.button}
                borderStyle={{borderWidth:1, borderColor:G.Colors().Highlight()}}
                color={G.Colors().Highlight()}
                size={20}
                containerStyle={{...G.S.width()}}
                contentStyle={{...G.S.width(), paddingLeft:20}}
                iconStyle={{left:10}}
                onPress={reset}
              >
                Move map
              </Buttons.Label>
              :
              <Buttons.Label
                center
                iconLeft
                iconName="chevron-left"
                type="mci"
                alignWidth
                contentForeground
                backgroundBright
                style={s.button}
                borderStyle={{borderWidth:1, borderColor:G.Colors().Highlight()}}
                color={G.Colors().Highlight()}
                size={20}
                containerStyle={{...G.S.width()}}
                contentStyle={{...G.S.width(), paddingLeft:20}}
                iconStyle={{left:10}}
                onPress={() => props.hide()}
              >
                Cancel
              </Buttons.Label>
              }
          </View>
          <View style={s.buttonContainer}>
            <Buttons.Label
              center
              iconRight
              alignWidth
              contentForeground
              backgroundHighlight
              iconName={movable === true ? "circle-edit-outline" : "check"}
              type="mci"
              style={s.button}
              size={20}
              containerStyle={{...G.S.width()}}
              contentStyle={{
                ...G.S.width(),
                paddingRight:15,
                borderWidth:1,
                borderColor:G.Colors().Foreground(),
              }}
              iconStyle={{right:10}}
              onPress={onValidate}
            >
              {movable === true ? "Draw here" : "Save"}
            </Buttons.Label>
          </View>
        </View>
      </View>
      <Displayers.LoaderVertical isVisible={loading} />
    </View>
  );
}

const markerSize = 25;
const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  mapContainer:
  {
    ...G.S.center,
    ...G.S.full,
    borderRadius: 15,
  },
  map:
  {
    ...G.S.center,
    marginTop: "-10%",
    marginBottom: "-10%",
  },
  markerContainer:
  {
    ...G.S.center,
    position: "absolute",
    height: markerSize,
    width: markerSize,
    top: "50%",
    left: "50%",
    marginLeft: -markerSize / 2,
    marginTop: -markerSize / 2,
  },
  markerIcon:
  {
    height: markerSize,
    width: markerSize,
  },
  bannerContainer:
  {
    ...G.S.center,
    ...G.S.width(96),
    aspectRatio:6,
    position: "absolute",
    flexDirection:'row',
    top: 10,
    marginTop: 0,
    paddingHorizontal:0,
    paddingRight: 30,
    borderRadius:100,
    borderWidth:1,
    borderColor:G.Colors().Highlight(),
    backgroundColor:G.Colors().Foreground(),
  },
  bannerIconContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    paddingVertical:5
  },
  bannerIcon:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:2,
  },
  bannerStep:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  bannerTextContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:4,
    flexDirection:'row',
    justifyContent: "flex-start"
  },
  tip:
  {
    fontSize:14,
  },
  footerContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    position: "absolute",
    bottom: 0,
    aspectRatio: 5,
    paddingBottom: 10,
    paddingHorizontal: "3%",
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
    ...G.S.width(),
    flex: 1,
    aspectRatio:4,
    paddingHorizontal:5
  },
  button:
  {
    ...G.S.center,
    ...G.S.width(),
    flex: 1,
  },
});
