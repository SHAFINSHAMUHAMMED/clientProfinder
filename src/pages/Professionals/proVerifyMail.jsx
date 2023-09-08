import React, {useEffect,useState} from 'react'
import { useNavigate, useParams,Link } from 'react-router-dom'
import professionalsAxiosInterceptor from '../../Axios/professionalsAxios'

function verifyMail() {
  const {id:pro_id}=useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const professionalsAxios = professionalsAxiosInterceptor()
  useEffect(() => {
    professionalsAxios.post('/verifyMail',{id:pro_id}).then((res)=>{
        if(res.data.Verification){
          setMessage(res.data.message);
        }else{
          setMessage(res.data.message);
        }
      })
  },[])
  
  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-20 bg-slate-400 rounded-lg p-8 shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">{message}</h2>
          <p className="text-white mt-2">Thank you for verifying your email.</p>
        </div>
        <div className="flex justify-center">
          <Link
            to="/professional/login"
            className="mt-4 bg-blue-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default verifyMail
