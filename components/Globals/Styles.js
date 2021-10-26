import Colors from "./Colors";

const mapHd = (mapSize) =>
{
  return {
    height: mapSize.height * 2.5,
    width: mapSize.width * 2.5,
    transform: [{ scale: 0.5 }],
  }
};

const shadow = (intensity = 5) =>
{
  return {
    backgroundColor: Colors().Background(),
    shadowColor: Colors().Neutral(),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18 + 0.02 * intensity,
    shadowRadius: 1 + 0.6 * intensity,
    elevation: intensity,
    overflow: "visible",
  };
};

const center = {
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const hidden = {
  height:0,
  width:0,
  margin:0,
  padding:0,
  zIndex:0,
  borderWidth:0,
  overflow: "hidden",
};

const height = (x = 100) => {
  return { height: x + "%" };
};
const width = (x = 100) => {
  return { width: x + "%" };
};
const full = { ...height(), ...width() };

const flex = (x) => {
  return { flex: x };
};
const flexRow = (x) => {
  return { ...flex, flexDirection: "row" };
};

const grid = {
  borderWidth: 1,
  borderColor: "red",
  backgroundColor: "rgb(200,200,200)",
};

export default {
  mapHd: mapHd,
  shadow: shadow,
  center: center,
  hidden: hidden,
  flex: flex,
  flexRow: flexRow,
  grid: grid,
  full: full,
  height: height,
  width: width,
};
