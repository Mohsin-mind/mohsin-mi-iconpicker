import React, { useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};
const GoogleMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
    version: 'beta',
  });
  useEffect(() => {
    let map;
    let marker;
    let infoWindow;
    
    async function initMap() {
      if(!isLoaded){
        return;
      }
      const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
        window.google.maps.importLibrary("marker"),
        window.google.maps.importLibrary("places"),
      ]);
      
      map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.749933, lng: -73.98633 },
        zoom: 13,
        mapId: "4504f8b37365c3d0",
        mapTypeControl: false,
      });

      const placeAutocomplete =
        new window.google.maps.places.PlaceAutocompleteElement();

      placeAutocomplete.id = "place-autocomplete-input";

      const card = document.getElementById("place-autocomplete-card");

      card?.appendChild(placeAutocomplete);
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(card);
      marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: 40.749933, lng: -73.98633 },
      });
      
      infoWindow = new window.google.maps.InfoWindow({});
      placeAutocomplete.addEventListener(
        "gmp-placeselect",
        async ({ place }) => {
          console.log(place,'place');
          
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
          });
          // If the place has a geometry, then present it on a map.
          if (place.viewport) {
            map.fitBounds(place.viewport);
          } else {
            map.setCenter(place.location);
            map.setZoom(17);
          }

          let content =
            '<div id="infowindow-content">' +
            '<span id="place-displayname" class="title">' +
            place.displayName +
            "</span><br />" +
            '<span id="place-address">' +
            place.formattedAddress +
            "</span>" +
            "</div>";

          updateInfoWindow(content, place.location);
          marker.position = place.location;
        }
      );
      // [END maps_place_autocomplete_map_listener]
    }

    // Helper function to create an info window.
    function updateInfoWindow(content, center) {
      infoWindow.setContent(content);
      infoWindow.setPosition(center);
      infoWindow.open({
        map,
        anchor: marker,
        shouldFocus: false,
      });
    }

    if (isLoaded) {
      initMap();
    } else {
    }
  }, [isLoaded]);

  return (
    <>
      <div className="place-autocomplete-card" id="place-autocomplete-card">
      </div>
      <div id="map" style={mapContainerStyle}></div>
    </>
  );
};

export default GoogleMap;
