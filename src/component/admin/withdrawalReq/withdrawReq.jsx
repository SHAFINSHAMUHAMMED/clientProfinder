import React, { useState, useEffect } from "react";
import Pagination from "../../pagination/Pagination";
import adminAxiosInterceptor from "../../../Axios/adminAxios";
import { useDispatch, useSelector } from "react-redux";

function withdrawReq() {
  const token = useSelector((store) => store.admin.Token);
  const adminAxios = adminAxiosInterceptor();

  const [currentPage, setCurrentPage] = useState(1);
  const [prosPerPage] = useState(3);
  const [Requests, setRequests] = useState([]);
  const [Update,setUpdate] = useState(null)
  useEffect(() => {
    adminAxios
      .get("/getRequests")
      .then((res) => {
        if (res?.data?.status) {
          setRequests(res.data?.data);
        }
      })
      .catch((error) => {
        console.log(error);
        if(error?.response?.status==404){
          navigate("/admin/*")
        }else if(error?.response?.status==500){
          navigate("/admin/serverError")
        }else{
          navigate("/admin/serverError")
        }
      });
  }, [Update]);
  const handlePay = async (id, role, amt) => {
    try {
      const updat = await adminAxios.patch("/upateTransReq", { id, role, amt });
      const data = updat.data.status;
      
      if (data) {
        setUpdate(true);
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status == 404) {
        navigate("/admin/*");
      } else if (error?.response?.status == 500) {
        navigate("/admin/serverError");
      } else {
        navigate("/admin/serverError");
      }
    }
  }
  
  const indexOfLastPro = currentPage * prosPerPage;
  const indexOfFirstPro = indexOfLastPro - prosPerPage;
  const currentPros = Requests.slice(indexOfFirstPro, indexOfLastPro);
  return (
    <div className="flex justify-center p-24 bg-gray-200">
      <div className="flex flex-col w-screen bg-gray-600 ">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5 p-10">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
            {Requests?.length > 0 ?
              <table className="min-w-full text-center">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium roun text-gray-900 px-6 py-4 text-center"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 "
                    >
                      Requester
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 "
                    >
                      Account Number
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 "
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                {Requests?.length > 0
                  ? Requests?.map((trans) => {
                      return (
                        <tbody key={trans._id}>
                          <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {trans?.proId._id}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {trans?.To
                                ? trans?.To == "pro"
                                  ? "professional"
                                  : "User"
                                : ""}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {trans.To
                                ? trans?.To == "pro"
                                  ? trans?.proId?.name
                                  : trans?.userID?.name
                                : ""}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {trans?.accDetails?.accNo
                                ? trans?.accDetails?.accNo
                                : ""}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {trans?.accDetails?.amt ? trans?.accDetails?.amt : ""}
                            </td>

                            <td className="text-sm text-gray-900 flex justify-center font-light px-10 py-4 whitespace-nowrap">
                              <button onClick={()=>handlePay(trans._id,trans.To,trans.accDetails.amt)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-300">
                                Pay
                              </button>
                              <button className="bg-green-600 text-white px-4 py-2 ms-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                                Cancell
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      );
                    })
                  : ""}
              </table>
              :<div className="text-center text-2xl font-semibold"><h2>No Requests</h2></div>}
              <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(Requests?.length / prosPerPage)}
              onPageChange={setCurrentPage}
              page="adminList"
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withdrawReq;
