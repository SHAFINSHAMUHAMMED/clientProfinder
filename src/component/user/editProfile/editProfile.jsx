import React, { useState, useEffect } from "react";
import userAxiosInstance from "../../../Axios/userAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userName } from "../../../Redux/userState";
import { userImage } from "../../../Redux/userState";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";

function EditProfile({
  role,
  closePopup,
  userData,
  updateUserData,
  update,
  count,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userAxios = userAxiosInstance();
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector((state) => state.user.Token);
  const userId = useSelector((state) => state.user.Id);
  const [loading, setLoading] = useState(false);
  const [formdata, setFormdata] = useState({
    phone: userData.phone,
    name: userData.name,
    file: userData.image,
  });

  const handleNameChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      name: value,
    }));
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };

  if (!token) {
    navigate("/");
  }
  const changeimg = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      setErrMsg("File Not supported.");
      return;
    }

    setFormdata((prevData) => ({
      ...prevData,
      file: file,
    }));
    setErrMsg("");
  };

  useEffect(() => {}, [formdata.phone, formdata.name, formdata.file]);
  const requestData = {
    id: userId,
    name: formdata.name,
    phone: formdata.phone,
    file: formdata.file,
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      formdata.name === userData.name &&
      formdata.phone === userData.phone &&
      formdata.file === userData.image
    ) {
      // No changes made, display an error message
      setErrMsg("No changes were made.");
      setLoading(false);
      return;
    }
    if (!formdata.name || formdata?.name?.trim()?.length < 3) {
      setErrMsg("Enter Valid Name.");
      return;
    }
    if (!formdata.phone || !/^\d{10}$/.test(formdata?.phone?.toString()?.trim())) {
      setErrMsg("Phone must be a 10-digit number.");
      return;
    }
    userAxios
      .post("/userEdit", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === "success") {
          closePopup(false);
          updateUserData({
            ...userData,
            name: formdata.name,
            phone: formdata.phone,
            image: formdata.file,
          });
          update(count + 1);
          dispatch(userImage({ image: res.data.image }));
          dispatch(userName({ username: formdata.name }));
          Toast.fire({
            icon: "success",
            title: "Profile updated",
          }).then(() => {
            navigate("/profile");
          });
        } else {
          closePopup(false);
          Toast.fire({
            icon: "error",
            title: res.data.message,
          }).then(() => {
            navigate("/profile");
          });
        }
      }).catch((error)=>{
        if(error?.response?.status==404){
          navigate("/*")
        }else if(error?.response?.status==500){
          // navigate("/serverError")
        }else{
          // navigate("/serverError")
        }
      });
  };
  const handleCancelButton = () => {
    closePopup(false);
  };
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

  return (
    <div className="absolute  min-h-screen w-fit flex justify-center items-start">
      <form
        action=""
        onSubmit={handleUpdateProfile}
        encType="multipart/form-data"
      >
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
          <label
            htmlFor="file"
            className="flex flex-col items-center cursor-pointer mb-4"
          >
            <img
              src={
                formdata?.file instanceof File
                  ? URL.createObjectURL(formdata.file)
                  : userData.image
                  ? userData.image
                  : "/icons/man.png"
              }
              alt="...."
              className="avatar rounded-full w-20 h-20 mb-2"
            />
            <span className="text-blue-500">Choose Image</span>
          </label>
          <div className="mb-4">
            <input
              type="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              id="file"
              onChange={changeimg}
              className="hidden"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-left font-medium mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formdata.name}
              onChange={handleNameChange}
              placeholder="Your Name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-left font-medium mb-1">
              Your Dial Number
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formdata.phone}
              onChange={handlePhoneChange}
              placeholder="Your Dial number"
              className="w-full p-2 border rounded"
            />
          </div>
          {errMsg && <div className="text-red-500 mb-4">{errMsg}</div>}
          <div className="flex justify-end">
            <button
              className="bg-gray-300 hover:bg-gray-500 text-white py-1 px-2 rounded me-2"
              onClick={handleCancelButton}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              disabled={loading}
            >
              {loading ? (
                <CgSpinner size={20} className="animate-spin mr-2" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
