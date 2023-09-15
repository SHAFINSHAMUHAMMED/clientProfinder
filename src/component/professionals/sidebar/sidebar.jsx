import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { proLogout } from "../../../Redux/professionalsState";
import Cookies from "js-cookie";
import { decodeJwt } from "jose";
import "./sidebar.css";

function sidebar() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [active, setactive] = useState("");
  const token = useSelector((store) => store.professional.Token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(proLogout());
      navigate("/professional/login");
    }
  }, [navigate, dispatch, token]);

  const logout = () => {
    dispatch(proLogout());
    navigate("/professional/login");
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className=" md:flex   md:min-h-screen mw-full bg-gray-400">
      <div className="flex flex-col w-full md:w-52 lg:w-52 text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0 md:rounded-tr-3xl md:rounded-br-3xl">
        <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
          <a href="/professional/">
            <img src="/loginpage/logo2.png" alt="" />
          </a>
          <div className="flex gap-5 md:gap-10">
            <div onClick={logout} className="block md:hidden">
              {token ? "logout" : "login"}
            </div>
            <button
              className="rounded-lg md:hidden  focus:outline-none focus:shadow-outline"
              onClick={toggleMenu}
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path
                  id="menuIcon"
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <nav
          id="mainMenu"
          className={`flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto ${
            isMenuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            // onClick={()=>setactive('home')}
            to={"/professional/"}
            className={
              active == "home"
                ? "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg"
                : "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg"
            }
          >
            Dashboard
          </Link>
          <Link
            // onClick={()=>setactive('profile')}

            to={"/professional/profile"}
            className={
              active == "profile"
                ? "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg"
                : "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg"
            }
          >
            Profile
          </Link>
          <Link
            // onClick={()=>setactive('wallet')}

            to={"/professional/wallet"}
            className={
              active == "wallet"
                ? "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg"
                : "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg"
            }
          >
            Transactions
          </Link>
          <a
            onClick={() => {
              navigate(`/professional/chat`);
              // setactive('chat')
            }}
            className={
              active == "chat"
                ? "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg"
                : "block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg"
            }
          >
            Messages
          </a>
          <div className="relative" onClick={toggleDropdown}>
            {/* <button className="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:block hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
              <span>Dropdown</span>
              <svg id="dropdownIcon" fill="currentColor" viewBox="0 0 20 20" className={`inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <path id="dropdownPath" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button> */}
            <div
              id="dropdownMenu"
              className={`absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <div className="px-2 py-2 bg-white rounded-md shadow dark-mode:bg-gray-800">
                <a
                  className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                  href="#"
                >
                  Link #1
                </a>
                <a
                  className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                  href="#"
                >
                  Link #2
                </a>
                <a
                  className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                  href="#"
                >
                  Link #3
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default sidebar;
