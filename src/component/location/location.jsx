import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLocation, userLocationCoordinates } from "../../Redux/userState";

function Location({ onCloseLocationPopup }) {
  const [Location, setLocation] = useState();
  const [locationQuery, setlocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [LocId, setLocId] = useState([]);

  const dispatch = useDispatch();
  const mapboxApi =
    "pk.eyJ1Ijoic2hhZmluc2hhIiwiYSI6ImNsbGR1a3Y0NjBoeGozY24waHpqYWpxMnUifQ.S5EWRgs87QYFEffmJC0hjw";
  useEffect(() => {
    const locationParts = locationQuery.trim().split(",");
    const firstPartOfLocation = locationParts[0];
    dispatch(userLocation({ location: firstPartOfLocation }));
    dispatch(userLocationCoordinates({ coordinate: LocId }));
  }, [locationQuery]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setlocationQuery(query);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxApi}`
      );
      const data = await response.json();
      setLocationSuggestions(
        data.features.map((feature) => ({
          place_name: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
        }))
      );
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleLocationSelection = (location) => {
    setLocation(location);
    setlocationQuery(location);
    setLocationSuggestions("");
    // Find the selected location suggestion
    const selectedSuggestion = locationSuggestions.find(
      (suggestion) => suggestion.place_name === location
    );

    if (selectedSuggestion) {
      const { latitude, longitude } = selectedSuggestion;
      let loc = [];
      loc[0] = longitude;
      loc[1] = latitude;
      setLocId(loc);
    }
  };
  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //         try {
  //           const response = await axios.get(
  //             `https://api.opencagedata.com/geocode/v1/json?key=e8f053bca9224cbe998fa030162df296&q=${position.coords.latitude}+${position.coords.longitude}`
  //           );

  //           if (response.data.results.length > 0) {
  //             setLocationName(response.data.results[0].formatted);
  //           }
  //         }  catch (error) {
  //           console.error('Error getting location:', error);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error getting location:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Geolocation is not supported by this browser.');
  //   }
  // };
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Select a Location
              </h3>
              <div className="mt-5">
                <input
                  type="search"
                  value={locationQuery}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring"
                />
                {locationSuggestions.length > 0 && (
                  <ul className="border border-gray-300 rounded-md   overflow-hidden max-h-36 ">
                    {locationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.latitude}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          handleLocationSelection(suggestion.place_name);
                          // sendLocationId(suggestion?.geometry.coordinates);
                        }}
                      >
                        {suggestion.place_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
              onClick={() => onCloseLocationPopup(locationQuery)}
            >
              OK
            </button>
            <div>
              {/* <button onClick={getLocation} className="bg-red-500">Get Location</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
