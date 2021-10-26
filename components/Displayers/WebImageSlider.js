import React from "react";
import { ActivityIndicator, StyleSheet, View, Image } from "react-native";
import { Pagination } from "react-native-snap-carousel";
// Libs
import * as G from "../../Libs/Globals";
// Components
import TouchableOverlay from "./TouchableOverlay";

export default function WebImageSlider(props)
{
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [images, setImages] = React.useState([]);

  const getBase64FromUrl = async (url) =>
  {
    return await fetch(url)
    .then(async response =>
    {
      return await response.blob();
    })
    .then(async blob =>
    {
      if(blob !== null)
      {
        return new Promise((resolve, reject) =>
        {
          try
          {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => { resolve(reader.result); }
          }
          catch(e)
          {
            reject(e.message);
          }
        });
      }
    })
    .catch(function(error)
    {
      console.log('Problem fetching url image ['+url+']: ' + error.message);
    });
  }

  const fetchAllImages = async () =>
  {
    if(props.images !== null && props.images.length > 0)
    {
      const promises = props.images.map(img => new Promise((resolve, reject) =>
      {
        if(typeof(img.url) !== 'undefined' && img.url !== null && img.url !== "NO_IMAGE" && img.url !== "")
        {
          getBase64FromUrl(img.url).then(i =>
          {
            if(typeof(i) !== 'undefined' && i !== null)
            {
              let iData = i.replace("data:application/octet-stream", "data:image/jpg");
              resolve(iData);
            }
            else
              resolve("ERROR");
          });
        }
        else if(typeof(img.image) !== 'undefined' && img.image !== null && img.image !== "" && img.image.startsWith("data:image"))
        {
          resolve(img.image);
        }
        else resolve("ERROR");
      }));
      Promise.all(promises).then(imgs =>
      {
        setImages(imgs.filter(i => typeof i !== 'undefined' && i !== null));
      });
    }
    else setImages([]);
  };

  React.useEffect(() =>
  {
    if(props.disable === false)
    {
      setActiveSlide(0);
      fetchAllImages();
    }
  }, [props.disable, props.images]);
  
  const [paginationSize, setPaginationSize] = React.useState(0);
  return (
    <View style={s.container}>
      {images === null || images.length <= 0 ?
        <ActivityIndicator size="small" color={G.Colors().Fatal} />
        :
          <View style={s.content}>
            <View style={s.imageSlider}>
              {images[activeSlide] === "ERROR" ?
                <View/>
                :
                <Image source={{uri:images[activeSlide]}} style={s.image} />
              }
            </View>
            <View style={s.paginationContainer} onLayout={(event) => setPaginationSize(event.nativeEvent.layout.height)}>
              <Pagination
                dotsLength={props.images.length}
                activeDotIndex={activeSlide}
                containerStyle={{ marginTop:-paginationSize*2, marginBottom:-paginationSize*2}}
                dotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  borderWidth:1,
                  borderColor:G.Colors().Foreground(),
                  backgroundColor: G.Colors().Highlight(),
                }}
                inactiveDotStyle={{
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  borderWidth:1,
                  borderColor:G.Colors().Highlight(),
                  backgroundColor: G.Colors().Foreground(),
                }}
                inactiveDotOpacity={1}
                inactiveDotScale={0.5}
              />
            </View>
            <TouchableOverlay onPress={() => setActiveSlide(activeSlide > images.length - 2 ? 0 : activeSlide+1)} />
          </View>
      }
    </View>
  );
}
let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
    
  },
  content:
  {
    ...G.S.center,
    ...G.S.full,
    justifyContent:"flex-start",
  },
  imageSlider:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
  },
  paginationContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    aspectRatio:15,
  },
  image:
  {
    ...G.S.full,
    resizeMode: "contain",
    borderRadius:10,
  },
});
