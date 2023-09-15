import React, { useState, useEffect } from "react";
import StarRating from "../../user/starRating/StarRating";
import Pagination from "../../pagination/Pagination";
import adminAxiosInterceptor from "../../../Axios/adminAxios";
import { useDispatch, useSelector } from "react-redux";

function proList({ data, update, count, role }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prosPerPage] = useState(3);
  const token = useSelector((store) => store.admin.Token);
  const indexOfLastPro = currentPage * prosPerPage;
  const indexOfFirstPro = indexOfLastPro - prosPerPage;
  const currentPros = data.slice(indexOfFirstPro, indexOfLastPro);
  const adminAxios = adminAxiosInterceptor();
  function blockUser(id) {
    adminAxios
      .post("/block" + role, { id })
      .then((res) => {
        if (res?.data?.status == 1) {
          update(count + 1);
        } else if (res?.data?.status == 0) {
          update(count + 1);
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
  }

  return (
    <div className="flex justify-center p-24 bg-gray-200">
      <div className="flex flex-col w-screen bg-gray-600 ">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5 p-10">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-200 border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium roun text-gray-900 px-6 py-4 text-center"
                    >
                      Profile
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Email
                    </th>
                    {data?.category ? (
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Service
                      </th>
                    ) : (
                      <th></th>
                    )}

                    {data?.category ? (
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Location
                      </th>
                    ) : (
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Phone
                      </th>
                    )}
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                {data?.length > 0
                  ? currentPros?.map((pro) => {
                      return (
                        <tbody key={pro?._id}>
                          <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <img
                                className="w-10 h-10 rounded-full"
                                src={pro?.image ? pro.image : "/ajmal.jpg"}
                                alt=""
                              />
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {pro?.name}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {pro?.email}
                            </td>
                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              {pro?.category}
                            </td>
                            {data?.category ? (
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {pro?.location}
                              </td>
                            ) : (
                              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                {pro?.phone}
                              </td>
                            )}

                            <td className="text-sm text-gray-900 flex justify-center font-light px-10 py-4 whitespace-nowrap">
                              <button
                                onClick={() => blockUser(pro?._id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-300"
                              >
                                {pro?.isBlocked == false ? "block" : "unblock"}
                              </button>
                              {/* <button className="bg-green-600 text-white px-4 py-2 ms-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                                  View
                                </button> */}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })
                  : ""}
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(data?.length / prosPerPage)}
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

export default proList;
