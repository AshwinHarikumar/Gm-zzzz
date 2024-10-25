import React, { useEffect, useState } from 'react';
import dayImage from '/morning.png';
import nightImage from '/night.png';
import './Sensor.css'; // Importing CSS for styling

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
            setIlluminance(currentReading);
            determineDaytime(currentReading);
          }
          lastReading = currentReading;
        });
        sensor.start();
      } catch (error) {
        console.error('Error initializing sensor:', error);
        fallbackIlluminance();
      }
    } else {
      fallbackIlluminance();
    }
  }, []);

  const fallbackIlluminance = () => {
    const illuminanceByTime = getIlluminanceByTime();
    setIlluminance(illuminanceByTime);
    determineDaytime(illuminanceByTime);
  };

  const getIlluminanceByTime = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 6 && hours < 18) return 10000;
    else if (hours >= 18 && hours < 21) return 500;
    else return 50;
  };

  const determineDaytime = (illuminance) => {
    setIsDaytime(illuminance > 800);
  };

  return (
    <div className="sensor-app">
      <header className="sensor-header">
        <h1 className="title">Ambient Light Sensor</h1>

        <div className="sensor-info">
          {illuminance !== null ? (
            <p className="sensor-reading">Current ambient light level: <strong>{illuminance} lux</strong></p>
          ) : (
            <p className="sensor-reading unavailable">Ambient light sensor data is not available.</p>
          )}

          {/* Uncomment to display location */}
          {/* {location.lat !== null && location.lon !== null && (
            <p className="location">Location: Latitude {location.lat}, Longitude {location.lon}</p>
          )} */}

          {isDaytime !== null && (
            <div className="daytime-status">
              <p>It is currently {isDaytime ? 'day time' : 'night time'}</p>
              <img
                className="daytime-image"
                src={isDaytime ? dayImage : nightImage}
                alt={isDaytime ? 'Daytime' : 'Nighttime'}
              />
            </div>
          )}
        </div>
      </header>
      <footer className="sensor-footer">
        <meter
          className="lux-meter"
          value={illuminance || 0}
          min="0"
          max="3000"
        ></meter>
        <p>light Meter Intensity</p>
      </footer>
    </div>
  );
}

export default Sensor;
