import { Appearance } from 'react-native-appearance';

export default function Colors(props)
{
  let themeIndex = Appearance.getColorScheme() === "dark" ? 1 : 0;
  // Appearance.addChangeListener(({ colorScheme }) =>
  // {
  //   themeIndex = colorScheme === "dark" ? 1 : 0;
  // });

  const themes = [
    {
      Name: "Light",
      Background: "f1f1f1",
      Foreground: "ffffff",
      Neutral: "444444",
      Important: "000000",
      Altlight: "ff9523",
      Highlight: "008ee6", //3fccbc //ff9523
    },
    {
      Name: "Dark",
      Background: "333333",
      Foreground: "222222",
      Neutral: "ffffff",
      Important: "ffffff",
      Altlight: "ff9523",
      Highlight: "008ee6",
    },
  ];
  
  const hexToRgb = (hex) =>
  {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) : "255,0,0";
  };

  return {
    activeThemeIndex:themeIndex,
    gradientIntensity: 0.8,
    Transparent: "rgba(0,0,0,0)",
    Grant: "rgb(0,150,50)",
    Warning: "rgb(200,90,0)",
    Fatal: "rgb(255,0,0)",
    Red: (a = 1) => "rgba(230,0,0," + a + ")",
    Green: (a = 1) => "rgba(70,200,120," + a + ")",
    Grey: (a = 1) => "rgba(200,200,200," + a + ")",
    Black: (a = 1) => "rgba(0,0,0," + a + ")",
    White: (a = 1) => "rgba(255,255,255," + a + ")",
    Background: (a = 1) => "rgba(" + hexToRgb("#" + themes[themeIndex].Background) + "," + a + ")",
    Foreground: (a = 1) => "rgba(" + hexToRgb( "#" + themes[themeIndex].Foreground) + "," + a + ")",
    Neutral: (a = 1) => "rgba(" + hexToRgb("#" + themes[themeIndex].Neutral) + "," + a + ")",
    Important: (a = 1) => "rgba(" + hexToRgb("#" + themes[themeIndex].Important) + "," + a + ")",
    Altlight: (a = 1) => "rgba(" + hexToRgb("#" + themes[themeIndex].Altlight) + "," + a + ")",
    Highlight: (a = 1) => "rgba(" + hexToRgb("#" + themes[themeIndex].Highlight) + "," + a + ")",
  };
}
