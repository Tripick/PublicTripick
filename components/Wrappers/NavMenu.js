import React from "react";
import { StyleSheet, View, Image, Animated } from "react-native";
// Context
import { AppContext } from "../../AppContext";
// Libs
import * as G from "../../Libs/Globals";
import * as Displayers from "../../Libs/Displayers";
import * as Texts from "../../Libs/Texts";

export default function NavMenu(props)
{
  const [context, setContext] = React.useContext(AppContext);
  const goTo = async (pageName) =>
  {
    context.navigate(props.navigation, pageName);
  };

  let buttons = [
    {label:"Trips", pageName:"Homepage", icon:"compass-rose"},
    {label:"Places", pageName:"Search", icon:"map-search-outline"},
    // {label:"Guides", pageName:"Guides", icon:"routes"},
    {label:"Friends", pageName:"Friends", icon:"human-greeting"},
    {label:"Account", pageName:"Account", icon:"card-account-details-outline", image:context?.userContext?.user?.photo?.image},
  ];
  
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const pastillePosition = animation.interpolate({
    inputRange: [0, buttons.length],
    outputRange: [0, buttons.length * (G.Layout.window.width / buttons.length)],
  });
  React.useEffect(() =>
  {
    let pageIndex = -1;
    const actives = buttons.filter(b => b.pageName === props.activePage);
    if(actives.length > 0) pageIndex = buttons.indexOf(actives[0]);
    if(pageIndex !== -1) Animated.timing(animation, { toValue:pageIndex, duration:350}).start();
    return () => { animation.stopAnimation(); };
  }, [props.activePage]);
  
  const getButton = (button, index) =>
  {
    const isActive = props.activePage === button.pageName;
    return(
      <View key={index} style={[s.buttonContainer, isActive === true ? {} : {opacity:0.4}]}>
        <View style={s.buttonContent}>
          <View style={s.iconContainer}>
            {typeof(button.image) !== 'undefined' ?
              <Image source={{uri: button.image}} style={s.avatar} />
              :
              <Displayers.Icon
                alignWidth
                dark
                noBackground
                name={button.icon}
                type="mci"
                size={25}
                color={isActive === true ? G.Colors().Highlight() : G.Colors().Foreground()}
              />
            }
          </View>
          <View style={s.labelContainer}>
            <Texts.Label style={[s.label, isActive === true ? {color:G.Colors().Highlight()} : {color:G.Colors().Foreground()}]}>{button.label}</Texts.Label>
          </View>
        </View>
        <Displayers.TouchableOverlay onPress={() => goTo(button.pageName)}/>
      </View>
    );
  };

  if(typeof(context.userContext) === 'undefined' || context.userContext === null || buttons.filter(b => b.pageName === props.activePage).length <= 0)
      return (<View/>);
  else
    return (
      <View style={s.container}>
        <Animated.View style={[
          s.buttonContainerActive,
          {...G.S.width(100 / buttons.length)},
          {left:pastillePosition}]}
        >
          <View style={s.buttonContainerActiveContent} />
        </Animated.View>
        {buttons.map((b, index) => getButton(b, index))}
      </View>
    );
}

const s = StyleSheet.create({
  container:
  {
    ...G.S.center,
    ...G.S.width(100),
    aspectRatio:5.5,
    backgroundColor: G.Colors().Highlight(),
    borderTopLeftRadius:(G.Layout.window.width / 5.5)/2 - 3,
    borderTopRightRadius:(G.Layout.window.width / 5.5)/2 - 3,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    borderColor:G.Colors().Foreground(),
    flexDirection:'row',
    zIndex:2000,
    overflow:'visible',
  },
  buttonContainer:
  {
    ...G.S.center,
    ...G.S.height(),
    flex:1,
    overflow:'visible',
  },
  buttonContent:
  {
    ...G.S.center,
    ...G.S.height(85),
    ...G.S.width(88),
  },
  buttonContainerActive:
  {
    ...G.S.center,
    ...G.S.height(),
    position:'absolute',
  },
  buttonContainerActiveContent:
  {
    ...G.S.center,
    ...G.S.shadow(),
    ...G.S.height(85),
    ...G.S.width(88),
    borderRadius:100,
    backgroundColor:G.Colors().Foreground(),
  },
  iconContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    marginTop:8,
  },
  labelContainer:
  {
    ...G.S.center,
    ...G.S.width(),
    flex:1,
    justifyContent:'flex-start',
    alignContent:'flex-start'
  },
  label:
  {
    ...G.S.width(),
    fontSize: 12,
  },
  avatar:
  {
    ...G.S.center,
    ...G.S.height(),
    aspectRatio:1,
    borderRadius: 100,
  },
});
