import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Swal from "sweetalert2";
import userAxiosInstance from "../../../Axios/userAxios";

function Review({Id,popup,Proid}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [errMsg, setErrMsg] = useState("");
  const userAxios = userAxiosInstance();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleSubmitReview = () => {
    if(rating<1){
      setErrMsg("Please Add Rating.");
        return
    }
    postReview()
  };

  const handleCancell = () => {
    popup(false)
  }

  const postReview = async ()=> {
    try{
        const review = await userAxios.patch("/addReview",{Id,rating,reviewText,Proid})
        if(review.status){
            Toast.fire({
                icon: "success",
                title: review.data.message,
              }).then(() => {
                setRating(0);
                setReviewText('');
                popup(false)
              });
           
        }else{
            Toast.fire({
                icon: "error",
                title: review.data.message,
              }) 
        }
    }catch(error){
        Toast.fire({
            icon: "error",
            title: 'Some Error Occuured',
          }) 
    }
  }


  return (
    <div className="p-10 bg-white">
      <div className="bg-blue-400 flex items-center gap-3 p-3 rounded-md">
        <img src="/icons/review.png" alt="Review Icon" className="w-8 h-8 sm:w-14 sm:h-14" />
        <h5 className="text-white sm:text-lg font-semibold text-base">Add Your Review</h5>
      </div>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Rate this work</h1>
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, index) => (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={index + 1}
                onClick={() => handleStarClick(index + 1)}
                className="hidden"
              />
              <FaStar
                className={`cursor-pointer ${
                  rating >= index + 1 ? 'text-yellow-500' : 'text-gray-300 w-6 h-6'
                }`}
              />
            </label>
          ))}
        </div>
        <p className="mt-4">
          {rating === 0
            ? 'Please select a rating.'
            : `You've selected ${rating} star(s).`}
        </p>
        {errMsg && <div className="text-red-500 mt-2 text-xs">{errMsg}</div>}
        <div className="mt-8">
          <textarea
            value={reviewText}
            onChange={handleReviewChange}
            placeholder="Add your review here..."
            className="w-full p-4 border text-sm sm:text-base border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mt-4 flex gap-1 justify-center">
          <button
            onClick={handleCancell}
            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-400 focus:outline-none"
          >
            Cancell
          </button>
          <button
            onClick={handleSubmitReview}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-400 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Review;
