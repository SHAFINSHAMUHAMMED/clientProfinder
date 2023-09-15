import React, { useEffect, useState,lazy, Suspense } from "react";
import professionalAxiosInterceptor from "../../../Axios/professionalsAxios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
const Graph = lazy(() => import("../graph/graph"));
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import "./proHome.css";
import Loading from "../../loading/loading"

function proHome() {
  const token = useSelector((store) => store.professional.Token);
  const proId = useSelector((store) => store.professional.proId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const professionalsAxios = professionalAxiosInterceptor();
  const [isLoading, setIsLoading] = useState(true);
  const [ProData, setProData] = useState('');
  const [Orders, setOrders] = useState([]);
  const [UpcomingWorks, setUpcomingWorks] = useState([]);
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
  }, [navigate, dispatch, token]);
  const fetchProDetails = async () => {
    try {
      const response = await professionalsAxios.get(
        `/proDetails?proId=${proId}`
      );
      const data = response.data.data;
      const orders = response.data.bookings;
      const sortedOrders = orders.slice().sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setProData(data);
      setOrders(sortedOrders);
      const today = new Date().toISOString().split("T")[0];
      const upcoming = sortedOrders.filter((order) => {
        const orderDate = order.date.split("T")[0]; // Extract only the date part
        return orderDate > today && order.work_status.status !== "cancelled";
      });
      const firstTwoUpcomingWorks = upcoming.slice(0, 2);

      setUpcomingWorks(firstTwoUpcomingWorks);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching details:", error);
      setIsLoading(false)
    }
  };
  const completed = Orders.filter((data) => {
    return data.work_status.status === "completed";
  }).length;
  const pendigs = Orders.filter((data)=>{
    return data.work_status.status === "pending"
  }).length

  const seeAll = () => {
    if (token) {
      const queryString = new URLSearchParams({
        proData: JSON.stringify(ProData),
        orders: JSON.stringify(Orders),
      }).toString();

      navigate(`/professional/jobs`);
    }
  };
  return (
    <>
    <Suspense fallback={<Loading/>}>
     
          <div className="stats-holder flex-col gap-1 flex mt-2 basis-1 sm:flex-row">
      <div className="stats basis-full sm:basis-3/4 ">
        <div className="cards flex flex-row gap-2 h-24 sm:h-[7rem] sm:gap-3 sm:flex-row md:gap-2 justify-center">
          <div className="card bg-gray-200 sm:w-3/12 flex justify-center items-center rounded-lg">
            <div>
              <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
                Account Balance
              </h4>
              <div className="sm:flex items-center justify-between">
                <h4 className="text-lg sm:text-2xl font-bold font-mono text-center">
                  ₹{ProData?.wallet}
                </h4>
                <img
                  className="w-5 sm:w-10 m-auto"
                  src="/icons/wallet.png"
                  alt=""
                />
              </div>
            </div>
          </div>

          <div className="card bg-gray-200  sm:w-3/12 flex justify-center items-center rounded-lg">
            <div>
              <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
                {" "}
                Work Completed
              </h4>
              <div className="sm:flex items-center justify-center">
                <h4 className="text-xl sm:text-4xl font-bold font-mono text-center">
                  {completed}
                </h4>
                <img
                  className="w-5 m-auto sm:m-0 sm:w-10 sm:ms-2"
                  src="/icons/checklist.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="card bg-gray-200  sm:w-3/12 flex justify-center items-center rounded-lg">
            <div>
              <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
                Total Job Pending
              </h4>
              <div className="sm:flex items-center justify-center">
                <h4 className="text-xl sm:text-4xl font-bold font-mono text-center">
                  {pendigs}
                </h4>
                <img
                  className="w-5 m-auto sm:m-0 sm:w-10 sm:ms-2"
                  src="/icons/requests.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="graph bg-gray-200  overflow-y-scroll  mt-5 me-0 rounded-lg">
          {/* graph */}
          <Graph orders={Orders} />
        </div>
      </div>
      <div className="rightbar  sm:h-auto sm:basis-1/4 bg-gray-200  p-1 rounded-lg">
        <div className="flex items-center mb-5 bg-gray-200  p-3 w-3/4 sm:w-full m-auto">
          <img
            className="h-10 sm:h-6 lg:h-10 lg:me-2"
            src="/icons/drag.png"
            alt=""
          />
          <div className="" style={{ lineHeight: "1" }}>
            <h2 className="sm:text-[78%] lg:text-base">Work Monitor</h2>
            <h4 className="sm:text-[69%] lg:text-sm">Upcoming</h4>
          </div>
        </div>
        <div className="bg-blue-200 lg:p-2  lg:flex  w-3/4 sm:w-full m-auto justify-around rounded-lg">
          <div>
            <h4 className="font-semibold text-center">Today</h4>
            <div className="w-12 h-12 relative m-auto">
              <div className="w-12 h-12 left-0 top-0 absolute bg-blue-300 rounded-full" />
              <div className="w-8 h-8 left-2 top-2 absolute flex items-center justify-center bg-blue-600 rounded-full">
                <div className="text-white text-base font-black">1</div>
              </div>
            </div>
          </div>
          <div className=" mt-2 lg:mt-5">
            <h1 className="text-base font-semibold text-center lg:text-left">
              keep chill'in
            </h1>
            <h4 className=" text-[90%] sm:text-[70%] lg:text-[75%] xl:text-base text-center">
              You have {pendigs} works to do
            </h4>
            <h5  onClick={seeAll} className="text-center sm:text-end text-blue-800 text-sm me-2 lg:me-0 pb-3 lg:pb-0 lg:text-base">
              Get details
            </h5>
          </div>
        </div>
        <div className="mt-3  w-3/4 sm:w-full m-auto">
          <h4 className="mb-2 font-medium">Upcoming Works</h4>
          {UpcomingWorks?.map((item) => {
            const [year, month, day] = item.date.split("T")[0].split("-");
            const formattedDate = `${day} ${month} ${year}`;

            return (
              <div
                key={item._id}
                className="flex items-center justify-center bg-slate-300 pt-3 pb-3 mb-1 rounded-lg"
              >
                <div className="w-3/4">
                  <h4 className="font-semibold">{formattedDate}</h4>
                  <h4 className="text-sm font-medium">
                    {item?.address?.location?.split(" ")[0]}
                  </h4>
                </div>
                <img
                  onClick={seeAll}
                  className="h-5"
                  src="/icons/view.png"
                  alt=""
                />
              </div>
            );
          })}

          <h4 className="text-end me-2" onClick={seeAll}>
            See All
          </h4>
        </div>
      </div>
    </div>
      </Suspense>
      </>
  );
}

export default proHome;
