import React, { useState, useEffect } from "react";
import StarRating from "../../../component/user/starRating/StarRating";
import userAxiosInstance from "../../../Axios/userAxios";
import { Link, useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  UserLogout,
  userLocation,
  userLocationCoordinates,
} from "../../../Redux/userState";
import Pagination from "../../pagination/Pagination";
import Location from "../../location/location";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";

function listPros() {
  const [pros, setPros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [prosPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setcategory] = useState([]);
  const [Data, setData] = useState("");
  const [filteredPros, setFilteredPros] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [locationPopupVisible, setLocationPopupVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAxios = userAxiosInstance();
  const queryLocation = useLocation();
  const queryParams = new URLSearchParams(queryLocation.search);
  let categoryQuery = queryParams.get("Category");
  const token = useSelector((store) => store.user.Token);
  const location = useSelector((store) => store.user.location);
  const locationCoordinates = useSelector(
    (store) => store.user.locationCoordinates
  );
  if (!token) {
    navigate("/");
  }
  const isTokenExpired = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      const currentTimestamp = Date.now() / 1000;
      return decodedToken.exp < currentTimestamp;
    }
    return true; // If there's no token, it is expired
  };
  useEffect(() => {
    const expired = isTokenExpired();
    if (expired) {
      dispatch(UserLogout());
      navigate("/login");
    } else {
      userAxios.get("/getPros").then((res) => {
        if (res.data.status) {
          setPros(res.data.pro);
          setcategory(res.data.category);
        }
      });
    }
    if (!location) {
      handleOpenLocationPopup();
    }
  }, []);
  const indexOfLastPro = currentPage * prosPerPage;
  const indexOfFirstPro = indexOfLastPro - prosPerPage;
  let currentPros

  const handleOpenLocationPopup = () => {
    setLocationPopupVisible(true);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = category.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelection = (categoryName) => {
    setData(categoryName);
    setSearchQuery(categoryName);
    setFilteredCategories("");
  };

  // For closing the location popup
  const handleCloseLocationPopup = () => {
    setLocationPopupVisible(false);
  };

  function calculateDistance(coords1, coords2) {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371; // Radius of the earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const radiusThreshold = 50;
  // filter
  if (categoryQuery) {
    currentPros = pros.filter((user) => {
      const hasCat = user.category.name === categoryQuery;
      const distance = calculateDistance(
        user.location.location.LocId,
        locationCoordinates
      );
      const isWithinRadius = distance <= radiusThreshold;
      return hasCat && isWithinRadius;
    });
    currentPros = currentPros.slice(indexOfFirstPro, indexOfLastPro);
  } else {
    currentPros = pros.filter((user) => {
      const distance = calculateDistance(
        user.location.location.LocId,
        locationCoordinates
      );
      const isWithinRadius = distance <= radiusThreshold;
      return isWithinRadius;
    });
    currentPros = currentPros.slice(indexOfFirstPro, indexOfLastPro);
  }

  const searchForm = (e) => {
    e.preventDefault();
    if (
      Data.toLocaleLowerCase() !== searchQuery.toLocaleLowerCase() ||
      Data.trim().length < 3
    ) {
      console.log("Error please fill correct ");
      return;
    } else {
      const filtered = pros.filter((user) => {
        const hasCat = user.category.name === searchQuery;
        const distance = calculateDistance(
          user.location.location.LocId,
          locationCoordinates
        );
        const isWithinRadius = distance <= radiusThreshold;
        return hasCat && isWithinRadius;
      });
      setFilteredPros(filtered);
    }
  };
  return (
    <>
      <div className="main">
        <div className="absolute right-10" onClick={handleOpenLocationPopup}>
          <div className="relative inline-flex items-center">
            <div className="pr-1 text-xs">
              {location ? location : "Location"}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mt-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="1">
          <form
            action=""
            method="POST"
            onSubmit={searchForm}
            className="flex justify-center"
          >
            <div className="sm:flex bg-white p-3 mt-2 sm:mt-8 rounded-lg justify-evenly items-center shadow-md sm:max-h-16 w-screen sm:w-5/6 lg:w-4/6">
              <div className="  justify-center  sm:flex border  rounded mr-1 sm:w-3/4">
                <div className="mb-1 sm:mb-0 flex-grow mr-2 sm:w-3/12">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring"
                  />
                </div>
              </div>

              <div className="mt-2 sm:mt-0 flex justify-center">
                <button
                  type="submit"
                  className="w- px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <span className="text-sm md:text-sm">Submit</span>
                </button>
              </div>
            </div>
          </form>
          {filteredCategories.length > 0 ? (
              <ul className="border border-gray-300 rounded-md overflow-y-auto m-auto max-h-28 w-1/2">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    value=""
                    onClick={() => {
                      handleCategorySelection(cat.name);
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
        </div>
        <div className="2 flex justify-center mt-10">
          <div className="content flex-col justify-center p-10 mb-5 bg-gray-100 w-4/6 h-[70vh] overflow-y-scroll">
          {filteredPros.length > 0 || currentPros.length > 0 ? (
            filteredPros.length > 0
              ? filteredPros.map((pro) => {
                const rating = pro.rating.stars/pro.rating.TotalReviews
                console.log(rating);
                  return (
                    <div
                      key={pro._id}
                      className="bg-blue-100  h-fit p-3 pt-0 mb-1"
                    >
                      <div className="profile flex p-5 pt-2 pb-0 justify-between">
                        <div className="flex gap-2 mb-3">
                          <img
                            className="rounded w-10 h-10 bg-black"
                            src=""
                            alt=""
                          />
                          <div className="proDetails">
                            <h4 className="font-medium font-mono text-[14px] ">
                              {pro.name}
                            </h4>
                            <h6 className="text-[12px] font-serif">
                              {pro.category.name}
                            </h6>
                            <h6 className="text-[2vh]">
                              {pro.location.location.locationQuery
                                ? pro.location.location.locationQuery
                                : "Location"}
                            </h6>
                            <h6 className="text-[1.8vh]">
                              Charge ₹{" "}
                              {pro.charge && pro.charge.fulltime
                                ? pro.charge.fulltime
                                : 0}
                            </h6>
                          </div>
                        </div>
                        {/*StarRating component*/}
                        {pro.rating.stars ? (
                        <div className="flex items-start">
                          <StarRating rating={pro.rating.stars/pro.rating.TotalReviews} />
                          <span className="text-xs">({pro.rating.TotalReviews})</span>
                        </div>
                        ):(
                          <div>No Ratings</div>
                        )}
                      </div>
                      {/* <div className='flex ps-5 w-3/4 m-auto mb-2'>
         <span>
          <h5 className='text-[10px]'>descriptions</h5>
          </span>
      </div> */}
                      <div className="main flex items-center justify-center">
                        <div className="tags flex text-center gap-2 w-5/6">
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs ">Tags</h6>
                          </div>
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs">Tags</h6>
                          </div>
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs">Tags</h6>
                          </div>
                        </div>
                        <Link
                          to={"/connect"}
                          state={{ proData: pro }}
                          className="bg-blue-500 flex justify-center items-center text-white button rounded-lg w-20 h-6 text-xs"
                        >
                          connect
                        </Link>
                      </div>
                    </div>
                  );
                })
              : currentPros.map((pro) => {
                  return (
                    <div
                      key={pro._id}
                      className="bg-blue-100  h-fit p-3 pt-0 mb-1"
                    >
                      <div className="profile flex p-5 pt-2 pb-0 justify-between">
                        <div className="flex gap-2 mb-3">
                          <img
                            className="rounded w-10 h-10 bg-black"
                            src=""
                            alt=""
                          />
                          <div className="proDetails">
                            <h4 className="font-medium font-mono text-[14px] ">
                              {pro.name}
                            </h4>
                            <h6 className="text-[12px] font-serif">
                              {pro.category.name}
                            </h6>
                            <h6 className="text-[2vh]">
                              {pro.location.location.locationQuery
                                ? pro.location.location.locationQuery
                                : "Location"}
                            </h6>
                            <h6 className="text-[1.8vh]">
                              Charge ₹{" "}
                              {pro.charge && pro.charge.fulltime
                                ? pro.charge.fulltime
                                : 0}
                            </h6>
                          </div>
                        </div>
                        {/*StarRating component*/}
                        {pro.rating.stars ? (
                        <div className="flex items-start">
                          <StarRating rating={pro.rating.stars/pro.rating.TotalReviews} />
                          <span className="text-xs">({pro.rating.TotalReviews})</span>
                        </div>
                        ):(
                          <div>No Ratings</div>
                        )}
                      </div>
                      {/* <div className='flex ps-5 w-3/4 m-auto mb-2'>
                   <span>
                    <h5 className='text-[10px]'>descriptions</h5>
                    </span>
                </div> */}
                      <div className="main flex items-center justify-center">
                        <div className="tags flex text-center gap-2 w-5/6">
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs ">Tags</h6>
                          </div>
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs">Tags</h6>
                          </div>
                          <div className="bg-blue-300 flex items-center justify-center rounded-xl w-24 h-6">
                            <h6 className="text-xs">Tags</h6>
                          </div>
                        </div>
                        <Link
                          to={"/connect"}
                          state={{ proData: pro }}
                          className="bg-blue-500 flex justify-center items-center text-white button rounded-lg w-20 h-6 text-xs"
                        >
                          connect
                        </Link>
                      </div>
                    </div>
                  );
                })
  ):(
    <p className="text-center text-gray-500">No Profession Available</p>
  )
                }
                
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(pros.length / prosPerPage)}
        onPageChange={setCurrentPage}
      />
      {locationPopupVisible && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          {/* <div className="w-1/2 h-28 bg-sky-200 p-2"> */}
          <Location onCloseLocationPopup={handleCloseLocationPopup} />
          {/* </div> */}
        </div>
      )}
    </>
  );
}

export default listPros;
