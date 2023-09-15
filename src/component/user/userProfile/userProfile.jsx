import React, { useState, useEffect } from "react";
import Editprofile from "../editProfile/editProfile";
import userAxiosInstance from "../../../Axios/userAxios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserLogout } from "../../../Redux/userState";
import Booking from "../booking/booking";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import Swal from "sweetalert2";

function userProfile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editpopup, seteditpopup] = useState(false);
  const [userData, setuserData] = useState();
  const [pending, setpending] = useState(true);
  const [completed, setcompleted] = useState(false);
  const [cancelled, setcancelled] = useState(false);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [count, Setcount] = useState(0);
  const [updateprofile, setupdateprofile] = useState(0);
  const [message, setmessage] = useState("");
  const [userBookings, setuserBookings] = useState([]);
  const token = useSelector((state) => state.user.Token);
  const userId = useSelector((state) => state.user.Id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAxios = userAxiosInstance();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  if (count > 0) {
    Toast.fire({
      icon: "success",
      title: "work cancelled",
    }).then(() => {
      Setcount(0);
    });
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
  const handleUserDataUpdate = (updatedData) => {
    setuserData(updatedData);
  };
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const expired = isTokenExpired();
    if (expired) {
      dispatch(UserLogout());
      navigate("/login");
    } else {
      const fetchUserDetails = async () => {
        try {
          const response = await userAxios.get(`/userDetails?userId=${userId}`);
          const data = response.data.data;
          setuserData(data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();

      const fetchBookings = async () => {
        try {
          const res = await userAxios.get(`/getBookings?userId=${userId}`);
          const data = res.data.orders;
          setuserBookings(data);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      };
      fetchBookings();
    }
  }, [count, updateprofile]);

  const handleBooking = (booking) => {
    if (booking === "pending") {
      setpending(true);
      setcompleted(false);
      setcancelled(false);
      setActiveStatus("pending");
    } else if (booking === "completed") {
      setpending(false);
      setcompleted(true);
      setcancelled(false);
      setActiveStatus("completed");
    } else {
      setpending(false);
      setcompleted(false);
      setcancelled(true);
      setActiveStatus("cancelled");
    }
  };

  const filteredBookings = userBookings.filter(
    (item) => item.work_status.status === activeStatus
  );

  return (
    <div className="bg-gray-200 p-2 sm:p-10 lg:p-10">
      <div className="flex flex-wrap lg:p-24 lg:pb-5 lg:pt-5">
        <div className="w-full py-8 px-4 ">
          <div className=" ">
            <div className="bg-white relative shadow p-2 rounded-lg text-gray-800 hover:shadow-lg">
              <div className="h-24 sm:h-48 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 object-cover"></div>
              <div className="flex justify-center">
                {userData && userData?.image ? (
                  <img
                    src={userData?.image?userData?.image:'/icons/man.png'}
                    className="rounded-full -mt-10 sm:-mt-20 border-4 object-center object-cover border-white mr-2 h-20 w-20 sm:h-36 sm:w-36"
                    alt="User Profile"
                  />
                ) : (
                  <img
                    src="/icons/man.png"
                    className="rounded-full -mt-10 sm:-mt-20 border-4 object-center object-cover border-white mr-2 h-20 w-20 sm:h-36 sm:w-36"
                    alt="Default Profile"
                  />
                )}
              </div>

              <div className="text-end flex justify-end pe-14 relative">
                <img
                  src="/icons/more.png"
                  alt=""
                  className="w-4 h-4 relative cursor-pointer"
                  onClick={() => setIsPopupOpen(!isPopupOpen)} // Toggle the popup
                />
                {/* //////////popup */}
                {isPopupOpen && (
                  <div
                    className="inset-0 bg-gray-500 bg-opacity-50"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    <div className="absolute top-4 right-8 mt-1 w-36 bg-gray-100 border border-gray-300 rounded-lg">
                      <div className="bg-white p-2 rounded-lg">
                        <button
                          onClick={() => seteditpopup(true)}
                          className="block w-full py-2 text-blue-600 hover:underline"
                        >
                          Edit Profile
                        </button>
                        {/* <button className="block w-full py-2 text-blue-600 hover:underline">
                          Change Password
                        </button> */}
                      </div>
                    </div>
                  </div>
                )}
                {editpopup && (
                  <Editprofile
                    userData={userData}
                    updateUserData={handleUserDataUpdate}
                    closePopup={seteditpopup}
                    update={setupdateprofile}
                    count={updateprofile}
                  />
                )}
              </div>

              <div className="py- px-">
                <div className="font-bold text-base sm:text-3xl font-title text-center mb-2">
                  {userData ? userData?.name : "Name"}
                </div>
                <div className="flex justify-center gap-5">
                  <div className="">
                    {/* <img src="/icons/location.png" alt="" className="w-4 h-4 sm:h-5 sm:w-5 mt-1" /> */}
                    <img
                      src="/icons/email.png"
                      alt=""
                      className="w-4 h-4 sm:h-5 sm:w-5 mt-2"
                    />
                    <img
                      src="/icons/smartphone.png"
                      alt=""
                      className="w-4 h-4 sm:h-5 sm:w-5 mt-2"
                    />
                  </div>
                  <div>
                    {/* <h5 className="text-sm sm:text-lg">Location</h5> */}
                    <h5 className="text-sm sm:text-lg">
                      {userData ? userData.email : "Email"}
                    </h5>
                    <h5 className="text-sm sm:text-lg">
                      {userData ? userData.phone : "Phone"}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="  lg:p-24 ">
        <div className="bg-gray-300 p-2 sm:p-5 rounded-lg max-h-fit m-auto">
          <h3 className="font-semibold sm:font-bold text-2xl mt-5 mb-5 text-center">
            Bookings
          </h3>
          <div className="w-full  m-auto mb-14">
            <div className="flex gap-3 sm:gap-10 bg-gray-400 rounded-xl p-2 hover:cursor-pointer ">
              <div
                onClick={() => handleBooking("pending")}
                className={`text-xs sm:text-lg ms-5 h-5 sm:h-8 text-center w-16 sm:w-20 rounded-xl ${
                  pending ? "bg-white" : "bg-gray-400"
                }`}
              >
                {" "}
                pending
              </div>
              <div
                onClick={() => handleBooking("completed")}
                className={`text-xs sm:text-lg h-5 sm:h-8 text-center w-16 sm:w-24 rounded-xl ${
                  completed ? "bg-white" : "bg-gray-400"
                }`}
              >
                completed
              </div>
              <div
                onClick={() => handleBooking("cancelled")}
                className={`text-xs sm:text-lg h-5 sm:h-8 text-center w-16 sm:w-20 rounded-xl ${
                  cancelled ? "bg-white" : "bg-gray-400"
                }`}
              >
                cancelled
              </div>
            </div>
          </div>

          <Booking
            userBookings={filteredBookings}
            update={Setcount}
            count={count}
            role={"user"}
            active={activeStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default userProfile;
