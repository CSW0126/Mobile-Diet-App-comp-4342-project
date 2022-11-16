import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");


export const COLORS = {
    // base colors
    primary: "#FC6D3F",     // orange
    secondary: "#CDCDD2",   // gray
    tertiary: "#2def9c",    //Triadic Scheme of icon color
    quaternary: "#F09D2E",  //icon color
    tertuary2: "#70f4bb",
    primary2: "#F3B057",

    // colors
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#F5F7F9",
    lightGray2: '#FAFBFD',
    gray: "#BEC1D2",
    blue: '#42B0FF',
    darkgray: '#898C95',
    yellow: '#FFD573',
    lightBlue: '#95A9B8',
    darkgreen: '#008159',
    peach: '#FF615F',
    purple: '#8e44ad',
    red: '#FF0000',
    lightGreen: "#41CE8C",
    link: '#007AFF',
    akabeni: '#CB4042',
    ichigo: '#B5495B',
    lightred: '#DB4D6D',
    sakura: '#FFF3F3',
    divider: '#E0E0E0',

    // rainbow
    rainbow:{
        'Bookmark': '#DB4D6D', 
        'Monday': '#ED5314', 
        'Tuesday': '#FFB92A', 
        'Wednesday': '#FEEB51', 
        'Thursday': '#9BCA3E', 
        'Friday': '#3ABBC9', 
        'Saturday': '#666DCB', 
        'Sunday': '#072446'
    },

    categoriesColor: {
        "Weight Loss": '#DB4D6D',
        "Weight Gain": '#42B0FF',
        "Vegetarian": "#41CE8C"
    },
    //dashboard
    Home: '#ffe1c5',
    Recipe: '#e5c1e5',
    Social: '#d7d8f8',
    Setting: '#bce3fa',
    Profile: '#999999',

    Home2: '#c56b14',
    Recipe2: '#f37ff3',
    Social2: '#4b458c',
    Setting2: '#2d9cdb',
    Profile2: "#111111",

    lightGray: "#F5F5F6",
    lightGray2: "#F6F6F7",
    lightGray3: "#EFEFF1",
    lightGray4: "#F8F8F9",
    transparent: "transparent",
    darkgray: '#898C95',
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,

    // app dimensions
    width,
    height
};

export const FONTS = {

    largeTitle: { fontWeight: '400', fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontWeight: '900', fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontWeight: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontWeight: 'bold', fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontWeight: 'bold', fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontWeight: '400', fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontWeight: '400', fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontWeight: '400', fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontWeight: '400', fontSize: SIZES.body4, lineHeight: 22 },
    body5: { fontWeight: '400', fontSize: SIZES.body5, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;