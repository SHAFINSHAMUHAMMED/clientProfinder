import React, { useEffect, useState } from "react";
import professionalAxiosInterceptor from "../../../Axios/professionalsAxios";
import Editprofile from "../editProfile/editProfile";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
import StarRating from "../../../component/user/starRating/StarRating";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import Star from "../../user/starRating/StarRating";
import Gallery from "../../gallery/Gallery";
import FadeLoader from "react-spinners/FadeLoader";

function userProfile() {
  const token = useSelector((store) => store.professional.Token);
  const proId = useSelector((store) => store.professional.proId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const proAxios = professionalAxiosInterceptor();
  const [ProData, setProData] = useState();
  const [Bookings, setBookings] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editpopup, seteditpopup] = useState(false);
  const [updateprofile, setupdateprofile] = useState(0);
  const [update, setupdate] = useState(false);
  const [activeStatus, setActiveStatus] = useState("about");
  const [Reviews, setReviews] = useState([]);
  const [visibleReviewCount, setVisibleReviewCount] = useState(5);

  const isTokenExpired = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      const currentTimestamp = Date.now() / 1000;
      return decodedToken.exp < currentTimestamp;
    }
    return true; // If there's no token, it is expired
  };

  const handleUserDataUpdate = (updatedData) => {
    setProData(updatedData);
  };

  useEffect(() => {
    const expired = isTokenExpired();
    if (expired) {
      dispatch(proLogout());
      navigate("/professional/");
    } else {
      fetchProDetails();
    }
  }, [navigate, dispatch, token, updateprofile, update]);

  const fetchProDetails = async () => {
    try {
      const response = await proAxios.get(`/proDetails?proId=${proId}`);
      const data = response.data.data;
      const bookings = response.data.bookings;
      setIsLoading(false);
      setProData(data);
      setBookings(bookings);

      const reviews = bookings.filter((order) => order.reviews.star);
      setReviews(reviews);
    } catch (error) {
      console.error("Error fetching details:", error);
      if (error?.response?.status == 404) {
        navigate("/professional/*");
      } else if (error?.response?.status == 500) {
        navigate("/professional/serverError");
      } else {
        navigate("/professional/serverError");
      }
    }
  };
  const handleActive = (active) => {
    setActiveStatus(active);
  };
  const handleViewMoreClick = () => {
    setVisibleReviewCount(Reviews.length);
  };
  const handleStatus = () => {
    proAxios
      .patch("/changeAvailability", { id: proId, status: ProData.status })
      .then((res) => {
        if (res.data.status) {
          setupdate(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 404) {
          navigate("/professional/*");
        } else if (error?.response?.status == 500) {
          navigate("/professional/serverError");
        } else {
          navigate("/professional/serverError");
        }
      });
    setupdate(false);
  };
  return (
    <div className="pt-10 sm:p-8 md:p-5 lg:p-16 xl:p-20 ">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <FadeLoader color="#242ae8" /> {/* Loading spinner */}
        </div>
      ) : (
        <div className="bg-slate-200 rounded-md">
          <div className="flex justify-between border-b border-black p-3 sm:p-10">
            <div className="flex gap-3 ">
              {ProData && ProData.image ? (
                <img
                  className="w-10 h-10 sm:w-20 sm:h-20 rounded-full"
                  src={ProData.image}
                  alt=""
                />
              ) : (
                <img
                  className="w-10 sm:w-24 rounded-full"
                  src="/ajmal.jpg"
                  alt=""
                />
              )}

              <div className="">
                <h2 className="text-sm sm:text-lg font-medium">
                  {ProData ? ProData.name : "Name"}
                </h2>
                <div className="sm:flex gap-2">
                  <h5 className=" text-sm sm:text-base">
                    {ProData ? ProData.category.name : "Category"}
                  </h5>
                  <div className="flex">
                    <div className="mt-1.5 sm:mt-2 w-16  sm:w-full">
                      <Star
                        rating={
                          ProData
                            ? ProData.rating.stars / ProData.rating.TotalReviews
                            : 0
                        }
                      />
                    </div>
                    <h6 className="text-sm sm:text-base">{}</h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <img
                className="h-3 sm:h-4 lg:h-5 ms-20"
                src="/icons/more.png"
                alt=""
                onClick={() => {
                  setIsPopupOpen(!isPopupOpen);
                  setActiveStatus("about");
                }}
              />
              <button
                onClick={handleStatus}
                className={
                  ProData.status == "Active"
                    ? "px-2 py-1 bg-green-500  mt-10 w-24 text-center rounded-lg text-xs lg:text-sm font-medium text-white"
                    : "px-2 py-1 bg-red-500 mt-10 w-24 text-center rounded-lg text-xs lg:text-sm font-medium text-white"
                }
              >
                {ProData.status === "Active" ? "Active" : "Deactivated"}
              </button>
            </div>
            {/* //////popup */}

            {editpopup && (
              <Editprofile
                role={"pro"}
                userData={ProData}
                updateUserData={handleUserDataUpdate}
                closePopup={seteditpopup}
                update={setupdateprofile}
                count={updateprofile}
              />
            )}
          </div>
          {isPopupOpen && (
            <div
              className="   inset-2 bg-gray-500 bg-opacity-50"
              onClick={() => setIsPopupOpen(false)}
            >
              <div className="absolute right-8 top-40 sm:right-16 sm:top-48 md:right-14 md:top-36 lg:right-28 lg:top-48 xl:right-32 xl:top-52 mt-1 w-36 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="bg-white p-2 rounded-lg">
                  <button
                    onClick={() => seteditpopup(true)}
                    className="block w-full py-2 text-blue-600 hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="part2 p-1 sm:p-5 md:p-3">
            <div className="flex gap-1 ms-5 mt-5 sm:mt-0">
              <h5
                onClick={() => handleActive("about")}
                className={
                  activeStatus === "about"
                    ? "bg-white w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                    : "bg-slate-400 w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                }
              >
                About You
              </h5>
              <h5
                onClick={() => handleActive("reviews")}
                className={
                  activeStatus === "reviews"
                    ? "bg-white w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                    : "bg-slate-400 w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                }
              >
                User Reviews
              </h5>
              <h5
                onClick={() => handleActive("gallery")}
                className={
                  activeStatus === "gallery"
                    ? "bg-white w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                    : "bg-slate-400 w-36 h-8 flex justify-center items-center rounded-lg text-xs sm:text-base font-semibold"
                }
              >
                Your Gallery
              </h5>
            </div>
            <div className="innerPart p-3 sm:p-4 md:p-3">
              <div className="bg-slate-300 p-2 sm:p-4 md:p-2 lg:p-8  rounded">
                {activeStatus == "about" ? (
                  <>
                    <div className=" sm:grid grid-cols-6 gap-1">
                      <div className="col-span-4 sm:justify-items-start grid grid-cols-2">
                        <div className="col-span-1">
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg font-semibold">
                            Email
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg font-semibold">
                            Your Location
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg font-semibold">
                            Contact
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg font-semibold">
                            Full Charge
                          </h5>
                        </div>
                        <div className="col-span-1">
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-[14px]">
                            : {ProData ? ProData.email : "Email"}
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg">
                            :{" "}
                            {ProData
                              ? ProData.location.location.locationQuery.split(
                                  " "
                                )[0]
                              : "Location"}
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg">
                            : {ProData ? ProData.phone : "Phone"}
                          </h5>
                          <h5 className="text-sm sm:text-base md:text-sm lg:text-lg">
                            : ₹ {ProData ? ProData.charge.fulltime : "₹"}
                          </h5>
                        </div>
                      </div>
                      <div className="col-span-2 sm:justify-items-end grid grid-cols-2">
                        <div className="col-span-1">
                          <h5 className="text-sm sm:text-sm md:text-sm lg:text-lg font-semibold">
                            Joined On
                          </h5>
                          <h5 className="text-sm sm:text-sm md:text-sm lg:text-lg font-semibold">
                            Profession
                          </h5>
                          <h5 className="text-sm sm:text-sm md:text-[13px] lg:text-[95%] font-semibold">
                            Part Charge
                          </h5>
                        </div>
                        <div className="col-span-1 mt-1">
                          <h5 className="text-sm sm:text-xs md:text-xs lg:text-[95%]">
                            : 10-10-2022
                          </h5>
                          <h5 className="text-sm sm:text-sm md:text-sm lg:text-lg">
                            : {ProData ? ProData.category.name : "Category"}
                          </h5>
                          <h5 className="text-sm sm:text-sm md:text-[15px] lg:text-[95%]">
                            : ₹ {ProData ? ProData.charge.partime : "₹"}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="tags mt-4 mb-2">
                      <h5 className="mb-2 font-bold underline">Skills</h5>
                      {ProData ? (
                        ProData.skills.length > 0 ? (
                          <div className="flex flex-wrap  gap-2">
                            {ProData.skills.slice(0, 5).map((data) => (
                              <button
                                key={data._id} // You should specify a unique key when mapping through elements
                                className="bg-gray-200 text-sm sm:text-base rounded-xl px-2 sm:py-1"
                              >
                                {data.skill}
                              </button>
                            ))}
                          </div>
                        ) : null
                      ) : null}
                    </div>
                  </>
                ) : activeStatus == "reviews" ? (
                  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Work History</h2>

                    <div className="space-y-4">
                      <h3 className="text-md font-semibold ps-5">
                        User Reviews ({Reviews.length})
                      </h3>
                      <div className="bg-gray-600 h-[2px]"></div>
                      {Reviews.length > 0 ? (
                        Reviews.slice(0, visibleReviewCount).map((data) => {
                          const date = new Date(data.reviews.date);
                          const formattedDate = `${date.getDate()}-${
                            date.getMonth() + 1
                          }-${date.getFullYear()}`;
                          return (
                            <div
                              key={data._id}
                              className="flex flex-col space-y-2"
                            >
                              <h4 className="text-sm font-semibold">
                                {data.category}
                              </h4>
                              <div className="sm:flex  items-center space-x-1 text-gray-500">
                                <div className="flex items-start">
                                  <StarRating rating={data.reviews.star} />
                                </div>
                                <span className="text-yellow-500 sm:text-sm pe-2">
                                  ({data.reviews.star})
                                </span>
                                <span className="text-sm">{formattedDate}</span>
                              </div>
                              <div className=" max-h-36  px-5 lg:pb-0 overflow-y-auto">
                                <p className=" w-full text-[85%] ">
                                  {data.reviews.description}
                                </p>
                              </div>
                              <h6 className="text-xs font-medium ps-3">
                                {data.userID.name}
                              </h6>
                              <div className="h-[1px] bg-gray-300"></div>
                            </div>
                          );
                        })
                      ) : (
                        <div>
                          <h5>No reviews</h5>
                        </div>
                      )}
                    </div>
                    {visibleReviewCount < Reviews.length && (
                      <div className="flex justify-end p-4">
                        <a
                          className="text-blue-600 hover:underline"
                          onClick={handleViewMoreClick}
                        >
                          View More
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <Gallery />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default userProfile;
