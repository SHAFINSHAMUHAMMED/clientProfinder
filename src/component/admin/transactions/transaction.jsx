import React, { useState, useEffect } from "react";
import adminAxiosInterceptors from "../../../Axios/adminAxios";
import Pagination from "../../pagination/Pagination";

function transaction() {
  const adminAxios = adminAxiosInterceptors();
  const [activeStatus, setActiveStatus] = useState("in");
  const [transaction, settransaction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

  useEffect(() => {
    adminAxios
      .get("/getTransactions")
      .then((res) => {
        settransaction(res.data.transactions);
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 404) {
          navigate("/admin/*");
        } else if (error?.response?.status == 500) {
          navigate("/admin/serverError");
        } else {
          navigate("/admin/serverError");
        }
      });
  }, []);
  const handleActive = (active) => {
    setActiveStatus(active);
  };

  const paymentIn = transaction?.filter((data) => {
    return data.To == "admin";
  });
  const paymentOut = transaction?.filter((data) => {
    return data.To !== "admin" && data.withdrawStatus !== "requested";
  });
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const indexOfLastTrans = currentPage * dataPerPage;
  const indexOfFirstTrans = indexOfLastTrans - dataPerPage;
  const InPayment = paymentIn?.slice(indexOfFirstTrans, indexOfLastTrans);
  const OutPayment = paymentOut?.slice(indexOfFirstTrans, indexOfLastTrans);
  return (
    <div className="sm:w-4/5 mt-10 sm:m-auto py-2 sm:px-10 sm:mt-24 bg-gray-500 rounded-md">
      <div className="flex gap-0 bg-slate-100 justify-center mb-8 w-4/5 sm:w-1/2 m-auto rounded-lg ">
        <div
          onClick={() => handleActive("in")}
          className={
            activeStatus === "in"
              ? "bg-slate-100 w-1/2 h-8 flex justify-center items-center rounded-lg"
              : "bg-slate-600 w-1/2 h-8 flex justify-center items-center rounded-lg"
          }
        >
          <h6>Credited</h6>
        </div>

        <div
          onClick={() => handleActive("out")}
          className={
            activeStatus === "out"
              ? "bg-slate-100 w-1/2 h-8 flex justify-center items-center rounded-lg"
              : "bg-slate-600 w-1/2 h-8 flex justify-center items-center rounded-lg"
          }
        >
          <h6>Debited</h6>
        </div>
      </div>
      {activeStatus == "in" ? (
        InPayment?.length > 0 ? (
          InPayment?.map((data) => (
            <div
              key={data?._id}
              className="grid grid-cols-8 bg-gray-200 p-1 rounded-lg mb-2"
            >
              <div className="col-span-1 flex justify-center items-center ">
                <img
                  className="w-7 sm:w-9"
                  src={"/icons/Received.png"}
                  alt=""
                />
              </div>
              <div className="text-xs sm:text-base flex justify-around items-center col-span-7">
                <div>
                  <h4>Received</h4>
                  <h6>{formatDate(data?.date)}</h6>
                </div>
                <div className="">
                  <div>
                    <h6 className="text-start f text-[90%]">
                      From:{" "}
                      <span className="text-start font-semibold text-[90%]">
                        {data?.userID?.name}
                      </span>
                    </h6>
                    <div>Role: {data?.To}</div>
                    <div className="flex items-center">
                      <img
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        src="/icons/location.png"
                        alt=""
                      />
                      <h6 className="text-[80%] text-center">
                        {data?.orderId?.address?.location?.split(" ")[0]}
                      </h6>
                    </div>
                  </div>
                </div>
                <div>
                  Amount
                  <h2 className="text-center">{data?.orderId?.payment}</h2>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-center">No Data</h2>
        )
      ) : OutPayment?.length > 0 ? (
        OutPayment?.map((data) => (
          <div
            key={data?._id}
            className="grid grid-cols-8 bg-gray-200 p-1 rounded-lg mb-2"
          >
            <div className="col-span-1 flex justify-center items-center ">
              <img className="w-7 sm:w-9" src={"/icons/Send.png"} alt="" />
            </div>
            <div className="text-xs sm:text-base flex justify-around items-center col-span-7">
              <div>
                <h4>Withdrawn</h4>
                <h6>{formatDate(data?.date)}</h6>
              </div>
              <div className="">
                <h6 className="text-start f text-[90%]">
                  To:{" "}
                  <span className="text-center font-semibold text-[90%]">
                    {data?.To == "user" ? data?.userID.name : data?.proId.name}
                  </span>
                </h6>
                <div>Role: {data.To}</div>
                <h6 className="text-start">{data?.Type}</h6>
              </div>
              <div>
                Amount
                <h2 className="text-center">
                  {data?.orderId ? data.orderId.payment : data?.accDetails.amt}
                </h2>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h3>No data</h3>
      )}
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={
            activeStatus === "in"
              ? Math.ceil(paymentIn?.length / dataPerPage)
              : Math.ceil(paymentOut?.length / dataPerPage)
          }
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default transaction;
