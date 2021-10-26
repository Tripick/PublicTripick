import React from "react";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as Wrappers from "../../Libs/Wrappers";

export default function Countries({ navigation })
{
  const [context, setContext] = React.useContext(AppContext);

  /////////////////////////// OPTIONS ///////////////////////////
  const numberOfCountriesToLoad = 1;
  const precision = 40;

  /////////////////////////// LOOPS ///////////////////////////
  const [processFinished, setProcessFinished] = React.useState(false);
  const [queue, setQueue] = React.useState([]);
  const [headSaved, setHeadSaved] = React.useState(false);
  React.useEffect(() =>
  {
    if(processFinished === false)
    {
      if(queue.length > 0)
      {
        saveCountryOnServer();
      }
      else
      {
        setHeadSaved(false);
        getNextCountries();
      }
    }
  }, [queue]);
  React.useEffect(() =>
  {
    if(processFinished === false)
    {
      if(headSaved === true)
      {
        setHeadSaved(false);
        // Delete first element of queue
        let updatedQueue = [...queue];
        updatedQueue.splice(0, 1);
        setQueue(updatedQueue);
      }
    }
  }, [headSaved]);
  
  /////////////////////////// GET COUNTRIES ///////////////////////////
  const getNextCountries = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"country_generationGetAll",
      isRetribution:false,
      data:{ quantity:numberOfCountriesToLoad },
      callback:getCountriesOnSuccess
    }]});
  };
  const getCountriesOnSuccess = (response) =>
  {
    if(response.length === 0)
    {
      setProcessFinished(true);
      console.log("*** ALL COUNTRIES GENERATED SUCCESSFULLY! ***");
    }
    else
    {
      const country = response[0];
      console.log(country.name + " in progress...");
      let areas = [];
      country.polygons.forEach(polygon => { areas.push(calculateArea(polygon.points)); });
      country.Areas = areas;
      saveCountry(country);
    }
  };

  /////////////////////////// SAVE COUNTRIES ///////////////////////////
  const packSize = 1000;
  const saveCountry = (country) =>
  {
    let allAreas = [];
    country.Areas.forEach(polygonAreas =>
    {
      polygonAreas.forEach(area => { allAreas.push(area); });
    });
    const countryToSave = { Id:country.id, Areas:allAreas };
    
    const totalOfAreas = countryToSave.Areas.length;
    if(totalOfAreas > 1000)
    {
      let countryPack = [];
      const numberOfPack = Math.trunc(totalOfAreas / packSize) + 1;
      for(let i = 0; i < numberOfPack; i++)
      {
        let areasPack = [];
        for(let j = 0; j < packSize && ((i * packSize) + j) < totalOfAreas; j++)
        {
          areasPack.push(countryToSave.Areas[((i * packSize) + j)]);
        }
        if(areasPack.length > 0)
          countryPack.push({ Id:countryToSave.Id, Areas:areasPack });
      }
      console.log("[" + country.name + "] Adding "+countryPack.length+" parts to queue...");
      setQueue([...queue, ...countryPack]);
    }
    else
    {
      console.log("[" + country.name + "] Adding to the queue...");
      setQueue([...queue, countryToSave]);
    }
  };
  const saveCountryOnServer = () =>
  {
    setContext({ ...context, ordersQueue:[...context.ordersQueue,
    {
      id:G.Functions.newGUID(),
      actionName:"country_generationSave",
      isRetribution:false,
      data:{ country: queue[0] },
      callback:saveCountryOnServerOnSuccess
    }]});
  };
  const saveCountryOnServerOnSuccess = (response) =>
  {
    setHeadSaved(true);
  };

  /////////////////////////// CALCULATE AREAS ///////////////////////////
  const calculateArea = (polygon) =>
  {
    let p = [...polygon];
    if(p.length <= 0) return;
    
    // Get maximums
    const lats = p.map((a) => a.x);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const lons = p.map((a) => a.y);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const amplLat = maxLat - minLat;
    const amplLon = maxLon - minLon;

    // Create matrix
    const tileSize = amplLat / precision;
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
      const distanceToNextPoint = Math.sqrt(Math.pow(p[i].x - p[indexToNext].x, 2) + Math.pow(p[i].y - p[indexToNext].y, 2));
      const numberOfPointsToAdd = distanceToNextPoint / tileSize;
      if(numberOfPointsToAdd > 1)
      {
        for (var j = 1; j < numberOfPointsToAdd; j++)
        {
          const pointToAdd = {
            x: p[i].x + ((Math.abs(p[i].x - p[indexToNext].x) / numberOfPointsToAdd) * j) * (p[i].x > p[indexToNext].x ? -1 : 1),
            y: p[i].y + ((Math.abs(p[i].y - p[indexToNext].y) / numberOfPointsToAdd) * j) * (p[i].y > p[indexToNext].y ? -1 : 1),
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
      const x = Math.trunc((p[i].x - minLat) / tileSize) + 1;
      const y = Math.trunc((p[i].y - minLon) / tileSize) + 1;
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
        if(tile.isOut === true) tile.isInPolygon = false;
        else
        {
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

    // JUST FOR TEST
    // const test = [];
    // for (var x = 0; x < matrixWidth; x++)
    // {
    //   for (var y = 0; y < matrixHeight; y++)
    //   {
    //     let tile = matrix[x][y];
    //     if(tile.isPolygon === true)
    //     {
    //       test.push(
    //       {
    //         latitude: tile.minLat,
    //         longitude: tile.minLon,
    //         height: Math.abs(tile.maxLat - tile.minLat),
    //         width: Math.abs(tile.maxLon - tile.minLon)
    //       });
    //     }
    //   }
    // }
    // return test;
    // JUST FOR TEST

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
        MinLat: mergeTiles[l].latitude,
        MinLon: mergeTiles[l].longitude,
        MaxLat: mergeTiles[l].latitude + mergedHeight,
        MaxLon: mergeTiles[l].longitude + mergeTiles[l].width,
      });
      l += nbLinesMerged;
    }

    return mergedLines;
  };

  return (
    <Wrappers.AppFrame/>
  );
}

