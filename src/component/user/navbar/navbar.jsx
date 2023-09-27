import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { UserLogout } from "../../../Redux/userState";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import userAxiosInstance from "../../../Axios/userAxios";
// import Cookies from "js-cookie";
// import { decodeJwt } from "jose";

export default function Example() {
  const navigation = [
    { name: "Home", href: "#", current: true },
    { name: "Services", href: "#", current: false },
    { name: "Chat", href: "#", current: false },
    { name: "Contact", href: "#", current: false },
  ];

  function classNames(...classNamees) {
    return classNamees.filter(Boolean).join(" ");
  }
  let username = "";
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [userData, setuserData] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.Token);
  const userPhoto = useSelector((state) => state.user.Image);
  username = useSelector((state) => state.user.UserName);
  const userAxios = userAxiosInstance();
  // let userid = null;
  // if (username) {
  let userid = useSelector((state) => state.user.Id);
  // }
  // const isTokenExpired = () => {
  //   const token = Cookies.get("token");
  //   if (token) {
  //     const decodedToken = decodeJwt(token);
  //     const currentTimestamp = Date.now() / 1000;
  //     return decodedToken.exp < currentTimestamp;
  //   }
    // return true; // If there's no token, it is expired
  // };
  // useEffect(() => {
  //   const expired = isTokenExpired();
  //   if (expired) {
  //     dispatch(UserLogout());
  //     navigate("/login");
  //   }
  // }, []);
  const logout = async () => {
    if (username) {
      dispatch(UserLogout());
      userid = null;
      setuserData(null);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };
  

  const updatedNavigation = navigation.map((item, index) => ({
    ...item,
    current: index === activeIndex,
  }));
  const handleClick = (index, href) => {
    setActiveIndex(index);
    navigate(href);
  };
  useEffect(() => {
    if (userid) {
      userAxios
        .get(`/userDetails?userId=${userid}`)
        .then((res) => {
          const data = res.data.data;
          if (data) {
            if (data.isBlocked) {
              dispatch(UserLogout());
            } else {
              setuserData(data);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.status == 404) {
            navigate("/*");
          } else if (error?.response?.status == 500) {
            navigate("/serverError");
          } else {
            navigate("/serverError");
          }
        });
    }
  }, []);

  const handleWalletClick = () => {
    // Use the navigate function to navigate to /wallet and pass data
    navigate("/wallet");
  };

  return (
    <Disclosure as="nav" className="bg-gray-100">
      {({ open }) => (
        <>
          <div className="mx-4 sm:mx-8 max-w-full h-16  sm:px-10 lg:px-10">
            <div className="relative flex items-center  justify-between h-16">
              {/* NavBar Button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo (centered on small screens) */}
              <img
                onClick={()=>navigate('/')}
                className="h-10 w-auto sm:hidden"
                src="/loginpage/logo2.png"
                alt="My Company"
              />

              {/* Show the second logo for screens md and larger */}
              <img
                onClick={()=>navigate('/')}
                className="h-10 w-auto hidden sm:block"
                src="/loginpage/logo2.png"
                alt="My Company"
              />

              {/* Navigation (hidden on small screens) */}
              <div className="hidden md:block sm:ml-6">
                <div className="flex space-x-4">
                  {updatedNavigation.map((item, index) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(index, item.href);
                        if (item.name === "Home") {
                          navigate("/");
                        } else if (item.name === "Services") {
                          navigate("/Services ");
                        } else if (item.name === "Chat") {
                          navigate("/chat");
                        } else if (item.name === "Contact") {
                          navigate("/contact");
                        }
                      }}
                      className={classNames(
                        item.current
                          ? "bg-white-600 text-blue-600"
                          : "text-blue-600 hover:bg-gray-700 hover:text-red-700",
                        "rounded-md px-5 py-3 text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Notification and Profile */}
              <div className="flex items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  {/* ... Profile dropdown content ... */}
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          className="h-6 w-6 sm:h-9 sm:w-9 rounded-full"
                          alt="User Profile"
                        />
                      ) : userData && userData.image ? (
                        <img
                          src={userData.image}
                          className="h-6 w-6 sm:h-9 sm:w-9 rounded-full"
                          alt="User Profile"
                        />
                      ) : (
                        <img
                          src="/icons/man.png"
                          className="sm:h-9 w-9 rounded-full"
                          alt="Default Profile"
                        />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to={"/profile"}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Your Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={handleWalletClick}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Wallet
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={logout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {username ? "Sign out" : "sign In"}
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
                {/* end of profile dropdown */}
                {username ? (
                  <div>
                    <h3 className="text-gray-70000 ms-3  sm:block text-xs sm:text-base md:text-base">
                      {username}
                    </h3>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-gray-300 ms-3 hidden sm:block text-base md:text-base">
                      UserName
                    </h3>
                  </div>
                )}

                <div className="hidden  sm:ml-6 sm:flex">
                  {/* Login button */}
                  {/* <button
    type="button" onClick={logout}
    className="border border-indigo-500 md:w-15 bg-indigo-500 text-white rounded-md px-4 py-1 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
  >
    Login
  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu content (hidden on large screens) */}
          <Disclosure.Panel className="md:hidden">
            <div className="flex flex-col space-y-1">
              {updatedNavigation.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(index, item.href);
                    if (item.name === "Home") {
                      navigate("/");
                    } else if (item.name === "Services") {
                      navigate("/Services");
                    } else if (item.name === "Chat") {
                      navigate("/chat");
                    } else if (item.name === "Contact") {
                      navigate("/contact");
                    }
                  }}
                  className={classNames(
                    item.current
                      ? "bg-white-600 text-blue-600"
                      : "text-blue-600 hover:bg-gray-700 hover:text-red-700",
                    "rounded-md px-5 py-3 text-sm font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
