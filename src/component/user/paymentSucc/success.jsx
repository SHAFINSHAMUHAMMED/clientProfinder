import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Success({ orderData }) {
  const navigate = useNavigate();
  const closeHandle = () => {
    navigate("/Services");
  };
  const orderDate = new Date(orderData.date);
  const day = String(orderDate.getDate()).padStart(2, "0");
  const month = String(orderDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = String(orderDate.getFullYear()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;

  return (
    <div className="w-[250px] md:w-[400px] lg:w-[500px]">
      <div style={{ backgroundColor: "#e1f4e5" }} className="rounded-md">
        <div
          className="text-end text-3xl me-5 text-slate-600 pt-2 hover:cursor-pointer"
          onClick={closeHandle}
        >
          x
        </div>

        <div className="relative">
          <img
            className="h-[5rem] sm:h-[10rem] m-auto"
            src="/icons/succes.gif"
            alt=""
          />
          <h2 className=" absolute top-3/4 mt-5 sm:mt-0 inset-0 flex items-center justify-center pointer-events-none font-mono font-bold text-sm md:text-lg">
            Booking Confirmed
          </h2>
        </div>
        <div
          style={{ backgroundColor: "#ECFDFF" }}
          className=" w-5/6 sm:w-3/4 m-auto mt-5 mb-5 sm:mt-0 p-2 sm:p-4 rounded-sm"
        >
          <h2 className="text-center">Booking info</h2>
          <div className="flex justify-between">
            <h3 className="text-sm sm:text-base">Order Id:</h3>
            <h3 className=" text-sm sm:text-base">{orderData.orderId}</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-sm sm:text-base">Booked To:</h3>
            <h3 className=" text-sm sm:text-base">{formattedDate}</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-sm sm:text-base">Total:</h3>
            <h3 className=" text-sm sm:text-base">₹{orderData.payment}</h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-sm sm:text-base">Payment Type:</h3>
            <h3 className=" text-sm sm:text-base">{orderData.work_type}t</h3>
          </div>
        </div>
        <div className="flex items-center justify-center ">
          <button
            style={{ backgroundColor: "#1DEE8A" }}
            className="h-8 p-2 rounded-lg text-center flex items-center justify-center mb-5"
          >
            <Link to={"/profile"} className="inline-block align-middle text-xs">
              View Bookings
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
