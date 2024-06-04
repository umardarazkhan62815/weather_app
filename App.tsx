import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { moderateScale } from './src/Utilis/scale';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import WeatherInfo from './src/Components/WeatherInfo';

const API_KEY = '31ab3aa9a1c144498090f0c7cd0ff0d1';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Location Permission',
          message: 'Cool Photo App needs access to your location so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        checkConnectivityAndFetchData();
      } else {
        console.log('Location permission denied');
        setLoading(false);
      }
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  const checkConnectivityAndFetchData = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        getCurrentLocation();
      } else {
        loadStoredData();
      }
    });
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        fetchCityName(latitude, longitude);
      },
      error => {
        Alert.alert('Error', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`
      );
      const data = await response.json();
      const cityName = data?.address?.suburb || data?.address?.city || data?.address?.town || data?.address?.village || 'Unknown location'
      setCity(cityName);
      fetchWeather(latitude, longitude, cityName);
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  const fetchWeather = async (latitude, longitude, cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
      saveDataToStorage(data, cityName);
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const saveDataToStorage = async (weatherData, cityName) => {
    try {
      await AsyncStorage.setItem('weatherData', JSON.stringify(weatherData));
      await AsyncStorage.setItem('cityName', cityName);
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const loadStoredData = async () => {
    try {
      const storedWeatherData = await AsyncStorage.getItem('weatherData');
      const storedCityName = await AsyncStorage.getItem('cityName');

      if (storedWeatherData && storedCityName) {
        setWeather(JSON.parse(storedWeatherData));
        setCity(storedCityName);
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const renderBackgroundImage = () => {
    if (!weather) return null;

    let backgroundImageSource = require('./src/Images/sunny.jpeg');

    const weatherCondition = weather?.weather[0].main.toLowerCase();
    switch (weatherCondition) {
      case 'rain':
        backgroundImageSource = require('./src/Images/Rainy.jpg');
        break;
      case 'clouds':
        backgroundImageSource = require('./src/Images/cloudy.webp');
        break;
      case 'haze':
        backgroundImageSource = require('./src/Images/haze.jpeg');
        break;
      default:
        break;
    }

    return <ImageBackground source={backgroundImageSource} style={styles.backgroundImage} />;
  };

  return (
    <View style={styles.container}>
      {renderBackgroundImage()}
      <View style={styles.overlay}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : weather ? (
          <WeatherInfo
            temperature={weather?.main?.temp}
            weatherCondition={weather?.weather[0]?.description}
            locationName={city}
          />
        ) : (
          <Text style={styles.weatherText}>Weather data not available</Text>
        )}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  
  locationNameText: {
    fontSize: moderateScale(20),
    color: '#333',
    fontWeight: 'bold',
    marginTop: moderateScale(10),
  },
  additionalInfo: {
    marginTop: moderateScale(10),
  },
  infoText: {
    fontSize: moderateScale(16),
    color: '#555',
  },
  weatherText: {
    fontSize: moderateScale(20),
    color: '#fff',
  },
});
