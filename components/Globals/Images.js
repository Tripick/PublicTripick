import Colors from "./Colors";

export default
{
  // Commons
  background: Colors().activeThemeIndex === 1 ?
    require("../../assets/images/backgroundDark.jpg") :
    require("../../assets/images/background.jpg"),
  backgroundReversed: Colors().activeThemeIndex !== 1 ?
    require("../../assets/images/backgroundDark.jpg") :
    require("../../assets/images/background.jpg"),
  splash:require("../../assets/images/splash.png"),
  logoTitle:require("../../assets/images/splash.png"),
  logo: require("../../assets/images/RocketFlame_700.png"),
  logoTiny: require("../../assets/images/RocketFlame_128.png"),
  logoLight: require("../../assets/images/Rocket_512.png"),
  logoLightTiny: require("../../assets/images/Rocket_128.png"),

  // Login
  facebookIcon: require("../../assets/images/facebookIcon.png"),
  googleIcon: require("../../assets/images/googleIcon.png"),
  googleMapsIcon: require("../../assets/images/GoogleMapsIcon.png"),
  googleLogo: require("../../assets/images/GoogleLogo.png"),
  googleTrademark: Colors().activeThemeIndex !== 1 ?
    require("../../assets/images/GoogleTrademark.png") :
    require("../../assets/images/GoogleTrademark_Dark.png"),

  // Homepage
  buildings:require("../../assets/images/Buildings.png"),
  pinPoint:require("../../assets/images/PinPoint.png"),
  pickPoint:require("../../assets/images/PickPoint.png"),
  pickPointSelected:require("../../assets/images/PickPointSelected.png"),
  pickPointInactive:require("../../assets/images/PickPointInactive.png"),
  pickPointStart:require("../../assets/images/PickPointStart.png"),
  pickPointEnd:require("../../assets/images/PickPointEnd.png"),
  picksIcon:require("../../assets/images/IconPick128.png"),
  picksIconDisabled:require("../../assets/images/IconPickInactive128.png"),
  picksIconMini:require("../../assets/images/IconPickMini.png"),
  picksIconDisabledMini:require("../../assets/images/IconPickInactiveMini.png"),
  star:require("../../assets/images/StarStraight.png"),
  starDisabled:require("../../assets/images/StarStraightGrey.png"),
};
