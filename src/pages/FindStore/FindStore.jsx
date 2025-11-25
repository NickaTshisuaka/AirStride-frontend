import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, X } from 'lucide-react';
import './FindStore.css';

const FindStore = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const storeAddress = "14 Valda Street, Townsview, Johannesburg";

  const handleGetDirections = () => {
    setUserLocation(null);
    setLocationError(null);
    setShowPermissionModal(true);
  };

  const confirmPermission = () => {
    setShowPermissionModal(false);
    setIsGettingLocation(true);
    console.log('Requesting fresh location permission...');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('New location obtained:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setIsGettingLocation(false);

        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${encodeURIComponent(storeAddress)}`;
        window.open(mapsUrl, '_blank');
      },
      (error) => {
        console.error('Location error:', error);
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              'You denied location access. Please click "Get Directions" again or check your browser settings.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Could not get your location. Please try again.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="page">
      <div className="content-wrapper">

        {/* Store Info Section */}
        <div className="store-info">
          <div className="location-header">
            <div className="icon-circle">
              <MapPin className="icon" />
            </div>
            <div>
              <h1>Our Store Location</h1>
              <p className="address">{storeAddress}</p>
            </div>
          </div>

          <div className="details">
            <div className="detail-item">
              <h3>
                <Clock className="small-icon" />
                Store Hours
              </h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>

            <div className="detail-item">
              <h3>
                <Phone className="small-icon" />
                Contact
              </h3>
              <p>Phone: (011) 123-4567</p>
              <p>Email: townsview@store.com</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        {/* <div className="info-box">
          <h3>
            <Navigation className="info-icon" />
            How Directions Work
          </h3>
          <p>
            When you click "Get Directions", we’ll ask for your location permission. Once granted, 
            Google Maps will open in a new tab showing the route from your current location to our store. 
            You can then choose your preferred mode of transport (driving, cycling, or walking) directly on Google Maps.
          </p>
        </div> */}

        {/* Get Directions Section */}
        {/* <div className="directions-section">
          <button 
            onClick={handleGetDirections} 
            className="btn-directions"
            disabled={isGettingLocation}
          >
            <Navigation className="btn-icon" />
            {isGettingLocation ? 'Getting your location...' : 'Get Directions'}
          </button>

          {locationError && (
            <div className="error-message">
              <p>{locationError}</p>
              <button onClick={handleGetDirections} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {userLocation && !locationError && (
            <div className="success-message">
              <p>✓ User's location successfully retrieved!</p>
            </div>
          )}
        </div> */}

        {/* Map Section */}
        <div className="map-section">
          <iframe
            className="map"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(storeAddress)}&zoom=15&maptype=roadmap`}
            title="Store Location Map"
          />
          
          <div className="map-badge">
            <MapPin className="badge-icon" />
            <span>Our Store</span>
          </div>
        </div>
      </div>

      {/* Custom Permission Modal */}
      {showPermissionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={() => setShowPermissionModal(false)}>
              <X />
            </button>
            <h2>Allow Location Access?</h2>
            <p>
              We’ll use your current location to show directions to our store in Google Maps.
              Your location data won’t be stored or shared.
            </p>
            <div className="modal-buttons">
              <button className="btn-allow" onClick={confirmPermission}>Allow</button>
              <button className="btn-cancel" onClick={() => setShowPermissionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindStore;
