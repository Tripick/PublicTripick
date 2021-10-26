import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
// Libs
import * as G from "../../Libs/Globals";

export default function ImageSlider(props)
{
  const carouselWidth = G.Layout.window.width;
  const [activeSlide, setActiveSlide] = useState(0);

  const renderItem = (item) =>
  {
    return (
      <View style={{ flex: 1, overflow: "hidden" }}>
        <Image source={{uri:item.url}} style={s.image} />
      </View>
    );
  }

  if(props.active === false)
    return renderItem(props.images[0]);

  return (
    <View style={s.container}>
      <Carousel
        layout={"default"}
        data={props.images}
        renderItem={({ item, index }) => renderItem(item)}
        onSnapToItem={(index) => setActiveSlide(index)}
        sliderWidth={carouselWidth}
        itemWidth={carouselWidth}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
      />
      <Pagination
        dotsLength={props.images.length}
        activeDotIndex={activeSlide}
        containerStyle={s.miniPagination}
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
          borderColor:G.Colors().Foreground(),
          backgroundColor: G.Colors().Foreground(),
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={0.5}
      />
    </View>
  );
}
let s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.full,
  },
  miniPagination:
  {
    marginTop: -50,
    marginBottom: -25
  },
  image:
  {
    ...G.S.full,
    resizeMode: "cover",
  },
});
