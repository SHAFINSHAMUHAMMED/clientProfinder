import React,{useState,useEffect} from 'react'
import Chart from '../chart/chart'
import adminAxiosInterceptor from "../../../Axios/adminAxios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../Redux/adminState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
function home() {
  const [Pro, setPro] = useState([])
  const [User, setUser] = useState([])
  const [Profit, setProfit] = useState('')
  const token = useSelector((store) => store.admin.Token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminAxios = adminAxiosInterceptor()

  useEffect(() => {
    adminAxios.get("/getDetails")
    .then((res)=>{
      setPro(res.data.pro)
      setUser(res.data.user)
      setProfit(res.data.profit)
    }).catch((error)=>{
      console.log(error);
      if(error?.response?.status==404){
        navigate("/admin/*")
      }else if(error?.response?.status==500){
        navigate("/admin/serverError")
      }else{
        navigate("/admin/serverError")
      }
    })
  }, []);

  return (
    <div className="  justify-center sm:p-10 bg-slate-400">
     <h2 className="text-center pt-5 mb-10 text-3xl sm:text-4xl font-mono font-extrabold bg-gradient-to-r from-purple-100 via-blue-800 to-gray-100 text-transparent bg-clip-text">Admin Dashboard</h2>

      <div className='w-full h-48 sm:h-72 sm:w-4/5 m-auto p-5 sm:p-14 bg-blue-100 rounded-lg'>
      <div className="cards flex flex-row gap-2 h-24 sm:h-[7rem] sm:gap-3 sm:flex-row md:gap-2 justify-center">
      <div className="card bg-gradient-to-r from-blue-100 via-gray-100 to-blue-200 w-48 sm:w-3/12 h-36 flex justify-center items-center rounded-lg">
          <div>
            <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
             Total Profit
            </h4>
            <div className="sm:flex items-center justify-between">
              <h4 className="text-lg sm:text-2xl font-bold font-mono text-center">
                ₹{Profit[0]?.profit}
              </h4>
              <img
                className="w-5 sm:w-10 m-auto"
                src="/icons/profits.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-200 via-gray-100 to-blue-200 w-48 sm:w-3/12 h-36 flex justify-center items-center rounded-lg">

          <div>
            <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
              {" "}
              Registered Professionals
            </h4>
            <div className="sm:flex items-center justify-center">
              <h4 className="text-xl sm:text-4xl font-bold font-mono text-center">
                {Pro?.length}
              </h4>
              <img
                className="w-5 m-auto sm:m-0 sm:w-10 sm:ms-2"
                src="/icons/professionals.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-r from-blue-200 via-gray-100 to-blue-100 w-48 sm:w-3/12 h-36 flex justify-center items-center rounded-lg">
          <div>
            <h4 className="text-center text-sm sm:text-base xl:text-xl font-semibold">
              Registered Users
            </h4>
            <div className="sm:flex items-center justify-center">
              <h4 className="text-xl sm:text-4xl font-bold font-mono text-center">
                {User?.length}
              </h4>
              <img
                className="w-5 m-auto sm:m-0 sm:w-10 sm:ms-2"
                src="/icons/users.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="graphw-full sm:w-4/5 m-auto p-5 sm:p-14 bg-blue-100 mt-10 rounded-lg">
        {/* graph */}
        <h2 className='text-center font-bold'>Total Users & Professionals</h2>
        <Chart pro={Pro} user={User}/>
      </div>
    </div>
  )
}

export default home
