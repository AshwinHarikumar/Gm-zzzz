
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Sensor() {
  const [illuminance, setIlluminance] = useState(null);

  useEffect(() => {
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          console.log(`Ambient light level: ${sensor.illuminance} lux`);
          setIlluminance(sensor.illuminance);
          
          sendSensorData(sensor.illuminance);
        });
        sensor.start();
      } catch (error) {
        console.error('Error initializing sensor:', error);
        setIlluminance(getIlluminanceByTime()); 
      }
    } else {
      console.log('Ambient Light Sensor not supported. Mimicking based on time.');
      setIlluminance(getIlluminanceByTime()); 
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


  return (
    <div className="App">
      <header className="App-header">
        <h1>Ambient Light Sensor</h1>
        {illuminance !== null ? (
          <p>Current ambient light level: {illuminance} lux</p>
        ) : (
          <p>Ambient light sensor data is not available.</p>
        )}
      </header>
    </div>
  );
}

export default Sensor;