import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from '../Utilis/scale';

const WeatherInfo = ({ temperature, weatherCondition, locationName, humidity, windSpeed }) => {
  return (
    <View style={styles.weatherCard}>
      <Text style={styles.locationNameText}>{locationName}</Text>
      <Text style={styles.temperatureText}>{temperature}°C</Text>
      <Text style={styles.weatherConditionText}>{weatherCondition}</Text>
      
    </View>
  );
};

export default WeatherInfo

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  weatherInfoContainer: {
    alignItems: 'center',
  },
  temperatureText: {
    fontSize: moderateScale(50),
    color: '#333',
  },
  weatherConditionText: {
    fontSize: moderateScale(18),
    color: '#555',
    textTransform: 'capitalize',
    marginTop: 10,
  },
})