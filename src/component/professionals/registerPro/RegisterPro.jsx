import React, { useState, useEffect, useRef } from "react";
import professionalsAxiosInterceptor from "../../../Axios/professionalsAxios";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import mapboxgl from "mapbox-gl";

function RegisterPro() {
  const Nameref = useRef();
  const Emailref = useRef();
  const Phoneref = useRef();
  const Categoryref = useRef();
  const Locationref = useRef();
  const FullTimeref = useRef();
  const PartTimeref = useRef();
  const Passwordref = useRef();
  const navigate = useNavigate();
  const professionalsAxios = professionalsAxiosInterceptor();
  const [error, setError] = useState("");
  const [Cat, setCat] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setlocationQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [Category, setCategory] = useState("");
  const [CatId, setCatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [Location, setLocation] = useState();
  const [LocId, setLocId] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [map, setMap] = useState(null);

  const setErrMsg = (err) => {
    setLoading(false);
    toast.error(err, { position: "bottom-center" });
  };
  const setSucMsg = (ok) => toast.success(ok, { position: "bottom-center" });

  const fetchData = async () => {
    try {
      const res = await professionalsAxios.get("/listCat");
      if (res.data.status) {
        setCat(res.data.category);
      } else {
        navigate("/professional/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const mapboxApi =
    "pk.eyJ1Ijoic2hhZmluc2hhIiwiYSI6ImNsbGR1a3Y0NjBoeGozY24waHpqYWpxMnUifQ.S5EWRgs87QYFEffmJC0hjw";
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = Cat.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelection = (categoryName) => {
    setCategory(categoryName);
    setSearchQuery(categoryName);
    setFilteredCategories(""); // Clear the search query after selecting a category
  };

  const sendId = (id) => {
    setCatId(id);
  };

  const signUpForm = (event) => {
    event.preventDefault();
    setLoading(true);
    const name = Nameref.current.value;
    const email = Emailref.current.value;
    const phone = Phoneref.current.value;
    const category = CatId;
    const location = { LocId, locationQuery };
    const fullTime = FullTimeref.current.value;
    const partTime = PartTimeref.current.value;
    const password = Passwordref.current.value;
    // Validation
    if (!name || name.trim().length < 4) {
      setErrMsg("Enter Valid Name.");
      return;
    }

    if (!email || email.trim().length < 5) {
      setErrMsg("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrMsg("Invalid email format.");
      return;
    }

    if (!phone || !/^\d{10}$/.test(phone.toString().trim())) {
      setErrMsg("Phone must be a 10-digit number.");
      return;
    }

    if (Category.toLocaleLowerCase() !== searchQuery.toLocaleLowerCase()) {
      setErrMsg("Please Choose a valid Category");
      return;
    }
    if (Location !== locationQuery || !LocId) {
      setErrMsg("Please Choose Location");
      return;
    }
    if (!fullTime || fullTime.toString().trim().length < 3) {
      setErrMsg("Please Enter a valid Rate");
      return;
    }
    if (!partTime || partTime.toString().trim().length < 3) {
      setErrMsg("Please Enter a valid Rate");
      return;
    }
    if (!password || password.toString().trim().length < 6) {
      setErrMsg("Password must be at least 6 characters long.");
      return;
    }

    professionalsAxios
      .post("/registerPro", {
        name,
        email,
        phone,
        category,
        location,
        fullTime,
        partTime,
        password,
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          navigate("/professional/login", {
            state: { successMessage: res.data.message },
          });
        } else {
          setErrMsg(res.data.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if (error?.response?.status == 404) {
          navigate("/professional/*");
        } else if (error?.response?.status == 500) {
          navigate("/professional/serverError");
        } else {
          navigate("/professional/serverError");
        }
      });
  };

  const handleLocation = async (event) => {
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
          latitude: feature.center[1], // Extract latitude
          longitude: feature.center[0], // Extract longitude
        }))
      );
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };
  const handleLocationSelection = (location) => {
    setLocation(location);
    setlocationQuery(location);
    setLocationSuggestions(""); // Clear the search query after selecting a category

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
  return (
    <div className="flex justify-center items-center h-full  ">
      <div className="h-4/5 w-4/5 md:flex">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className="flex md:w-2/3 justify-center py-10 items-center bg-white">
          <form method="POST" onSubmit={signUpForm} className="bg-white">
            <h1 className="text-gray-800 font-bold text-2xl mb-1">
              Hey there!
            </h1>
            <p className="text-sm font-normal text-gray-600 mb-7">
              Create Your Account Now
            </p>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={Nameref}
                type="text"
                name="Name"
                id=""
                placeholder="Your Name"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ fill: "gray" }}
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={Emailref}
                type="text"
                name="email"
                id=""
                placeholder="Your Email"
              />
            </div>
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                aria-hidden="true"
                focusable="false"
                className="icon "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ transform: "rotate(90deg)", fill: "gray" }}
              >
                <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={Phoneref}
                type="text"
                name="phone"
                id=""
                placeholder="Your Phone Number"
              />
            </div>

            {/* Display filtered categories as a list */}
            <div className="flex items-center border-2 py-2 px-3 outline-none rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ fill: "gray" }}
              >
                <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search category..."
              />
            </div>
            {filteredCategories.length > 0 ? (
              <ul className="border border-gray-300 rounded-md overflow-y-auto max-h-36">
                {filteredCategories.map((category) => (
                  <li
                    key={category._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleCategorySelection(category.name),
                        sendId(category._id);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                width="1em"
                height="1em"
                style={{ fill: "gray" }}
              >
                <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={Locationref}
                type="text"
                name="location"
                id=""
                placeholder="Location"
                value={locationQuery}
                onChange={handleLocation}
              />
            </div>
            {locationSuggestions.length > 0 && (
              <ul className="border border-gray-300 rounded-md w-96  overflow-hidden max-h-36 ">
                {locationSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
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
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ transform: "rotate(90deg)", fill: "gray" }}
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={FullTimeref}
                type="number"
                name="fullTime"
                id=""
                placeholder="Charge Full Time"
              />
            </div>

            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width="1em"
                height="1em"
                style={{ transform: "rotate(90deg)", fill: "gray" }}
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={PartTimeref}
                type="number"
                name="partTime"
                id=""
                placeholder="Charge Part Time"
              />
            </div>

            {/* //////////////////////// */}
            <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="pl-2 outline-none border-none w-80"
                ref={Passwordref}
                type="password"
                name="password"
                id=""
                placeholder="Enter Your Password"
              />
            </div>
            <button
              type="submit"
              name="Signup"
              disabled={loading}
              className=" w-full bg-indigo-600 mt-4 py-2 text-center flex justify-center rounded-2xl text-white font-semibold mb-2"
            >
              {loading ? (
                <CgSpinner size={20} className="animate-spin mr-2" />
              ) : (
                "Register"
              )}
            </button>
            <Link
              to={"/professional/login"}
              className="text-sm ml-2 hover:text-blue-500 cursor-pointer"
            >
              I am Already A Member
            </Link>
          </form>
        </div>
        <div
          style={{ backgroundImage: "url('/register/background.png')" }}
          className={`relative overflow-hidden hidden md:flex w-2/3 bg-no-repeat bg-center bg-contain justify-around items-center`}
        >
          <img
            className="relative md:top-1/4 lg:top-64 xl:top-72"
            src="/loginpage/logo2.png"
            alt=""
          />
          {/* Text inside */}
        </div>
      </div>
    </div>
  );
}

export default RegisterPro;
