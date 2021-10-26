const isDEV = true;

export default
{
  isDEV: isDEV,
  // ----------------------------------------------- Server ----------------------------------------------- //
  //serverUrl: "https://tripick.app/" + (isDEV ? "dev/" : ""), //"https://tripick.app/", //"https://192.168.0.30:32768/",
  serverUrl: "http://10.0.0.9:49153/",
  // ----------------------------------------------- Google Sign In ----------------------------------------------- //
  androidClientId:
    "898644342226-bbohptr0p8kied7ncfg1tesbmkh9qb2u.apps.googleusercontent.com",
  iosClientId:
    "898644342226-gndl4mffmm8rf8q9mefpko3ks9nt12s7.apps.googleusercontent.com",
  // Standalone,
  androidStandaloneAppClientId:
    isDEV === true
      ? "898644342226-o4h3k3cfitio97coap1mesvaqrqk8egc.apps.googleusercontent.com" // DEV
      : "898644342226-o2hu6q75sti2uvaqre9hidhool3voq9e.apps.googleusercontent.com", // PROD
  iosStandaloneAppClientId:
    isDEV === true
      ? "898644342226-codg2ddp741trhlro27uet3bfpfgsb3h.apps.googleusercontent.com" // DEV
      : "898644342226-i6v5no65id18n9gvidu401ehgmfu73bf.apps.googleusercontent.com", // PROD

  // ----------------------------------------------- Places ----------------------------------------------- //
  placeNameMinLength: 5,
  placeNameMaxLength: 50,
  placeDescriptionAndReviewMinLength: 20,
  placeDescriptionAndReviewMaxLength: 500,

  // ----------------------------------------------- Trips ----------------------------------------------- //
  maxTripLength: 60,
  tripNameMinLength: 5,
  tripNameMaxLength: 50,

  // ----------------------------------------------- Images ----------------------------------------------- //
  importImageQuality: 0.1,

  // ----------------------------------------------- Map ----------------------------------------------- //
  defaultMapPoint: { latitude: 48.8566, longitude: 2.3522, latitudeDelta:5.7025, longitudeDelta:3.5778 },
  mapType: Platform.OS == "android" ? "none" : "standard",
  tileProvider:
    "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    //"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    //"https://osmap.b.tile.mapcdn.net/en/map/v1/{z}/{x}/{y}.png",

  // ----------------------------------------------- Pick ----------------------------------------------- //
  googleSearch: "https://www.google.com",
  googlePlacesQuery: "https://www.google.com/maps/search/?api=1&query=",
  //googleImagesQuery: "https://www.google.com/search?tbm=isch&q=",
  googleImagesQuery: "https://www.google.com/maps/search/?api=1&query=",
  googleImagesQueryId: "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=",
  googleSearchWeb: "https://www.google.com/search?lr=lang_en&q=",
  googleDirectionsToLatLonWithOrigin: "https://www.google.com/maps/dir/?api=1&origin=",
  googleDirectionsToLatLon: "https://www.google.com/maps/dir/?api=1&destination=",
  googleMultiDir: "https://www.google.com/maps/dir/",

  // ----------------------------------------------- Dates ----------------------------------------------- //
  dateSeparator: "/",
  dateTextSeparator: "/",

  // ----------------------------------------------- Login ----------------------------------------------- //
  emailMinLength: 5,
  emailMaxLength: 50,
  usernameMinLength: 3,
  usernameMaxLength: 30,
  passwordMinLength: 8,
  passwordMaxLength: 50,
  
};
