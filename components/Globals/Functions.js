import AsyncStorage from "@react-native-async-storage/async-storage";
// Libs
import Constants from "./Constants";
import Colors from "./Colors";
import Layout from "./Layout";
import moment from "moment";

const displayDateNumber = (dateNumber) =>
{
  return (dateNumber < 10 ? "0" : "") + dateNumber;
};

export default
{
  
  // Commons
  avg: (arr) =>
  {
    var total = 0;
    for(var i = 0; i < arr.length; i++)
    {
      total += arr[i];
    }
    return total / arr.length;
  },
  cleanMail: (val) =>
  {
    return val.replace(/[^\w@._-]/g, "");
  },
  cleanUsername: (val) =>
  {
    return val.replace(/[^\w]/g, "");
  },
  cleanAddress: (val) =>
  {
    return val.replace(/[0-9-_/\\*\n+,]/g, "");
  },
  cleanText: (val) =>
  {
    if(typeof(val) === 'undefined' || val === null || val.length <= 0)
      return "";
    // Trim spaces and lines at start and end
    val = val.replace(/^[\n ]*/, "");
    val = val.replace(/[\n]*$/, "");
    // Replace every multiple spaces and lines by a single space
    val = val.replace(/\n\n+/g, "\n");
    val = val.replace(/[\n]/g, " ");
    val = val.replace(/  +/g, " ");
    // Allow only alphanumeric and some punctuation
    return val.replace(/[^a-zA-ZÀ-ÿ0-9 $*&^\+\-_.,;!?():\$\"\'\s\n\uE000-\uF8FF\uD83C\uD83D\uD83E\uDC00-\uDFFF\uDC00-\uDFFF\u2694-\u2697\uDD10-\uDD5D]/g, "");
  },
  cleanURL: (val) =>
  {
    return val.replace(/[\\'"<>{}\n\[\]]/g, ""); 
  },
  cleanInteger: (val) =>
  {
    val = val.replace(/[^0-9]/g, "");
    const correctInt = /^\d+$/;
    return { isValid:correctInt.test(val), val:val };
  },
  cleanDouble: (val) =>
  {
    val = val.replace(/[^0-9.]/g, "");
    //val = val.replace(/^0/g, "");
    const correctDouble = /^\d+(\.)?(\d{0,2})?$/;
    return { isValid:correctDouble.test(val), val:val };
  },
  cleanCoordinate: (val) =>
  {
    if(typeof(val) === 'undefined' || val === null || val == "")
      return val;
    return Math.trunc(parseFloat(String(val)) * 10000) / 10000
  },
  isValidMail: (val) =>
  {
    if(val === null) val = "";
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return val.length >= Constants.emailMinLength && val.length <= Constants.emailMaxLength && regex.test(val);
  },
  isValidUsername: (val) =>
  {
    if(val === null) val = "";
    const regex = /^\w*$/;
    return val.length >= Constants.usernameMinLength && val.length <= Constants.usernameMaxLength && regex.test(val);
  },
  // Numbers 
  newGUID: () =>
  {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  // Colors
  colorToGradient: (color, intensity) =>
  {
    let gradientIntensity = intensity ? intensity : Colors.gradientIntensity;
    // if (Colors.activeThemeReversed === true)
    //   gradientIntensity = 2 - gradientIntensity;
    const colors = color
      .replace("rgba(", "")
      .split(",")
      .map((c) => parseInt(c));
    const gradientStart =
      "rgba(" +
      colors[0] +
      "," +
      colors[1] +
      "," +
      colors[2] +
      "," +
      colors[3] +
      ")";
    const gradientEnd =
      "rgba(" +
      Math.min(255, colors[0] * gradientIntensity) +
      "," +
      Math.min(255, colors[1] * gradientIntensity) +
      "," +
      Math.min(255, colors[2] * gradientIntensity) +
      "," +
      colors[3] +
      ")";
    return [gradientStart, gradientEnd];
  },
  colorToTransparent: (color, intensity) => {
    let gradientIntensity = intensity ? intensity : Colors.gradientIntensity;
    const colors = color
      .replace("rgba(", "")
      .split(",")
      .map((c) => parseInt(c));
    const gradientStart =
      "rgba(" +
      colors[0] +
      "," +
      colors[1] +
      "," +
      colors[2] +
      "," +
      colors[3] +
      ")";
    const gradientEnd =
      "rgba(" +
      colors[0] +
      "," +
      colors[1] +
      "," +
      colors[2] +
      "," +
      Math.min(1, Math.max(0, 1 - gradientIntensity)) +
      ")";
    return [gradientStart, gradientEnd];
  },
  // Dates
  today: () => {
    return moment.utc().toDate();
  },
  tomorrow: () => {
    return moment.utc().add(1, "days").toDate();
  },
  newDate: (year, month, day) => {
    if (year && month && day) return new Date(year, month, day);
    else return moment.utc().toDate();
  },
  newDateTime: (year, month, day, hour, minute, second = 0) => {
    return new Date(year, month, day, hour, minute, second);
  },
  toDate: (dateString) => {
    let splitDate = dateString.split(Constants.dateSeparator);
    if (splitDate.length < 3) splitDate = dateString.split("-");
    return new Date(
      parseInt(splitDate[0]),
      parseInt(splitDate[1] - 1),
      parseInt(splitDate[2])
    );
  },
  dateIsPast: (date) => {
    const moment = require("moment");
    return moment.utc().diff(date) > 0;
  },
  dateNoHours: (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  },
  dateOnlyTime: (date) => {
    const moment = require("moment");
    return moment.utc(date).format("HH:mm");
    // let hours = date.getHours();
    // hours = (hours < 10 ? "0" : "") + hours;
    // let minutes = date.getMinutes();
    // minutes = (minutes < 10 ? "0" : "") + minutes;
    // return hours + ":" + minutes;
  },
  dateToString: (date) => {
    return (
      displayDateNumber(date.getDate()) +
      Constants.dateSeparator +
      displayDateNumber(date.getMonth() + 1) +
      Constants.dateSeparator +
      date.getFullYear()
    );
  },
  toMoment: (date, format) => {
    const moment = require("moment");
    return (format ? moment.utc(date, format) : moment.utc(date)).toDate();
  },
  dateToText: (date, format) => {
    const moment = require("moment");
    return moment.utc(date).format(format !== null && typeof(format) != 'undefined' && format !== "" ? format : "MMM Do YYYY");
  },
  dateToTextReturn: (date) => {
    const moment = require("moment");
    return (moment.utc(date).format("MMM Do") + "\n" + moment.utc(date).format("YYYY"));
  },
  dateYearToText: (date) => {
    const moment = require("moment");
    return (moment.utc(date).format("YYYY"));
  },
  dateDayName: (date) => {
    const moment = require("moment");
    return moment.utc(date).format("ddd");
  },
  dateToStringReversed: (date) => {
    return (
      date.getFullYear() +
      Constants.dateSeparator +
      displayDateNumber(date.getMonth() + 1) +
      Constants.dateSeparator +
      displayDateNumber(date.getDate())
    );
  },
  daysBetween: (start, end) => {
    return moment.utc(moment.utc(start).toDate()).diff(moment.utc(end), "days") * -1;
  },
  addDays: (start, numberOfDays) => {
    return moment.utc(start).add(numberOfDays, "days").toDate();
  },
  timeSpanToText: (timeSpan) =>
  {
    const baseDate = "2000-01-01";
    let start = moment.utc(baseDate + " 00:00:00");
    let end = moment.utc(baseDate + " " + timeSpan);
    let utcTime = moment.utc(end.diff(start));
    const h = utcTime.hour();
    const m = utcTime.minutes();
    return (h < 10 ? "0" + h : h) + "h" + (m < 10 ? "0" + m : m);
  },
  // Price
  displayShortPrice: (price) => {
    const thousandSeparator = /\B(?=(\d{3})+(?!\d))/g;
    if (price > 1000000)
      return (
        Number.parseInt(price / 1000)
          .toString()
          .replace(thousandSeparator, " ") + "k"
      );
    return price.toString().replace(thousandSeparator, " ");
  },
  // Map
  centerOffsetFromAnchor: (anchor, markerWidth, markerHeight) =>
  {
    return {
      x: (markerWidth * 0.5) - (markerWidth * anchor.x),
      y: (markerHeight * 0.5) - (markerHeight * anchor.y),
    };
  },
  calculateInitRegion: (coordinatesList) =>
  {
    const lats = coordinatesList.map((a) => a.latitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const deltaLat = (maxLat - minLat) * 3;
    const lons = coordinatesList.map((a) => a.longitude);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const deltaLon = (maxLon - minLon) * 3;
    let delta = Math.max(deltaLat, deltaLon);
    if (delta === 0) delta = 5;
    return {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLon + minLon) / 2,
      latitudeDelta: delta,
      longitudeDelta: delta * (Layout.window.width / Layout.window.height),
    };
  },
  coordinatesDistance: (startLat, startLon, endLat, endLon) =>
  {
    const R = 6371000;
    const startLatRad = startLat * Math.PI / 180;
    const endLatRad = endLat * Math.PI / 180;
    const diffLat = (endLat - startLat) * Math.PI / 180;
    const diffLon = (endLon - startLon) * Math.PI / 180;
    const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) + Math.cos(startLatRad) * Math.cos(endLatRad) * Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  },
  coordinatesStep: (step) =>
  {
    let lat = 0;
    let lon = 0;
    if(
      typeof(step) !== 'undefined' && step !== null &&
      typeof(step.visit) !== 'undefined' && step.visit !== null &&
      typeof(step.visit.place) !== 'undefined' && step.visit.place !== null)
    {
      lat = step.visit.place.latitude;
      lon = step.visit.place.longitude;
    }
    else
    {
      lat = step.latitude;
      lon = step.longitude;
    }
    return { lat:lat, lon:lon };
  },
  serverRequest: (userContext, path, data, onSuccess, onError) =>
  {
    try
    {
      let finalBody = data;
      if (userContext !== null)
      {
        finalBody = {
          AuthenticationKeys: {
            Id: userContext.authenticationKeys.id,
            AccessToken: userContext.authenticationKeys.accessToken,
          },
          Data: data,
        };
      }
      return fetch(Constants.serverUrl + path, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalBody),
      })
        .then(response => response.text())
        .then(async (response) =>
        {
          try
          {
            return await JSON.parse(response);
          }
          catch (error)
          {
            console.log("SERVER RESPONSE ERROR for:");
            console.log(response);
            console.log(error.message);
            if(error.message.indexOf("JSON Parse error") >= 0)
              onError({ message:"Cannot reach server. Please, try again later." });
            else
              onError(error);
            return null;
          }
        })
        .then((responseJson) =>
        {
          if (typeof(responseJson) === "undefined" || responseJson === null)
            onError({ message:"No response from server\nPlease try again later"});
          else if (responseJson.isSuccess || responseJson.value)
          {
            if (responseJson.isSuccess === true)
              onSuccess(responseJson.result);
            else if (responseJson.value != null && responseJson.value.isSuccess)
              onSuccess(responseJson.value.result);
            else
              onError(responseJson);
          }
          else if
            (responseJson.errors) onError(responseJson.errors[0]);
          else
            onError(responseJson);
        })
        .catch((error) =>
        {
          console.log(error);
          onError(error);
        })
        .done();
    }
    catch (error)
    {
      console.log(error);
      onError(error);
    }
  },
  getStore: async (key) =>
  {
    try
    {
      let store = "";
      let numberOfParts = await AsyncStorage.getItem(key);
      if(typeof(numberOfParts) === 'undefined' || numberOfParts === null)
        return null;
      else
        numberOfParts = parseInt(numberOfParts);
      for (let i = 0; i < numberOfParts; i++) { store += await AsyncStorage.getItem(key + i); }
      if(store === "")
        return null;
      return JSON.parse(store);
    }
    catch (error)
    {
      console.log("Could not get [" + key + "] from store.");
      console.log(error);
      return null;
    }
  },
  saveStore: async (key, data) =>
  {
    try
    {
      const store = JSON.stringify(data).match(/.{1,100000}/g);
      store.forEach((part, index) => { AsyncStorage.setItem((key + index), part); });
      AsyncStorage.setItem(key, ("" + store.length));
    }
    catch (error)
    {
      console.log("Could not save store : ");
      console.log(error.message);
    }
  },
  clearStore: async (key) =>
  {
    try
    {
      console.log("Clearing store for [" + key + "]");
      let numberOfParts = await AsyncStorage.getItem(key);
      if(typeof(numberOfParts) !== 'undefined' && numberOfParts !== null)
      {
        numberOfParts = parseInt(numberOfParts);
        for (let i = 0; i < numberOfParts; i++) { AsyncStorage.removeItem(key + i); }
        AsyncStorage.removeItem(key);
      }
    }
    catch (error)
    {
      console.log("Could not clear store : ");
      console.log(error.message);
    }
  },
  getAsyncStorage: async (key) =>
  {
    try
    {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) return JSON.parse(value);
    }
    catch (error)
    {
      console.log("Could not get [" + key + "] from storage.");
      console.log(error);
      return null;
    }
  },
  setAsyncStorage: async (key, data) =>
  {
    try
    {
      return await AsyncStorage.setItem(key, JSON.stringify(data));
    }
    catch (error)
    {
      console.log("Could not save in async storage : " + error.message);
    }
  },
  // Pick
  displayFlag: (flag, isMax = false) =>
  {
    const val = isMax === true ? flag.maxValue : flag.value;
    const flagVal = flag.config.valType === "Double" ? parseFloat(val) : parseInt(val);
    if(flag.config.name === "Price" || flag.config.name === "Length")
      return flagVal + flag.config.unit;
    else if(flag.config.name === "Duration")
      return (flagVal === null) ? "?" : (flagVal < 60 ? flagVal + "min" : (Math.trunc(flagVal/60) +"h" + (flagVal%60 >= 10 ? flagVal%60 : "0" + flagVal%60)));
    else if(flag.config.name === "Difficulty")
    {
      if(flagVal === 0) return "Easy";
      if(flagVal === 1) return "Soft";
      if(flagVal === 2) return "Simple";
      if(flagVal === 3) return "Doable";
      if(flagVal === 4) return "Hard";
      if(flagVal === 5) return "Rough";
      return "?";
    }
    else if(flag.config.name === "Touristy")
    {
      if(flagVal === 0) return "Desert";
      if(flagVal === 1) return "Quiet";
      if(flagVal === 2) return "Calm";
      if(flagVal === 3) return "Dense";
      if(flagVal === 4) return "Busy";
      if(flagVal === 5) return "Crowded";
      return "?";
    }
    return "" + flagVal;
  },
};
