import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import userAxiosInstance from "../../../Axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { UserLogout, userLocation } from "../../../Redux/userState";
import Chat from '../../chat/chat'
import StarRating from "../../../component/user/starRating/StarRating";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import { Toaster, toast } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

function proProfile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if(location.state===null){
      navigate("/Services")
    }
  }, [])
  if(location.state===null){
    navigate("/Services")
  }else{
  const proData = location.state.proData;
  const userAxios = userAxiosInstance();
  const token = useSelector((store) => store.user.Token);
	const userId = useSelector((store) => store.user.Id);
  const setErrMsg = (err) => toast.error(err, { position: "top-center" });
  const [selectedDate, setSelectedDate] = useState(null);
  const datePickerRef = useRef(null);
  const [bookings, setbookings] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [disableAll, setdisableAll] = useState(true);
  const [disableFullTimeSlots, setDisableFullTimeSlots] = useState(false);
  const [disablePart1, setDisablePart1] = useState(false);
  const [disablePart2, setDisablePart2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setorders] = useState([])
  const [visibleReviewCount, setVisibleReviewCount] = useState(5); //visible count of no of reviews
  const [avgStar, setavgStar] = useState(0)
  const [Show, setShow] = useState(1)
  
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
    }
    review();
  }, []);

  const review = async () => {
    try{
      const data = await userAxios.get(
        `/getBookings?proId=${proData._id}`
      )
      if(data.data.orders){
        const reviewed =   data.data.orders.filter((order)=>
    order.reviews.star
    )
    const totalStars = reviewed.reduce((total, order) => {
      return total + order.reviews.star;
    }, 0);
    setavgStar(totalStars/reviewed.length) 
    setorders(reviewed)
      }else{
        setorders([])
      }
    }catch(error){
      console.log(error);
    }
  }

  const reviews = orders.filter((data)=>
  data.reviews.description.length>0
  )

  const handleViewMoreClick = () => {
    setVisibleReviewCount(reviews.length);
  };

  const fetchData = async () => {
    try {
      if (!selectedDate) {
        setErrMsg("Select a Date");
      } else {
        setLoading(true);
        setdisableAll(false);
        setDisableFullTimeSlots(false);

        // loading for .5 sec
        setTimeout(async () => {
          try {
            const res = await userAxios.get(
              `/getBookings?proId=${proData._id}&selectedDate=${selectedDate}`
            );

            if (res.data.status) {
              const bookingsWithDate = res.data.bookingsWithDate;
              const workTypes = bookingsWithDate.map(
                (booking) => booking.work_type
              );
              setLoading(false);
              setbookings(workTypes);

              if (workTypes.includes("Full Time")) {
                setDisableFullTimeSlots(true);
                setSelectedTime("");
              } else if (
                workTypes.includes("Part Time1") &&
                workTypes.includes("Part Time2")
              ) {
                setDisableFullTimeSlots(true);
                setSelectedTime("");
              } else if (workTypes.includes("Part Time1")) {
                setDisablePart1(true);
                setSelectedTime("");
              } else if (workTypes.includes("Part Time2")) {
                setDisablePart2(true);
                setSelectedTime("");
              } else {
                setDisableFullTimeSlots(false);
              }
            } else {
              setbookings(null);
              setLoading(false);
            }
          } catch (error) {
            console.log(error);
            setbookings(null);
            setDisableFullTimeSlots(true);
          }
        }, 500); // Simulate loading time of 2 seconds
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookNow = () => {
    if (!selectedDate) {
      setErrMsg("Select Booking Date");
    } else if (!selectedTime) {
      setErrMsg("Select a Time Sloat");
    } else {
      navigate("/confirmBooking", {
        state: {
          proData: proData,
          date: selectedDate,
          time: selectedTime,
        },
      });
    }
  };
  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tenDaysFromNow = new Date();
  tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelection = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <>

      <div className=" p- md:p-10 w-full">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className=" ">
          <div className=" w-full mx-auto z-10">
            <div className="flex flex-col">
              <div className="bg-white border border-white shadow-lg  p-4 m-4">
                <div className=" md:flex">
                  <div className=" h-10 w-10 md:h-32 md:w-32 m-auto  sm:mb-0 mb-3">
                    <img
                      src="/ajmal.jpg"
                      alt="profile"
                      className="  object-fill rounded-full"
                    />
                  </div>
                  <div className="flex-auto md:ml-5 md:justify-evenly">
                    <div className="md:flex items-center justify-between sm:mt-2">
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col">
                          <div className="w-full  flex justify-center  md:justify-start md:flex-none text-lg text-gray-800  font-bold leading-none">
                            <h3>{proData.name}</h3>
                          </div>
                          <div className="flex-auto text-gray-500 my-1">
                            <span className="mr-3 ">
                              {proData.category.name}
                            </span>
                            <span className="mr-3 border-r border-gray-200  max-h-0"></span>
                            {console.log(proData)}
                            <span>
                              {proData.location.location.locationQuery}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden  md:flex  gap-2 md:gap-10 pe-5">
                        <div className="  ">
                          <img
                          onClick={()=>navigate(`/chat?receiverId=${proData._id}&senderId=${userId}&userType=${'user'}`)}
                            src="/icons/chat.png"
                            className="w-6 md:w-10"
                            alt=""
                          />
                        </div>
                        <div className="">
                          <img
                            src="/icons/galary.png"
                            className="w-6 md:w-10"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row justify-center md:justify-start items-center">
                      {avgStar ? (
                      <div className="flex items-start">
                        {console.log(avgStar)}
                        <StarRating rating={avgStar} />
                        <span className="text-xs">({orders.length})</span>
                      </div>
                      ):(
                        <div className="text-sm text-gray-400">No Ratings</div>
                      )}
                    </div>
                    <div className=" md:hidden flex justify-center gap-2 md:gap-10 pe-5">
                      <div className="  ">
                        <img
                          src="/icons/chat.png"
                          className="w-6 md:w-10"
                          alt=""
                        />
                      </div>
                      <div className="">
                        <img
                          src="/icons/galary.png"
                          className="w-6 md:w-10"
                          alt=""
                        />
                      </div>
                    </div>
                    {/* <div className="flex justify-center md:justify-end pt-2  text-sm text-gray-500">
                      <button className="flex-no-shrink bg-green-400 hover:bg-green-500 px-5 ml-4 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-green-300 hover:border-green-500 text-white rounded-full transition ease-in duration-300">
                        Connect
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex">
          <div className="w-full md:w-2/6  rounded-lg shadow-lg p-2 md:p-5">
            <div className="flex justify-center mb-2 md:mb-5">
              <div className="w-1/2">
                <h1 className="text-3xl  md:text-4xl xl:text-5xl font-bold">
                  35
                </h1>
                <h5 className=" text-[65%] md:text-[75%] xl:text-[90%] font-medium">
                  Work Completed
                </h5>
              </div>
              <div className="">
                <h1 className="text-3xl  md:text-4xl xl:text-5xl font-bold">
                  325
                </h1>
                <h5 className="text-[65%] md:text-[75%] xl:text-[90%] font-medium">
                  Total Hours
                </h5>
              </div>
            </div>
            <div className="bg-gray-800 h-[1px] mb-3 md:mb-10"></div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              <button className="bg-gray-200 text-blue-600 rounded-lg px-4 py-2">
                Tagssssss
              </button>
              <button className="bg-gray-200 text-blue-600 rounded-lg px-4 py-2">
                Tagssssss
              </button>
              <button className="bg-gray-200 text-blue-600 rounded-lg px-4 py-2">
                Tagssssss
              </button>
              <button className="bg-gray-200 text-blue-600 rounded-lg px-4 py-2">
                Tagssssss
              </button>
            </div>
          </div>

          <div className="w-full md:w-4/6 p-5 shadow-lg">
            <div className="hidden md:flex justify-between p-5">
              <div>
                <h2 className="text-xl font-bold">{proData.category.name}</h2>
              </div>
              {avgStar ? (
              <div className="flex items-start">
                <StarRating rating={avgStar} />
                <span className="text-xs">({orders.length})</span>
              </div>
              ):(
                <div className="text-sm text-gray-400">No Ratings</div>
              )}
            </div>
            <div className="hidden md:block max-h-40 p-5 mb-10">
              <p className=" w-full text-[85%]">
                description about worker is a long established fact that a
                reader will be distracted by the readable content of a page when
                looking at its layout. The point of using Lorem Ipsum is that it
                has a more-or-less normal distribution of letters, as opposed to
                using 'Content here, content here', making it look like readable
                English. Many desktop publishing packages and web page
              </p>
            </div>
            <h4 className="ms-8 mb-2 text-xl font-medium">
              Check Availability
            </h4>
            <div className="p-5 pt-0">
              <div className="bg-blue-600 rounded-xl">
                <div className="  h-fit lg:flex justify-around items-center p-5">
                  <div className="bg-slate-100 text-center p-3 rounded-md">
                    <div className="text-gray-800 text-lg font-semibold">
                      Select Date
                    </div>
                    <div
                      className=" w-10 h-10 mx-auto mb-1 my-3 rounded-md"
                      onClick={handleCalendarIconClick}
                    >
                      <img src="/icons/calendar.png" alt="" />
                    </div>
                    {/* Use ref to access the date picker */}
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      minDate={tomorrow}
                      maxDate={tenDaysFromNow}
                      dateFormat="dd/MM/yyyy"
                      isClearable
                      placeholderText="" // Remove the placeholder text
                      ref={datePickerRef}
                      popperPlacement="bottom-end" // Adjust the position of the date picker
                      customInput={
                        <div
                          className="text-gray-800 text-sm font-medium cursor-pointer"
                          style={{ position: "relative" }}
                        >
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-GB")
                            : "00/00/0000"}
                          <style>
                            {`.react-datepicker__close-icon { right: -25px;}`}
                          </style>
                        </div>
                      }
                    />
                    <div className="flex justify-center mt-">
                      <button
                        onClick={fetchData}
                        className="bg-blue-500 rounded-lg py-1 px-2 mt-2 text-sm text-white font-semibold hover:bg-blue-600"
                        disabled={loading}
                      >
                        {loading ? (
                          <CgSpinner size={20} className="animate-spin" />
                        ) : (
                          "Check"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-100 sm:flex lg:w-4/6 mt-5 lg:mt-0 rounded-md">
                    <div className="sm:w-1/2 p-4">
                      <h3 className="text-md flex justify-center font-semibold">
                        <span className="border-b border-gray-500">
                          Part Time
                        </span>
                      </h3>
                      <div className="flex items-center justify-center sm:flex mt-2">
                        <input
                          type="radio"
                          name="time"
                          id="time1"
                          className="mr-2"
                          value="Part Time1"
                          checked={selectedTime === "Part Time1"}
                          onChange={handleTimeSelection}
                          disabled={
                            disableFullTimeSlots || disablePart1 || disableAll
                          }
                        />
                        <label
                          htmlFor="time1"
                          className="sm:text-[80%]"
                          style={{
                            textDecoration:
                              disableFullTimeSlots || disablePart1
                                ? "line-through red"
                                : "none",
                          }}
                        >
                          8 am to 12 pm
                        </label>
                      </div>

                      <div className="flex items-center justify-center sm:flex mt-2">
                        <input
                          type="radio"
                          name="time"
                          id="time2"
                          className="mr-2"
                          value="Part Time2"
                          checked={selectedTime === "Part Time2"}
                          onChange={handleTimeSelection}
                          disabled={
                            disableFullTimeSlots || disablePart2 || disableAll
                          }
                        />
                        <label
                          htmlFor="time2"
                          className="sm:text-[80%]"
                          style={{
                            textDecoration:
                              disableFullTimeSlots || disablePart2
                                ? "line-through red"
                                : "none",
                          }}
                        >
                          1 pm to 5 pm
                        </label>
                      </div>
                    </div>
                    <div className="bg-black w-[1.5px] mt-5 mb-5"></div>
                    <div className="sm:w-1/2 p-4">
                      <h3 className="text-md flex justify-center font-semibold ">
                        <span className="border-b border-gray-500">
                          Full Time
                        </span>
                      </h3>
                      <div className="flex items-center justify-center sm:flex mt-2">
                        <input
                          type="radio"
                          name="time"
                          id="time3"
                          className="mr-2"
                          value="Full Time"
                          checked={selectedTime === "Full Time"}
                          onChange={handleTimeSelection}
                          disabled={
                            disableFullTimeSlots ||
                            disablePart1 ||
                            disablePart2 ||
                            disableAll
                          }
                        />
                        <label
                          htmlFor="time3"
                          className="sm:text-[80%]"
                          style={{
                            textDecoration:
                              disableFullTimeSlots ||
                              disablePart1 ||
                              disablePart2
                                ? "line-through red"
                                : "none",
                          }}
                        >
                          8 am to 5 pm
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center w-1/2 m-auto sm:ms-auto sm:me-20">
                  <button
                    onClick={bookNow}
                    className="mb-4 bg-white rounded-lg py-1 px-2 text-sm text-gray-700 font-bold hover:bg-gray-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            {/* ////////////////// */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Work History</h2>
              
              <div className="space-y-4">
                <h3 className="text-md font-semibold ps-5">User Reviews ({reviews.length})</h3>
                <div className="bg-gray-600 h-[2px]"></div>
                {reviews.length>0 ? (
                reviews.slice(0, visibleReviewCount).map((data)=>{
                  const date = new Date(data.reviews.date);
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                  console.log(data);
                  return (  
                <div className="flex flex-col space-y-2">
                  <h4 className="text-sm font-semibold">
                    {data.category}
                  </h4>
                  <div className="sm:flex  items-center space-x-1 text-gray-500">
                    <div className="flex items-start">
                      {console.log(data,'wertyuisdfghjkzxcvbnm')}
                      <StarRating rating={data.reviews.star} />
                    </div>
                    <span className="text-yellow-500 sm:text-sm pe-2">({data.reviews.star})</span>
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                  <div className=" max-h-36  px-5 lg:pb-0 overflow-y-auto">
                    <p className=" w-full text-[85%] ">
                      {data.reviews.description}
                    </p>
                  </div>
                  <h6 className="text-xs font-medium ps-3">{data.userID.name}</h6>
                <div className="h-[1px] bg-gray-300"></div>

                </div>
                
                )
              })
              ):(
                <div>
                  <h5>No reviews</h5>
                </div>
              )}
              </div>
              {visibleReviewCount < reviews.length && (
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
          </div>
        </div>
      </div>
      
    </>
  );
}
}

export default proProfile;
