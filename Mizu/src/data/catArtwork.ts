import { ImageSourcePropType } from 'react-native';
import { CatColor, CatMood } from '../types';

// Complete approved illustrations. Never overlay or independently transform facial features.
export const catArtwork: Record<CatColor, Record<CatMood, ImageSourcePropType>> = {
  white: {
    sleeping: require('../../assets/cats/approved/white-sleeping.png'),
    stretching: require('../../assets/cats/approved/white-stretching.png'),
    playing: require('../../assets/cats/approved/white-playing.png'),
    happy: require('../../assets/cats/approved/white-happy.png'),
    celebrating: require('../../assets/cats/approved/white-celebrating.png'),
  },
  black: {
    sleeping: require('../../assets/cats/approved/black-sleeping.png'),
    stretching: require('../../assets/cats/approved/black-stretching.png'),
    playing: require('../../assets/cats/approved/black-playing.png'),
    happy: require('../../assets/cats/approved/black-happy.png'),
    celebrating: require('../../assets/cats/approved/black-celebrating.png'),
  },
  gray: {
    sleeping: require('../../assets/cats/approved/gray-sleeping.png'),
    stretching: require('../../assets/cats/approved/gray-stretching.png'),
    playing: require('../../assets/cats/approved/gray-playing.png'),
    happy: require('../../assets/cats/approved/gray-happy.png'),
    celebrating: require('../../assets/cats/approved/gray-celebrating.png'),
  },
  orange: {
    sleeping: require('../../assets/cats/approved/orange-sleeping.png'),
    stretching: require('../../assets/cats/approved/orange-stretching.png'),
    playing: require('../../assets/cats/approved/orange-playing.png'),
    happy: require('../../assets/cats/approved/orange-happy.png'),
    celebrating: require('../../assets/cats/approved/orange-celebrating.png'),
  },
  siamese: {
    sleeping: require('../../assets/cats/approved/siamese-sleeping.png'),
    stretching: require('../../assets/cats/approved/siamese-stretching.png'),
    playing: require('../../assets/cats/approved/siamese-playing.png'),
    happy: require('../../assets/cats/approved/siamese-happy.png'),
    celebrating: require('../../assets/cats/approved/siamese-celebrating.png'),
  },
};

