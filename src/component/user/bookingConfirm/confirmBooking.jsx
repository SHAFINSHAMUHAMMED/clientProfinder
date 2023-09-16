import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import userAxiosInstance from "../../../Axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { UserLogout, userLocation } from "../../../Redux/userState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import SuccessPage from "../paymentSucc/success";
import FadeLoader from "react-spinners/FadeLoader";

function confirmBooking() {
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
  const token = useSelector((store) => store.user.Token);
  const userId = useSelector((store) => store.user.Id);
  const { proData, date, time } = location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [ErrMsg, setErrMsg] = useState("");
  const [Success, setSuccess] = useState(false);
  const [OrderData, setOrderData] = useState("");
  const [formData, setFormData] = useState({
    selectedPayment: null,
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    district: "",
    landmark: "",
    zip: "",
  });
  const userAxios = userAxiosInstance();
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
    } else {
      setIsLoading(true);
      const delayTimer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => {
        clearTimeout(delayTimer);
      };
    }
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handlePaymentSelection = (event) => {
    const paymentAmount = parseFloat(event.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      selectedPayment: paymentAmount,
    }));
    setErrMsg("");
  };
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    setErrMsg("");
  };
  const requestData = {
    proData: proData,
    userId: userId,
    date: date,
    time: time,
    formData: formData,
  };
  const handleOpenRazorpay = (data) => {
    const options = {
      key: "rzp_test_EcxwDRQV8pJvDo",
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      name: "proFinder",
      description: "abcdefghijkl",
      handler: function (response) {
        if (response.razorpay_payment_id && response.razorpay_signature) {
          userAxios
            .post("/verifyRazorpay", { response: response, requestData })
            .then((res) => {
              if (res.data.status) {
                setOrderData(res.data.orderData);
                setSuccess(true);
              } else {
                console.log("Transaction verification failed");
              }
            })
            .catch((error) => {
              console.error("Error verifying transaction:", error);
              if(error?.response?.status==404){
                navigate("/*")
              }else if(error?.response?.status==500){
                navigate("/serverError")
              }else{
                navigate("/serverError")
              }
            });
        } else if (response.error.code === Razorpay.Error.PAYMENT_CANCELLED) {
          // cancelled by the user
          console.log("Transaction cancelled by the user");
        } else {
          console.log("Transaction failed:", response.error);
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      address,
      phone,
      email,
      city,
      district,
      landmark,
      zip,
      selectedPayment,
    } = formData;

    // Validation
    if (!firstName || firstName?.trim()?.length < 4) {
      setErrMsg({id:1, message:"Enter a valid First Name."});
      return;
    }

    if (!lastName || lastName?.trim()?.length < 1) {
      setErrMsg({id:2,message:"Enter a valid Last Name."});
      return;
    }

    if (!address || address?.trim()?.length < 5) {
      setErrMsg({id:3,message:"Enter a valid Address"});
      return;
    }

    if (!email || email?.trim()?.length < 5) {
      setErrMsg({id:4,message:"Email is required."});
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email?.trim())) {
      setErrMsg({id:4,message:"Invalid email format."});
      return;
    }

    if (!phone || !/^\d{10}$/.test(phone?.toString()?.trim())) {
      setErrMsg({id:5,message:"Phone must be a 10-digit number."});
      return;
    }

    if (!city || city?.trim()?.length < 2) {
      setErrMsg({id:6,message:"Enter a valid City name."});
      return;
    }

    if (!district || district?.trim()?.length < 2) {
      setErrMsg({id:7,message:"Enter a valid District name."});
      return;
    }

    if (!landmark || landmark?.trim()?.length < 2) {
      setErrMsg({id:8,message:"Enter a valid Landmark"});
      return;
    }

    if (!zip || !/^\d{6}$/.test(zip?.toString()?.trim())) {
      setErrMsg({id:9,message:"Enter a valid 6-digit Zip Code."});
      return;
    }
    if (selectedPayment == null) {
      setErrMsg({ id: 10, message: "Choose a payment Option" });
      return;
    }
    if (!isChecked) {
      setErrMsg({
        id: 11,
        message: "Please agree to the terms and conditions.",
      });
      return;
    } else {
      // setshowitem(1)
      try{
      const response = await userAxios.post("/razorpay", { selectedPayment });
      if (response.data.status) {
        handleOpenRazorpay(response.data.data);
      }
    }catch(error){
      if(error?.response?.status==404){
        navigate("/*")
      }else if(error?.response?.status==500){
        navigate("/serverError")
      }else{
        navigate("/serverError")
      }
    }
  }
  };
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <FadeLoader color="#242ae8" /> {/* Loading spinner */}
        </div>
      ) : (
        <div
          style={{
            filter: Success ? "blur(5px)" : "none",
            pointerEvents: Success ? "none" : "auto",
          }}
        >
          <div className="mb-24">
            <div className="banner w-[80%] p-5 pl-2 pr-2 md:p-14 md:pl-5 md:pr-4 m-auto relative">
              <img src="/confirmBooking.png" alt="" />
              <h2
                className="absolute top-1/3 sm:top-1/2 left-8 sm:left-16 lg:left-36 transform text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold capitalize leading-normal"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "darkgray",
                }}
              >
                Confirm Booking
              </h2>
            </div>
            <form method="POST" onSubmit={submitForm}>
              <div className="md:flex p-2 justify-evenly sm:mt-16 md:mt-0 md:p-0">
                <div
                  className=" w-full  sm:w-5/6 md:w-7/12 m-auto md:m-0 p-5 sm:p-10 lg:p-16"
                  style={{ background: "#D6E4E6" }}
                >
                  <div className="grid gap-6 mb-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="First Name"
                      />
                      {ErrMsg.id === 1 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Last Name"
                      />
                      {ErrMsg.id === 2 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block mb-2 text-sm font-medium text-gray-900  "
                    >
                      House/Company Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Address"
                    />
                    {ErrMsg.id === 3 && (
                      <div>
                        <p style={{ color: "red" }}>{ErrMsg.message}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid gap-6 mb-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Email"
                      />
                      {ErrMsg.id === 4 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        Phone
                      </label>
                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Phone"
                      />
                      {ErrMsg.id === 5 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 mb-4 md:grid-cols-2">
                    <div className="mb-2">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="City"
                      />
                      {ErrMsg.id === 6 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <label
                        htmlFor="district"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        District
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="District"
                      />
                      {ErrMsg.id === 7 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-6 mb-2 md:grid-cols-2">
                    <div className="mb-3">
                      <label
                        htmlFor="Landmark"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        Landmark
                      </label>
                      <input
                        type="text"
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Landmark"
                      />
                      {ErrMsg.id === 8 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="Zip"
                        className="block mb-2 text-sm font-medium text-gray-900  "
                      >
                        Zip Code
                      </label>
                      <input
                        type="number"
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-300 dark:border-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Zip "
                      />
                      {ErrMsg.id === 9 && (
                        <div>
                          <p style={{ color: "red" }}>{ErrMsg.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="bg-gray-300 w-full  sm:w-5/6 md:w-2/6 xl:w-1/4 sm:m-auto mt-10 sm:mt-5 md:m-0"
                  style={{ background: "#D6E4E6" }}
                >
                  <div className="2nd main p-5 sm:p-10 md:p-5">
                    <h3 className="text-xl font-bold ps-5 pb-5">Payment</h3>
                    <div className="flex justify-between lg:m-4 xl:m-5 mb-2">
                      <h2 className="text-sm lg:text-lg font-medium">Name</h2>
                      <h2 className="lg:text-lg font-mono">{proData?.name}</h2>
                    </div>
                    <div className="flex justify-between lg:m-4 xl:m-5 pb-8 sm:pb-14">
                      <h2 className="text-sm lg:text-lg font-medium">
                        Profession
                      </h2>
                      <h2 className="lg:text-lg font-mono">
                        {proData?.category?.name}
                      </h2>
                    </div>
                    <div
                      className=" p-3 m-auto sm:p-5 md:p-3 lg:p-5 rounded-xl"
                      style={{ backgroundColor: "#F6FFFE" }}
                    >
                      <div className="flex justify-between mb-3">
                        <div className="flex">
                          <input
                            type="radio"
                            name="payment"
                            id="full_payment"
                            value={time=='Part Time1'||time=='Part Time2'?proData.charge.partime:proData.charge.fulltime}
                            onChange={handlePaymentSelection}
                          />
                          <h4 className="md:ms-2 lg:ms-5 md:text-sm lg:text-base">
                            Make Full Payment
                          </h4>
                        </div>
                        <h4 className="font-medium">
                          ₹{time=='Part Time1'||time=='Part Time2'?proData.charge.partime:proData.charge.fulltime}
                        </h4>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex">
                          <input
                            type="radio"
                            name="payment"
                            id="part_payment"
                            value={100}
                            onChange={handlePaymentSelection}
                          />
                          <h4 className="md:ms-2 lg:ms-5 md:text-sm lg:text-base">
                            Make Part Payment
                          </h4>
                        </div>
                        <h4 className="font-medium">₹100</h4>
                      </div>
                    </div>
                    {ErrMsg.id === 10 && (
                      <div>
                        <p style={{ color: "red" }}>{ErrMsg.message}</p>
                      </div>
                    )}
                    <div className="flex justify-between p-5 sm:pt-10">
                      <h2 className="text-lg font-bold">Total</h2>
                      <h2 className="text-lg font-bold font-mono">
                        {formData.selectedPayment
                          ? "₹" + formData.selectedPayment
                          : "0000"}
                      </h2>
                    </div>

                    <div className="flex mb-8 lg:p-6 lg:pe-2 xl:p-1 xl:pb-6">
                      <input
                        type="checkbox"
                        value=""
                        className={`w-4 h-4 border me-2 mt-1  rounded  ${
                          ErrMsg.id == 11
                            ? "focus:ring-red-600 border-red-800 bg-red-50 focus:ring-3"
                            : "focus:ring-blue-600 bg-gray-50 focus:ring-3 border-gray-300 dark:ring-offset-gray-800"
                        }`}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        htmlFor="remember"
                        className=" text-xs lg:text-sm mt-1 lg:mt-0 font-medium text-gray-900 dark:text-gray-400"
                      >
                        I agree with the{" "}
                        <a
                          href="#"
                          className="text-blue-600 text-xs lg:text-sm hover:underline dark:text-blue-500"
                        >
                          terms and conditions
                        </a>
                        .
                        {ErrMsg.id === 11 && (
                          <div className="text-[65%]">
                            <p style={{ color: "red" }}>{ErrMsg.message}</p>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm w-full px-5 py-2.5 mb-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {Success && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            Width: "80%",
          }}
        >
          <SuccessPage orderData={OrderData} />
        </div>
      )}
    </>
  )
    }
}

export default confirmBooking;
