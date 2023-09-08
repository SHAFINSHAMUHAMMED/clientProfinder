import React, { useEffect, useRef, useState } from "react";
import AdminAxiosInterceptor from "../../../Axios/adminAxios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

function categoryManage() {
  const typeRef = useRef();
  const editRef = useRef();
  const [type, setType] = useState("");
  const [details, setdetails] = useState([]);
  const [deleted, setdeleted] = useState(0);
  const [edit, setEdit] = useState("");
  const [oldData, setOldData] = useState("");
  const [count, SetCount] = useState(0);
  const [Value, setValue] = useState();
  const [SearchInput, setSearchInput] = useState("");
  const AdminAxios = AdminAxiosInterceptor();
  const token = useSelector((store) => store.admin.Token);
  const navigate = useNavigate();

  let change = false;

  useEffect(() => {
    AdminAxios.get("/listTypes")
      .then((res) => {
        if (res.data.status) {
          setdetails(res.data.category);
          //   console.log(details[0]);
        } else {
          navigate("/admin/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [type, deleted, count]);

  const generateError = (err) =>
    toast.error(err, { position: "bottom-center" });
  const setSucMsg = (ok) => toast.success(ok, { position: "bottom-center" });

  const addTypes = async (e) => {
    e.preventDefault();
    let typeList = typeRef.current.value.trim();
    if (typeList == "" || typeList.length > 25) {
      return generateError("Enter Valid Field");
    }
    try {
      const res = await AdminAxios.post("/listTypes", { typeList });
      if (res.data.status == true) {
        console.log(res.data);
        setType(res.data.types);
        // console.log(type);
        setSucMsg("Done");
        typeRef.current.value = ""; // Clear the input field after form submission
      } else {
        generateError(res.data.message);
        typeRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editType = async (name) => {
    try {
      setOldData(name);
      setEdit(name);
      change = true;
    } catch (error) {
      console.log(error);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const editedData = editRef.current.value;
    setValue("");
    if (editedData == "") {
      return generateError("Fill the feilds");
    }
    if (editedData == oldData) {
      return generateError("no changes applied");
    }
    try {
      const res = await AdminAxios.patch(
        `/editType?editedData=${editedData}&oldData=${oldData}`,
        null
      );
      if (res.data.status == true) {
        setSucMsg("success");
        SetCount(count + 1);
        setEdit("");
      } else {
        setEdit("");
        generateError(res.data.message);
      }
    } catch (error) {}
  };
  const deleteType = async (type) => {
    try {
      const res = await AdminAxios.delete(`/deleteType?id=${type}`);
      if (res.data.status == true) {
        setSucMsg("Success");
        setdeleted(deleted + res.data.status);
      } else {
        generateError(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-center bg-white h-[39rem]">
        <div className="sm:w-8/12 w-11/12 h-5/6 border-2 flex-col border-slate-400">
          <div className="flex justify-center">
            <h2 htmlFor="" className="mt-2 pb-2 font-bold text-black">
              Add Types
            </h2>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
          <div className="flex justify-center">
            <form
              className="flex justify-center w-1/2"
              onSubmit={addTypes}
              action=""
            >
              <br />
              <div className="rounded md:w-[80vh] h-11 flex justify-end bg-[#e2e8f0]">
                <input
                  type="text"
                  ref={typeRef}
                  className="h-9 mt-[0.29rem] md:w-[60vh] w-[25vh] sm:w-[50vh] lg:w-[100vh] ps-5 outline-none ml-1 border-none bg-[#e2e8f0]"
                />
                <button className="border bg-[#6D6C6C] text-white font-semibold rounded md:px-6 md:py-1 sm:ms-5">
                  submit
                </button>
              </div>
            </form>
          </div>
          {Value ? (
            <>
              <div className="flex justify-center">
                <h2 htmlFor="" className="mt-2 pt-2 font-semibold">
                  Edit Types
                </h2>
              </div>
              <div className="flex justify-center pt-3">
                <form
                  className="flex justify-center w-1/2"
                  onSubmit={submitEdit}
                  action=""
                >
                  <br />
                  <div className="rounded md:w-[80vh] h-11 flex justify-end bg-[#e2e8f0]">
                    <input
                      ref={editRef}
                      type="text"
                      placeholder="Select the type from below"
                      onChange={(e) => setEdit(e.target.value)}
                      value={edit}
                      className="font-semibold outline-none font-sans h-9 mt-[0.29rem] md:w-[60vh] w-[25vh] sm:w-[50vh] lg:w-[100vh] ml-1 border-none bg-[#e2e8f0]"
                      name=""
                      id=""
                    />
                    <button className="border bg-[#6D6C6C] text-white font-semibold rounded md:px-6 md:py-1 sm:ms-5">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            ""
          )}

          <h1 className="text-center p-3">List Types</h1>
          <div className="flex justify-center ">
            <div className="rounded md:w-[80vh] overflow-auto h-[10rem] md:h-[17rem] flex pt-2 justify-center bg-[#e2e8f0]">
              <div className="flex-col">
                <div className="flex justify-end" role="search">
                  <div className="relative">
                    <input
                      className="form-control ps-2 rounded-md border border-gray-400 outline-none pr-10 bg-white bg-no-repeat bg-contain"
                      type="search"
                      placeholder="Search"
                      value={SearchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      aria-label="Search"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <i className="fas fa-search text-black"></i>
                    </div>
                  </div>
                </div>

                {details.length > 0
                  ? details
                      .filter((type) =>
                        type.name
                          .toLowerCase()
                          .includes(SearchInput.toLowerCase())
                      )
                      .map((type, index) => {
                        return (
                          <div
                            key={type._id}
                            className="bg-white flex h-11 w-[60vh]  items-center my-2 rounded-md"
                          >
                            <div className="flex gap-3 w-full justify-between ">
                              <div className="flex gap-3 ml-2 font-bold">
                                <div className="text-slate-600">
                                  {index + 1}.
                                </div>
                                <div className="text-slate-600">
                                  {type.name}
                                </div>
                              </div>
                              <div className="flex gap-4 mr-2">
                                <div>
                                  <button
                                    onClick={() => {
                                      editType(type.name);
                                      setValue(1);
                                    }}
                                  >
                                    <i className="fas fa-edit text-black"></i>
                                  </button>
                                </div>
                                <div>
                                  <button
                                    onClick={() => {
                                      deleteType(type._id);
                                    }}
                                  >
                                    <i className="fa fa-trash text-red-600"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  : "empty types"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default categoryManage;
