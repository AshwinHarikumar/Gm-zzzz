import React, { useEffect, useState } from 'react';
import dayImage from '/morning.png'; 
import nightImage from '/night.png'; 

function Sensor() {
  const [illuminance, setIlluminance] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [isDaytime, setIsDaytime] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    }

    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new AmbientLightSensor();
        let lastReading = null;
        sensor.addEventListener('reading', () => {
          const currentReading = sensor.illuminance;
          if (lastReading === null || Math.abs(currentReading - lastReading) < 1000) {
            console.log(`Ambient light level: ${currentReading} lux`);
            setIlluminance(currentReading);
            determineDaytime(currentReading);
            sendSensorData(currentReading);
          }
          lastReading = currentReading;
        });
        sensor.start();
      } catch (error) {
        console.error('Error initializing sensor:', error);
        setIlluminance(getIlluminanceByTime());
        determineDaytime(getIlluminanceByTime());
      }
    } else {
      console.log('Ambient Light Sensor not supported. Mimicking based on time.');
      const illuminanceByTime = getIlluminanceByTime();
      setIlluminance(illuminanceByTime);
      determineDaytime(illuminanceByTime);
    }
  }, []);

  const getIlluminanceByTime = () => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 18) {
      return 10000;
    } else if (hours >= 18 && hours < 21) {
      return 500;
    } else {
      return 50;
    }
  };

  const determineDaytime = (illuminance) => {
    if (illuminance > 1000) {
      setIsDaytime(true);
    } else {
      setIsDaytime(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ambient Light Sensor</h1>
        
        {illuminance !== null ? (
          <p>Current ambient light level: {illuminance} lux</p>
        ) : (
          <p>Ambient light sensor data is not available.</p>
        )}
        
        {location.lat !== null && location.lon !== null && (
          <p>Location: Latitude {location.lat}, Longitude {location.lon}</p>
        )}
       
        {isDaytime !== null && (
          <>
            <p>It is currently {isDaytime ? 'day time' : 'night time'} </p>
            <br/>
            <img src={isDaytime ? dayImage : nightImage} alt={isDaytime ? 'Daytime' : 'Nighttime'} />
          </>
        )}
        
      </header>
    </div>
  );
}

export default Sensor;
