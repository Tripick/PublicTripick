import { Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default {
  window: {
    width,
    height
  },
  isSmallDevice: width < 375,
};
