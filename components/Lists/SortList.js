import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Libs
import * as G from "../../Libs/Globals";
// Components
import SortListItem from "./SortListItem";

export default function SortList(props)
{
  const scrollList = React.useRef(null);
  const paddingTop = 5;
  const [items, setItems] = React.useState(null);
  const [containerSize, setContainerSize] = React.useState(0);
  const [itemSize, setItemSize] = React.useState(0);
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [lastScrollPosition, setLastScrollPosition] = React.useState(0);
  const [lastShiftingItemIndex, setLastShiftingItemIndex] = React.useState(-1);
  const [alreadyHighlighted, setAlreadyHighlighted] = React.useState(true);
  const [isMoving, setIsMoving] = React.useState(false);

  const initItems = (data) =>
  {
    if(typeof(props.data) === 'undefined' || props.data === null || props.data.length <= 0)
      return [];
    const newItems = JSON.parse(JSON.stringify(data));
    return newItems.map((d, index) =>
    {
      return {
        id: index,
        initIndex: index,
        index: index,
        isShifting: false,
        data: {...d}
      };
    });
  };
  React.useEffect(() => { if(isMoving === true && props.onStartMoving) props.onStartMoving(); }, [isMoving]);
  React.useEffect(() => { setItems(null); }, [props.data]);
  React.useEffect(() =>
  {
    if(items === null)
    {
      if(alreadyHighlighted === false)
        setAlreadyHighlighted(true);
      else if(alreadyHighlighted === true && lastShiftingItemIndex !== -1)
        setLastShiftingItemIndex(-1);
      setIsMoving(false);
      setItems(initItems(props.data));
      if(typeof(scrollList.current) !== 'undefined' && scrollList.current !== null)
      {
        setLastScrollPosition(0);
        scrollList.current.scrollTo(props.horizontal === true ? {x:lastScrollPosition, y:0, animated:true} : {x:0, y:lastScrollPosition, animated:true});
      }
    }
  }, [items]);
  React.useEffect(() =>
  {
    if(typeof(scrollList.current) !== 'undefined' && scrollList.current !== null &&
      typeof(props.forceScrollTo) !== 'undefined' && props.forceScrollTo >= 0)
      setTimeout(() => {
        const positionToScrollTo = props.forceScrollTo * itemSize - containerSize / 4;
        props.resetForceScrollTo();
        scrollList.current.scrollTo(props.horizontal === true ? {x:positionToScrollTo, y:0, animated:true} : {x:0, y:positionToScrollTo, animated:true});
      }, 100);
  }, [props.forceScrollTo]);

  const getItem = (item, index) =>
  {
    return (
      <SortListItem
        horizontal={props.horizontal}
        edgingDelay={props.edgingDelay}
        edgeZonePercent={props.edgeZonePercent}
        key={index}
        id={item.id}
        initIndex={index}
        index={item.index}
        lastShiftingItemIndex={lastShiftingItemIndex}
        itemData={item.data}
        renderItem={props.renderItem}
        count={props.data.length}
        isShifting={item.isShifting}
        containerSize={containerSize}
        scrollPosition={scrollPosition}
        onMove={onMove}
        save={onSave}
        setItemSize={setItemSize}
      />
    );
  };

  const onSave = (id, itemSize) =>
  {
    if(isMoving === true)
      setIsMoving(false);
    const itemsWithoutCorrectIndexes = items.sort((x, y) => x.index - y.index);
    const shiftingItem = itemsWithoutCorrectIndexes.filter(x => x.id === id)[0];
    itemsWithoutCorrectIndexes.forEach((r,i) => { r.index = i; });
    const shiftingItemIndex = shiftingItem.index;
    const newItems = JSON.parse(JSON.stringify(itemsWithoutCorrectIndexes));
    const posToScrollTo = Math.max(0, (newItems.filter(x => x.id === id)[0].index * itemSize) - (containerSize / 2));
    setLastScrollPosition(posToScrollTo);
    setLastShiftingItemIndex(shiftingItemIndex);
    setAlreadyHighlighted(false);
    props.save(newItems.map(x => x.data));
  };

  const onMove = (id, draggablePosition, itemSize, isEdging, scrollPos) =>
  {
    if(isMoving === false)
      setIsMoving(true);
    const newItems = [...items];
    const minIndex = Math.min(...(newItems.map(x => x.index)));
    const maxIndex = Math.max(...(newItems.map(x => x.index)));
    const minIndexOffset = Math.trunc(scrollPos / itemSize);
    const maxIndexOffset = newItems.length - (Math.trunc(((newItems.length * itemSize) - (scrollPos  + containerSize)) / itemSize));

    // Calculate shiftingItem new index
    let shiftingItem = newItems.filter(x => x.id === id)[0];
    let shiftingItemIndex = Math.trunc((draggablePosition + (itemSize / 2)) / itemSize);
    shiftingItemIndex = Math.max(minIndex + (props.lockItemsOnEdges === true ? 1 : 0), shiftingItemIndex);
    shiftingItemIndex = Math.min(shiftingItemIndex, maxIndex - (props.lockItemsOnEdges === true ? 1 : 0));

    // Shift all items up or down when the shifting item comes close to the edges of the container
    if(isEdging !== 0)
    {
      if(isEdging < 0 && minIndex < minIndexOffset)
        newItems.forEach(r => r.index++);
      else if(isEdging > 0 && maxIndexOffset < (maxIndex + (props.lockItemsOnEdges === true ? 0 : 1)))
        newItems.forEach(r => r.index--);
    }

    // Index changed
    if(shiftingItemIndex !== shiftingItem.index)
    {
      let toSnap = [];
      if(shiftingItemIndex < shiftingItem.index &&
        (props.lockItemsOnEdges !== true || (props.lockItemsOnEdges === true && shiftingItemIndex > 0)))
      {
        toSnap = newItems.filter(x => x.id !== id && x.index < shiftingItem.index && shiftingItemIndex <= x.index);
        toSnap.forEach(x => { x.index = x.index + 1; });
      }
      else
      if(shiftingItemIndex > shiftingItem.index &&
        (props.lockItemsOnEdges !== true || (props.lockItemsOnEdges === true && shiftingItemIndex < (newItems.length - 1))))
      {
        toSnap = newItems.filter(x => x.id !== id && x.index > shiftingItem.index && shiftingItemIndex >= x.index);
        toSnap.forEach(x => { x.index = x.index - 1; });
      }
    }
    // Apply changes
    shiftingItem.index = shiftingItemIndex;
    setItems(newItems);
    return newItems;
  };

  const getContent = () =>
  {
    return (
      items === null ?
        <View />
        :
        <View style={props.horizontal === true ? {...G.S.height(), flexDirection:'row'} : {...G.S.width()}}>
          {items.map((item, index) => getItem(item, index))}
        </View>
    );
  };

  const onScroll = (e) =>
  {
    let scrollPos = props.horizontal === true ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y;
    if(lastScrollPosition !== 0)
    {
      scrollPos = lastScrollPosition;
      scrollList.current.scrollTo(
      props.horizontal === true ? {x:scrollPos, y:0, animated:true} : {x:0, y:scrollPos, animated:true});
    }
    setLastScrollPosition(0);
    setScrollPosition(scrollPos);
  };

  return (
    <View
      style={[props.horizontal === true ? {...G.S.height()} : {...G.S.width()}, props.style]}
      onLayout={(event) => setContainerSize(props.horizontal === true ? event.nativeEvent.layout.width : event.nativeEvent.layout.height)}
    >
      <View style={[
        {position:'absolute', zIndex:2},
        props.horizontal === true ?
          {left:0, ...G.S.height(), width:(isMoving === true ? (containerSize * props.edgeZonePercent / 100) : 0)} :
          {top:0, ...G.S.width(), height:(isMoving === true ? (containerSize * props.edgeZonePercent / 100) : 0)}
      ]}>
        <LinearGradient style={{...G.S.full}}
          start={[0, 0]}
          end={props.horizontal === true ? [1, 0] : [0, 1]}
          colors={[G.Colors().Highlight(0.3), G.Colors().Highlight(0.3), G.Colors().Transparent]}
        />
      </View>
      {containerSize === 0 ? <View/> :
        <ScrollView
          ref={scrollList}
          horizontal={props.horizontal}
          style={{...G.S.full, zIndex:1}}
          contentContainerStyle={{paddingTop:paddingTop}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
        >
          {getContent()}
        </ScrollView>
      }
      <View style={[
        {position:'absolute', zIndex:2},
        props.horizontal === true ?
          {right:0, ...G.S.height(), width:(isMoving === true ? (containerSize * props.edgeZonePercent / 100) : 0)} :
          {bottom:0, ...G.S.width(), height:(isMoving === true ? (containerSize * props.edgeZonePercent / 100) : 0)}
      ]}>
        <LinearGradient style={{...G.S.full}}
          start={[0, 0]}
          end={props.horizontal === true ? [1, 0] : [0, 1]}
          colors={[G.Colors().Transparent, G.Colors().Highlight(0.3), G.Colors().Highlight(0.3)]}
        />
      </View>
    </View>
  );
}

