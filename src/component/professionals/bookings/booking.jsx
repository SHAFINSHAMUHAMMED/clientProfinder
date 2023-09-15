import React, { useEffect, useState } from "react";
import professionalAxiosInterceptor from "../../../Axios/professionalsAxios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
import Booking from "../../../component/user/booking/booking";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";

function booking() {
  const token = useSelector((store) => store.professional.Token);
  const proId = useSelector((store) => store.professional.proId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const proAxios = professionalAxiosInterceptor();
  const location = useLocation();
  const [count, Setcount] = useState(0);
  const [orders, setorders] = useState([]);
  const [pending, setpending] = useState(true);
  const [completed, setcompleted] = useState(false);
  const [cancelled, setcancelled] = useState(false);
  const [activeStatus, setActiveStatus] = useState("pending");

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
      dispatch(proLogout());
      navigate("/professional/");
    } else {
      fetchProDetails();
    }
  }, [navigate, token, count]);

  const fetchProDetails = async () => {
    try {
      const response = await proAxios.get(`/proDetails?proId=${proId}`);
      const data = response.data.data;
      const bookings = response.data.bookings;
      setorders(bookings);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

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
  let filteredBookings=''
  if(orders){
     filteredBookings = orders.filter(
      (item) => item.work_status.status === activeStatus
    );
  }
 
  return (
    <div>
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
            role={"pro"}
          />
        </div>
      </div>
    </div>
  );
}

export default booking;
