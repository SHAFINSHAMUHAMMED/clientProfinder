import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../../Redux/adminState";

function Navbar() {
  const [open, setOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.admin.Token);
  const logout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };
  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const toggleMore = () => {
    setMoreOpen((prevMoreOpen) => !prevMoreOpen);
  };

  return (
    <div className="min-">
      <div className="antialiased bg-gray-500 dark-mode:bg-gray-900">
        <div className="w-full text-gray-700 bg-gray-500 dark-mode:text-gray-200 dark-mode:bg-gray-800">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between p-4">
              <a
                href="#"
                className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline"
              >
                <img className="w-24" src="/loginpage/logo2.png" alt="Logo" />
              </a>
              <button
                className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                onClick={toggleMenu}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                  {/* <path xShow={open} fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path> */}
                </svg>
              </button>
            </div>
            <nav
              className={`flex-col flex-grow md:flex md:justify-end md:flex-row ${
                open ? "flex" : "hidden"
              }`}
            >
              <Link
                to={"/admin/"}
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg  md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline "
                href="#"
              >
                Home
              </Link>
              <a
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg  md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                href="#"
              >
                Transactions
              </a>
              <Link
                to={"/admin/listUser"}
                className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg  md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                href="#"
              >
                Users
              </Link>
              <Link
                to={"/admin/listPro"}
                className=" px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg  md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                href="#"
              >
                Professionals
              </Link>
              <div className="relative" xdata="{ open: true }">
                <button
                  className="flex flex-row text-gray-900 bg-gray-200 items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                  onClick={toggleMore}
                >
                  <span>More</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className={`inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform ${
                      moreOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <div
                  className={`absolute right-0 w-full md:w-fit  mt-2 origin-top-right ${
                    moreOpen ? "" : "hidden"
                  }`}
                >
                  <div className="px-2 pt-2 pb-4">
                    <ul className="flex flex-col  md:text-right px-2 pt-2 pb-4 bg-white rounded-md shadow-lg">
                      <li className="py-2">
                        <Link
                          to={"/admin/category"}
                          href="#"
                          className="text-gray-900 hover:text-gray-700"
                        >
                          Services
                        </Link>
                      </li>
                      <li className="py-2">
                        <Link
                        to={"/admin/withdrawReq"}
                          href="#"
                          className="text-gray-900 hover:text-gray-700"
                        >
                          Withdrawals
                        </Link>
                      </li>
                      <li className="py-2">
                        <a
                          onClick={logout}
                          href="#"
                          className="text-gray-900 hover:text-gray-700"
                        >
                          {token ? "Logout" : "Login"}
                        </a>
                      </li>
                      {/* Add more list items as needed */}
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
