import React, { useEffect, useState } from "react";
import professionalAxiosInterceptor from "../../../Axios/professionalsAxios";
import Editprofile from "../editProfile/editProfile";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import Star from "../../user/starRating/StarRating";

function userProfile() {
  const token = useSelector((store) => store.professional.Token);
  const proId = useSelector((store) => store.professional.proId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const proAxios = professionalAxiosInterceptor();
  const [ProData, setProData] = useState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editpopup, seteditpopup] = useState(false);
  const [updateprofile, setupdateprofile] = useState(0);

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
  }, [navigate, dispatch, token, updateprofile]);
  const fetchProDetails = async () => {
    try {
      const response = await proAxios.get(`/proDetails?proId=${proId}`);
      const data = response.data.data;
      setProData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <div className="pt-10 sm:p-8 md:p-5 lg:p-16 xl:p-20 ">
      <div className="bg-slate-200">
        <div className="flex justify-between border-b border-black p-3 sm:p-10">
          <div className="flex gap-3 ">
            {ProData&& ProData.image ? (
               <img
               className="w-10 h-10 sm:w-20 sm:h-20 rounded-full"
               src={ProData.image}
               alt=""
             />
            ):(
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
                    <Star rating={ProData?ProData.rating.stars/ProData.rating.TotalReviews:0} />
                  </div>
                  <h6 className="text-sm sm:text-base">{}</h6>
                </div>
              </div>
            </div>
          </div>
          <img
            className="h-3 sm:h-4 lg:h-5"
            src="/icons/more.png"
            alt=""
            onClick={() => setIsPopupOpen(!isPopupOpen)}
          />
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
            className="   inset-0 bg-gray-500 bg-opacity-50"
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
          <div className="flex gap-2 sm:gap-5 ms-5 mt-5 sm:mt-0">
            <h5 className=" text-xs sm:text-base font-semibold">About You</h5>
            <h5 className=" text-xs sm:text-base font-semibold">
              User Reviews
            </h5>
            <h5 className=" text-xs sm:text-base font-semibold">
              Your Gallery
            </h5>
          </div>
          <div className="innerPart p-3 sm:p-4 md:p-3">
            <div className="bg-slate-300 p-2 sm:p-4 md:p-2 lg:p-8 ">
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
                        ? ProData.location.location.locationQuery.split(" ")[0]
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
                {ProData ?( ProData.skills.length>0) ? (
                  <div className="flex flex-wrap  gap-2">
                  {ProData.skills.map((data) => (
        <button
          key={data._id} // You should specify a unique key when mapping through elements
          className="bg-gray-200 text-sm sm:text-base rounded-xl px-2 sm:py-1"
        >
          {data.skill}
        </button>
      ))}
                  </div>
                ):(null):(null)
                
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default userProfile;
