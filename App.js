import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location'
import { API_KEY } from '@env';

export default function App() {
  const intial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  }
  const [place, setPlace] = useState(intial)
  const [address, setAddress] = useState('')


  useEffect(() => {
    const fetchingLoc = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ei ole lupaa saada sijaintisi')
        return;
      } else {
        try {
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
          console.log(Location)
          setPlace({...place, latitude: location.coords.latitude, longitude: location.coords.longitude});
        } catch (error) {
          console.log(error.message)
        }
      }
    }
    fetchingLoc();
  }, [])


  const fetching = async (address) => {
    console.log(address)

    const KEY = process.env.API_KEY || Constants.manifest.extra.apiKey;
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`
  
    try {
      const resp = await fetch(url)
      const data = await resp.json()

      console.log(data)
      const { lat, lng } = data.results[0].locations[0].latLng
      console.log(lat, lng);
      setPlace({ ...place, latitude: lat, longitude: lng })
    } catch (error) {
      console.error("Jokin meni pieleen.", error.message);
    }
    Keyboard.dismiss();
  }


  return (
    <View style={styles.container}>

      <MapView
        style={styles.map}
        region={place}
      >
        <Marker coordinate={place}/>
      </MapView>

      <TextInput
        style={styles.input}
        placeholder='Antaisitko osoitteen, kiitos.'
        value = {address}
        onChangeText={text => setAddress(text)}
      />

      <Button
        title='Etsi'
        onPress={() => fetching(address)}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  input: {
    width: "100%",
    height: "12%",
    borderColor: 'azure',
    padding: 20
  }
});
