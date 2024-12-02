import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
export const responsiveWidth = (w: number) => (width * w) / 100;
export const responsiveHeight = (h: number) => (height * h) / 100;