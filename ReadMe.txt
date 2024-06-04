This is a React Native weather application that fetches the user's current location, displays the weather information, and changes the background image based on the weather condition.

Features:
Current Location Weather: Automatically fetches the weather for the user's current location.
(Using Geolocation library for getting user current location)
Background Images: Dynamically changes the background image based on the weather condition (e.g., sunny, rainy, cloudy, haze).
Offline Support: Stores the weather data locally using AsyncStorage to display it when the device is offline.
Loading Indicator: Displays a loading indicator while fetching data.

File Structure
App.tsx: Main application component.
src/Components/WeatherInfo.tsx: Component to display weather information.
src/Images: Directory containing background images for different weather conditions.
src/Utilis/scale.tsx: Utility for scaling UI elements.

Permissions:
The app requires location permissions to fetch the user's current location. 

Offline Support:
The app uses AsyncStorage to store and retrieve weather data locally when there is no internet connection.
Using react-native-async-storage/async-storage for offline support 
For checking connectivity using @react-native-community/netinfo
  
To run this app 
Firt clone the given repo
Run command "yarn install or npm install"

for android:
To install in the mobile run command "yarn android" or "npm run android"

For iOS :
  "cd ios"
Then 
 "pod install"
Run "yarn ios " 