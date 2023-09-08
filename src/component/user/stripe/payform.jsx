import userAxiosInstance from "../../../Axios/userAxios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#333",
      fontWeight: 500,
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export default function PaymentForm() {
  const [success, setSuccess] = useState(false);
  const token = useSelector((store) => store.user.Token);
  const userAxios = userAxiosInstance()
;

  return (
    <div className="payment-form">
    </div>
  );
}
