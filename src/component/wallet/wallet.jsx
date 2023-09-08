import React, { useState, useEffect,useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { UserLogout } from "../../Redux/userState";
import { proLogout } from "../../Redux/professionalsState";
import userAxiosInstance from "../../Axios/userAxios";
import ProAxiosInstance from "../../Axios/professionalsAxios";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";


function wallet({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usertoken = useSelector((state) => state.user.Token);
  const protoken = useSelector((store) => store.professional.Token);
  const userid = useSelector((state) => state.user.Id);
  const proid = useSelector((state) => state.professional.proId);
  const [userData, setuserData] = useState("");
  const [Transaction, setTransaction] = useState([]);
  const [activeStatus, setActiveStatus] = useState("in");
  const [withdrawForm, setwithdrawForm] = useState(false)
  const [Msg, setMsg] = useState('')
  const amountRef = useRef(null);
  const accountHolderRef = useRef(null);
  const accountNumberRef = useRef(null);
  const bankNameRef = useRef(null);
  const ifscCodeRef = useRef(null);
  const branchRef = useRef(null);
  const setErrMsg = (err) => toast.error(err, { position: "bottom-center" });

  let axios = null;
  let id = null;
  if (role == "user") {
    id = userid;
    axios = userAxiosInstance();
  } else if (role == "pro") {
    id = proid;
    axios = ProAxiosInstance();
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
  }, []);

  useEffect(() => {
    if (role == "user") {
      axios.get(`/userDetails?userId=${userid}`).then((res) => {
        const data = res.data.data;
        if (data) {
          if (data.isBlocked) {
            dispatch(UserLogout());
          } else {
            setuserData(data);
          }
        }
      });
    } else {
      //professionals
      axios.get(`/proDetails?proId=${proid}`).then((res) => {
        const data = res.data.data;
        if (data) {
          if (data.isBlocked) {
            dispatch(proLogout());
          } else {
            setuserData(data);
          }
        }
      });
    }
    axios.get(`/transactions?id=${id}&role=${role}`).then((res) => {
      if (res.data.status) {
        const data = res.data.data;
        setTransaction(data);
        console.log(data);
      }
    });
  }, []);

  let filter = "";
  if (Transaction.length > 0 && activeStatus == "in") {
    filter = "";
    filter = Transaction.filter((item) => item.PaymentType === "in");
  } else {
    filter = Transaction.filter((item) => item.PaymentType === "out");
  }

  const handleActive = (active) => {
    setActiveStatus(active);
    setMsg('')
  };
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
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

  function withdrawHandle () {
    if(userData.wallet<100){
      setMsg('Not Enough Balance')
    }else{
      setwithdrawForm(true)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validation functions
    const containsNumbers = (value) => /\d/.test(value);
    const containsLetter = (value) => /[A-Za-z]/.test(value);
    const isNumber = (value) => !isNaN(value) && value >= 100;
    const isString = (value) => typeof value === 'string' && value.trim().length > 0 && !containsNumbers(value);
    const isAccountNumber = (value) => /^[0-9]{10,20}$/.test(value);
    const isBankName = (value) => typeof value === 'string' && value.trim().length >= 3 && value.trim().length <= 50 && !containsNumbers(value);
    const isIFSCCode = (value) => value.trim().length >=4 && value.trim().length <= 15 && containsNumbers(value) && containsLetter(value);
    const isBranch = (value) => typeof value === 'string' && value.trim().length >= 2 && value.trim().length <= 50;
  
    // Get form data
    const formData = {
      amount: amountRef.current.value,
      accountHolder: accountHolderRef.current.value,
      accountNumber: accountNumberRef.current.value,
      bankName: bankNameRef.current.value,
      ifscCode: ifscCodeRef.current.value,
      branch: branchRef.current.value,
    };
  
    // Perform validation
    if (!isNumber(formData.amount)) {
      setErrMsg('Enter Valid Amount')
      return;
    }
  
    if (!isString(formData.accountHolder) || formData.accountHolder.trim().length < 3) {
      setErrMsg('Enter Valid Name')
      return;
    }
  
    if (!isAccountNumber(formData.accountNumber)) {
      setErrMsg('Enter Valid Account Number')
      return;
    }
  
    if (!isBankName(formData.bankName)) {
      setErrMsg('Enter Valid Bank Name')
      return;
    }
  
    if (!isIFSCCode(formData.ifscCode)) {
      setErrMsg('Enter Valid IFSC Code')
      return;
    }
  
    if (!isBranch(formData.branch)) {
      setErrMsg('Enter Valid Branch Location')
      return;
    }
    if(formData.amount>userData.wallet){
      setErrMsg('Not Enough Balance')
      return
    }
  
    // If all data is valid, proceed with form submission
    axios
      .post('/withdrawReq', { formData, role, id })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          Toast.fire({
            icon: 'success',
            title: response.data.message,
          }).then(() => {
            setwithdrawForm(false);
          });
        } else {
          Toast.fire({
            icon: 'error',
            title: response.data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.fire({
          icon: 'error',
          title: error.response.data.message,
        });
      });
  };
  
  return (
    <div className="bg-gray-300 pb-8">
      <div className="mx-auto container flex justify-center py-6 sm:py-16 sm:px-4">
        <div className="flex flex-col space-y-8 w-4/6 sm:w-full px-2 sm:px-16 max-w-xl">
        <Toaster position="top-center" reverseOrder={false}></Toaster>

          {/* card */}
          <div
            className="mx-1 sm:w-2/3 sm:m-auto rounded-xl py-5"
            style={{
              background: "linear-gradient(to bottom, #5050F9, #7777D6)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 150%",
              color: "white", // Text color
              padding: "1.5rem", // Adjust padding as needed
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Box shadow
            }}
          >
            <div className="h-full flex flex-col justify-between">
                <div className="sm:text-xl font-semibold tracking-tigh">
                  PROFINDER
              </div>
              <div className="flex items-start justify-between space-x-4 pb-2">
                <div>name</div>
                  <div className="font-semibold text-white">wallet</div>
                </div>

              <div className="inline-block w-8 h-6 sm:w-12 sm:h-8 bg-gradient-to-tl from-yellow-200 to-yellow-100 rounded-md shadow-inner overflow-hidden">
                <div className="relative w-full h-full grid grid-cols-2 gap-1">
                  {/* SVG paths */}
                </div>
              </div>

              <div className="">
                <div className="text-xs font-semibold tracking-tight">
                  Balance
                </div>

                <div className=" flex justify-between gap-1">
                  <div className="text-lg sm:text-2xl font-bold sm:font-semibold">
                  ₹{userData.wallet ? userData.wallet : 0}
                  </div>
                  <button onClick={withdrawHandle} class=" text-xs bg-indigo-400 hover:bg-indigo-700 text-white font-semibold py-1 px-1 rounded">
  Withdraw
</button>
                </div>
                <h6 className="text-[70%] text-red-800">{Msg?Msg:''}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      {withdrawForm ? (
          <div className=' flex flex-col p-5  items-center w-2/3 m-auto rounded-md text-center bg-white'>
          <div>
            <h1 className='text-gray-800 font-medium text-2xl mb-5 '>Withdrawal Form </h1>
          </div>
          <div className='w-4/6 h-[75%] rounded-xl bg-opacity-80 p-8'
            style={{
              background: "linear-gradient(to bottom, #5050F9, #7777D6)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col text-center mt-[4%] gap-y-4 items-center'>
                <input
                  ref={amountRef}
                  placeholder='₹ Enter Amount'
                  className='w-2/6 h-11 text-center rounded-md bg-white'
                  type="number"
                />
                <input
                  ref={accountHolderRef}
                  placeholder=' Account Holder Name'
                  className='w-4/6 h-11 rounded-md text-center bg-white'
                  type="text"
                />
                <input
                  ref={accountNumberRef}
                  placeholder=' Account Number'
                  className='w-4/6 h-11 rounded-md text-center bg-white'
                  type="number"
                />
                <input
                  ref={bankNameRef}
                  placeholder=' Bank Name '
                  className='w-4/6 h-11 rounded-md text-center bg-white'
                  type="text"
                />
                <input
                  ref={ifscCodeRef}
                  placeholder='IFSC Code '
                  className='w-4/6 h-11 rounded-md text-center bg-white'
                  type="text"
                />
                <input
                  ref={branchRef}
                  placeholder='Branch '
                  className='w-4/6 h-11 rounded-md text-center bg-white'
                  type="text"
                />
                <button type='submit' className='px-8 py-2 rounded-md bg-indigo-600 text-white font-bold hover:bg-blue-800 border'>
                  Submit
                </button>
                <button onClick={()=> setwithdrawForm(false)} className='px-8 py-1 rounded-md bg-slate-400 text-white font-bold hover:bg-slate-500 border border-gray-300'>
                  Cancell
                </button>
              </div>
            </form>
          </div>
        </div>

      ):(
      <div
        className="mx-1 sm:w-2/3 sm:m-auto rounded-xl py-5"
        style={{
          background: "linear-gradient(to bottom, #5050F9, #7777D6)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="sm:w-4/5 mx-1 sm:m-auto py-2">
          <div className="flex gap-0 bg-slate-400 justify-center  mb-8 w-4/5 sm:w-1/2 m-auto rounded-lg ">
            <div
              onClick={() => handleActive("in")}
              className={
                activeStatus === "in"
                  ? "bg-slate-200 w-1/2 h-8 flex justify-center items-center rounded-lg"
                  : "bg-slate-400 w-1/2 h-8 flex justify-center items-center rounded-lg"
              }
            >
              <h6>Credited</h6>
            </div>

            <div
              onClick={() => handleActive("out")}
              className={
                activeStatus === "out"
                  ? "bg-slate-200 w-1/2 h-8 flex justify-center items-center rounded-lg"
                  : "bg-slate-400 w-1/2 h-8 flex justify-center items-center rounded-lg"
              }
            >
              <h6>Debited</h6>
            </div>
          </div>
          {console.log(filter, activeStatus)}

          {filter.length > 0 ? (
            filter.map((data) => (
              <div
                key={data._id}
                className="grid grid-cols-8 bg-gray-200 p-1 rounded-lg mb-2"
              >
                <div className="col-span-1 flex justify-center items-center ">
                  <img
                    className="w-7 sm:w-9"
                    src={
                      activeStatus === "in"
                        ? "/icons/Received.png"
                        : "/icons/Send.png"
                    }
                    alt=""
                  />
                </div>
                <div className="text-xs sm:text-base flex justify-around items-center col-span-7">
                  <div>
                    <h4>{activeStatus === "in" ? "Received" : "Withdrawn"}</h4>
                    <h6>{formatDate(data.date)}</h6>
                  </div>
                  <div>
                    {/* {role=='user' ? (
                <h4 className='text-[80%] font-semibold text-center'>{data.orderId.category}</h4>
                ):('')} */}
                    <div className="">
                      {role == "user" ? (
                        activeStatus == "in" ? (
                          <h6 className="text-center f text-[90%]">
                            From:{" "}
                            <span className="text-center font-semibold text-[90%]">
                              {data.proId.name}
                            </span>
                          </h6>
                        ) : (
                          <h6 className="text-center f text-[90%]">
                            To:{" "}
                            <span className="text-center font-semibold text-[90%]">
                              AccName
                            </span>
                          </h6>
                        )
                      ) : activeStatus == "in" ? (
                        <h6 className="text-center f text-[90%]">
                          From:{" "}
                          <span className="text-center font-semibold text-[90%]">
                            {data.userID.name}
                          </span>
                        </h6>
                      ) : (
                        <h6 className="text-center f text-[90%]">
                          To:{" "}
                          <span className="text-center font-semibold text-[90%]">
                            AccName
                          </span>
                        </h6>
                      )}
                      <div className="flex items-center">
                        {activeStatus == "in" ? (
                          <>
                            <img
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              src="/icons/location.png"
                              alt=""
                            />
                            <h6 className="text-[80%]">
                              {data.orderId.address.location.split(" ")[0]}
                            </h6>
                          </>
                        ) : (
                          <h6 className="text-[80%]">123456789</h6>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4>Amount</h4>

                    <h4 className="text-center">{data.orderId.payment}</h4>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No Data</div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default wallet;
