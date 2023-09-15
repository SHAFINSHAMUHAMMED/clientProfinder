import React, { useState, useEffect } from "react";
import userAxiosInstance from "../../../Axios/userAxios";
import proAxiosInstance from "../../../Axios/professionalsAxios";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Otp from "../../professionals/otp/confirmationOtp";
import Review from "../review/review";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";

function booking({ userBookings, update, count, role, active }) {

  const navigate = useNavigate();
  const token = useSelector((state) => state.user.Token);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [Confirmation, setConfirmation] = useState(false);
  const [ShowOtp, setShowOtp] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [proId, setproId] = useState(null);
  const [Role, setRole] = useState("");
  const [payment, setpayment] = useState(null);
  const [AddReview, setAddReview] = useState(false);
  // const [count, Setcount] = useState(0)
  const userAxios = userAxiosInstance();
  const proAxios = proAxiosInstance();
  function formatDate(dateString) {
    const options = { weekday: "short", day: "numeric", month: "long" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  }
  //cancell work
  function handleCancelClick(bookingid, role, payment) {
    setBookingId(bookingid);
    setRole(role);
    setpayment(payment);
    setShowConfirmation(true);
  }

  function handleCancelConfirm() {
    if (bookingId) {
      cancellJob(bookingId, Role, payment);
      setShowConfirmation(false);
      setBookingId(null);
    }
  }

  function handleCancelCancel() {
    setShowConfirmation(false);
    setBookingId(null);
  }

  function cancellJob(id, Role, payment) {
    let axios = "";
    if (Role == "user") {
      axios = userAxios;
    } else {
      axios = proAxios;
    }
    axios
      .post("/cancellJob", { id, Role, payment })
      .then((res) => {
        if (res.data.status) {
          update(count + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 404) {
          navigate("/*");
        } else if (error?.response?.status == 500) {
          navigate("/serverError");
        } else {
          navigate("/serverError");
        }
      });
  }
  //Accept work
  function handleAccept(bookingid) {
    setBookingId(bookingid);
    setConfirmation(true);
  }

  function handleAcceptConfirm(type) {
    update(count + 1);
    if (bookingId) {
      if (type === "compleated") {
        setShowOtp(true);
        //otpppp
      } else {
        acceptJob(bookingId);
        setConfirmation(false);
        setBookingId(null);
      }
    }
  }

  function handleCancel() {
    setConfirmation(false);
    setBookingId(null);
  }

  function acceptJob(id) {
    proAxios
      .post("/acceptJob", { id })
      .then((res) => {
        if (res.data.status) {
          update(count + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 404) {
          navigate("/*");
        } else if (error?.response?.status == 500) {
          navigate("/serverError");
        } else {
          navigate("/serverError");
        }
      });
  }
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  function handleAddReview(booking_id, pro_id) {
    setAddReview(true);
    setBookingId(booking_id);
    setproId(pro_id);
  }
  return (
    <div className="w-full mx-auto mb-5">
      {userBookings?.length > 0 ? (
        userBookings?.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-2 sm:flex justify-around items-center bg-white border border-gray-600 rounded-lg gap-1 p-1 sm:p-4 mb-1"
          >
            <div className="text-center">
              <h4 className="text-md sm:text-lg font-semibold">
                {formatDate(booking?.date).split(",")[0]} {/* Short weekday */}
              </h4>
              <h1 className="text-2xl sm:text-4xl font-extrabold">
                {new Date(booking?.date).getDate()} {/* Day */}
              </h1>
              <h4 className="text-md sm:text-lg font-semibold">
                {new Date(booking?.date).toLocaleDateString(undefined, {
                  month: "long",
                })}
              </h4>
            </div>
            <div className=" hidden sm:block w-1 h-16 bg-gray-500"></div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <img
                  src="/icons/clock.png"
                  alt=""
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
                />
                <div>
                  <h5 className="text-xs sm:text-md md:text-lg font-bold sm:font-semibold">
                    {booking?.work_type === "Part Time1" ||
                    booking?.work_type === "Part Time2"
                      ? booking?.work_type.slice(0, -1)
                      : booking?.work_type}
                  </h5>
                  <h6 className="text-xs sm:text-md md:text-lg font-semibold">
                    {booking?.work_type === "Part Time1"
                      ? "8.00 AM - 12.00 PM"
                      : booking?.work_type === "Part Time2"
                      ? "1.00 PM - 5.00 PM"
                      : "8.00 AM - 5.00 PM"}
                  </h6>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src="/icons/location.png"
                  alt=""
                  className="w-3 h-3 sm:w-4 sm:h-4 mr-2"
                />
                <div>
                  <h5 className="text-[8px] sm:text-[12px] md:text-[15px] font-semibold">
                    {booking?.address?.location?.split(" ")[0]}
                  </h5>
                  <h6 className="text-[6px] sm:text-[10px] font-semibold">
                    {booking?.address?.location?.split(" ").slice(2).join(" ")}
                  </h6>
                </div>
              </div>
            </div>
            {role === "user" ? (
              <div className="flex flex-col items-center">
                <div className="sm:flex items-center mb-2">
                  <img
                    src="/ajmal.jpg"
                    alt=""
                    className="hidden sm:block w-5 h-5 sm:w-8 sm:h-8 rounded-full mr-2"
                  />
                  <h4 className="text-xs sm:text-md md:text-lg font-semibold">
                    {booking?.proId?.name}
                  </h4>
                </div>
                <div>
                  <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                    {booking?.category}
                  </h5>
                  {/* <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                Professional ID: 123456
              </h5> */}
                  {active === "pending" ? (
                    <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                      To pay:
                      {booking?.work_type === "Part Time1" ||
                      booking?.work_type === "Part Time2"
                        ? booking?.proId?.charge?.partime - booking.payment
                        : booking?.proId?.charge?.fulltime - booking.payment}
                    </h5>
                  ) : active === "completed" ? (
                    <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                      compleated
                    </h5>
                  ) : (
                    <h5 className="text-xs sm:text-md md:text-lg font-semibold">
                      cancelled
                    </h5>
                  ) // or you can use an empty fragment: <></>
                  }
                </div>
              </div>
            ) : (
              <div className="  place-items-center flex  items-center">
                <div>
                  <h6>Paid: {booking?.payment}</h6>
                  <h6>Name:{booking?.address?.name}</h6>
                  <div className="flex items-center text-center">
                    <h6>Address</h6>
                    <img
                      className="h-3 w-2 ms-2 mt-1"
                      src="/icons/down-arrow.png"
                      alt=""
                    />
                  </div>
                </div>
                <img className="w-6" src="/icons/chat.png" alt="" />
              </div>
            )}
            {role === "user" ? (
              <div className="flex gap-5 sm:block">
                <div
                  className={`bg-gray-400 text-white py-1 px-1 sm:py-1 text-center  sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] sm:mb-2 w-8 sm:w-16 lg:w-24`}
                >
                  {booking?.work_status
                    ? booking?.work_status?.status === "usercancelled" ||
                      booking?.work_status?.status === "procancelled"
                      ? "Cancelled"
                      : booking?.work_status?.status
                    : booking?.work_status?.status}
                </div>
                {booking?.work_status &&
                booking?.work_status?.status === "completed" ? (
                  <div className="bg-yellow-500 text-white py-1 px-1 sm:py-1 text-center sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px]  sm:mb-2 w-8 sm:w-16 lg:w-24">
                    <button
                      onClick={() =>
                        handleAddReview(booking._id, booking.proId._id)
                      }
                      className="cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {AddReview && (
                  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75 bg-gray-900 z-50">
                    <Review Id={bookingId} Proid={proId} popup={setAddReview} />
                  </div>
                )}
                {booking?.work_status?.status === "pending" && (
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleCancelClick(
                          booking._id,
                          (role = "user"),
                          booking.payment
                        )
                      }
                      className={`bg-orange-600 text-white py-1 px-1 text-center sm:py-1 sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] w-8 sm:w-16 lg:w-24`}
                    >
                      Cancel
                    </button>
                    {showConfirmation && bookingId === booking?._id && (
                      <div className=" bg-white border sm:w-1/3 h-auto border-gray-300 p-3 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="font-medium">Are you sure ?</p>
                        <p className="text-[10px] sm:text-base text-blue-600">
                          ₹100 will charge for cancellation
                        </p>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleCancelConfirm}
                            className="bg-red-600 text-white px-2 py-1 rounded-md mr-2"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              ///pro
              <div>
                {booking?.work_status?.status === "cancelled" ||
                booking?.work_status?.status === "completed" ? (
                  <div className="">
                    <div
                      className={`bg-gray-400 text-white py-1 px-1 sm:py-1 text-center  sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] mb-1 sm:mb-2 w-8 sm:w-16 lg:w-24`}
                    >
                      {booking?.work_status?.status ? (
                        booking?.work_status?.status === "cancelled" ? (
                          <h6>Cancelled</h6>
                        ) : (
                          booking?.work_status?.status
                        )
                      ) : (
                        booking?.work_status?.status
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="sm:flex flex-col">
                      <button
                        onClick={() => handleAccept(booking._id)}
                        className={`bg-green-500 text-white py-1 mb-2 px-1 text-center sm:py-1 sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] w-8 sm:w-16 lg:w-24`}
                      >
                        {booking?.pro_confirmed ? "Compleate" : "Accept"}
                      </button>
                      <button
                        onClick={() =>
                          handleCancelClick(
                            booking._id,
                            (role = "pro"),
                            booking?.payment
                          )
                        }
                        className={`bg-orange-500 text-white py-1 px-1 text-center sm:py-1 sm:px-3 rounded-md sm:rounded-lg text-[5px] sm:text-[10px] lg:text-[15px] w-8 sm:w-16 lg:w-24`}
                      >
                        {booking.pro_confirmed ? "Cancel" : "Reject"}
                      </button>
                    </div>
                    {/* //popup */}
                    {Confirmation && bookingId === booking._id && (
                      <div className=" bg-white border sm:w-1/3 h-auto border-gray-300 p-3 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="font-medium">Accept ?</p>
                        <div className="flex justify-end mt-2">
                          {booking.pro_confirmed ? (
                            <button
                              onClick={() => handleAcceptConfirm("compleated")}
                              className="bg-red-600 text-white px-2 py-1 rounded-md mr-2"
                            >
                              Send Otp
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAcceptConfirm("accept")}
                              className="bg-red-600 text-white px-2 py-1 rounded-md mr-2"
                            >
                              Confirm
                            </button>
                          )}

                          <button
                            onClick={handleCancelCancel}
                            className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {/* ///cancell after Accepting job */}
                    {showConfirmation && bookingId === booking._id && (
                      <div className=" bg-white border sm:w-1/3 h-auto border-gray-300 p-3 rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <p className="font-medium">Are you sure ?</p>
                        <p className="text-[10px] sm:text-base text-blue-600">
                          It will Update in Your Profile
                        </p>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleCancelConfirm}
                            className="bg-red-600 text-white px-2 py-1 rounded-md mr-2"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {ShowOtp && (
                  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75 bg-gray-900 z-50">
                    <Otp
                      phone={booking?.userID?.phone}
                      bookingId={bookingId}
                      update={update}
                      count={count}
                      otps={setShowOtp}
                      Toast={Toast}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center">Not Found</div>
      )}
      {/* Show Otp popup */}
    </div>
  );
}

export default booking;
