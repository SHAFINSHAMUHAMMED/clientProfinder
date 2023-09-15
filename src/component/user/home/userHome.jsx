import React, { useEffect, useState } from "react";
import userAxiosInstance from "../../../Axios/userAxios";
import { useDispatch, useSelector } from "react-redux";
import { UserLogout } from "../../../Redux/userState";
import { useNavigate } from "react-router-dom";
import Location from "../../location/location";
import { decodeJwt } from "jose";
import Cookies from "js-cookie";

function userHome() {
  const token = useSelector((store) => store.user.Token);
  const userLocation = useSelector((store) => store.user.location);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userAxios = userAxiosInstance();
  const isTokenExpired = () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeJwt(token);
      const currentTimestamp = Date.now() / 1000;
      return decodedToken.exp < currentTimestamp;
    }
    return true; // If there's no token, it is expired
  };

  const carouselImages = [
    "/banner/background1.png",
    "/banner/background2.png",
    "/banner/background3.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [category, setcategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [Category, setCategory] = useState("");
  const [locationPopupVisible, setLocationPopupVisible] = useState(false);
  const [CatId, setCatId] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages?.length
      );
    }, 4000);

    // Clear the interval when the component unmounts to avoid memory leaks
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const expired = isTokenExpired();
    if (expired) {
      dispatch(UserLogout());
      navigate("/");
    }
    userAxios.get("/getCategory").then((res) => {
      if (res.data.status) {
        setcategory(res.data.category);
      } else {
        setcategory("");
      }
    }).catch((error)=>{
      console.log(error);
    })
    if (token && !userLocation) {
      handleOpenLocationPopup();
    }
  }, [navigate, token]);
  
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = category?.filter((category) =>
      category.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelection = (categoryName) => {
    setCategory(categoryName);
    setSearchQuery(categoryName);
    setFilteredCategories(""); // Clear the search query after selecting a category
  };
  const handleOpenLocationPopup = () => {
    setLocationPopupVisible(true);
  };
  const sendCatId = (id) => {
    setCatId(id);
  };
  // Function to handle closing the location popup
  const handleCloseLocationPopup = () => {
    setLocationPopupVisible(false);
  };

  const searchForm = (e) => {
    e.preventDefault();
    if (
      Category.toLocaleLowerCase() !== searchQuery.toLocaleLowerCase() ||
      Category?.trim().length < 3
    ) {
      console.log("Error please fill correct ");
      return;
    }

    navigate(
      `/Services?Category=${encodeURIComponent(
        Category
      )}&CatId=${encodeURIComponent(CatId)}`
    );
  };
  const handleClick = (type) => {
    const filtered = category?.filter((category) =>
      category.name.toLowerCase().includes(type.toLowerCase())
    );
    const Category = filtered[0].name;
    navigate(`/Services?Category=${encodeURIComponent(Category)}`);
  };

  return (
    <div className=" w-full ">
      <div
        className="absolute right-1 sm:right-10"
        onClick={handleOpenLocationPopup}
      >
        <div className="relative inline-flex items-center">
          <div className="pr-1 text-xs">
            {userLocation ? userLocation : "Location"}
          </div>
          <svg
            xmlns="http://www.w3.org/000/svg"
            className="w-4 h-4 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="flex  w-full h-[20%] sm:h-[30%] md:h-[48%]">
        <img
          className="w-full "
          src={carouselImages[currentImageIndex]}
          alt="Image"
        />

        <div className=" absolute text-left ml-2 lg:ml-11 lg:mt-16 xl:ml-28 xl:mt-28 max-w-sm md:max-w-screen-lg">
          <div className="Heading1 text-blue-600 text-sm font-semibold capitalize leading-loose">
            We Have 1000+ Professionals
          </div>
          <div className=" text-black text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
            Find The{" "}
            <span className="text-blue-600 text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">
              Skilled Professionals
            </span>{" "}
          </div>
          <div className=" text-sky-950 text-lg sm:text-2xl md:text-3xl font-extrabold ">
            That Fits Your Requirement
          </div>
          {/* <div className=" text-sky-950 sm:hidden block text-xs ">
            Explore our extensive network of highly skilled professionals ready
            to provide.
          </div> */}
          <div className=" text-sky-950 hidden sm:block sm:text-xs lg:text-sm mt-2 md:mt-5">
            Explore our extensive network of highly skilled professionals ready
            to provide exceptional
            <br className="sm:block hidden" />
            service and expertise, meeting your diverse employment needs.
          </div>
          <form action="" method="POST" onSubmit={searchForm}>
            <div className="flex bg-white p-1 sm:p-6 mt-2 rounded-lg w-3/5 sm:w-5/6 md:w-full items-center shadow-md max-h-16">
              <div className="flex border rounded mr-1 w-5/6">
                <div className="flex-grow mr-2 w-2/12">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="w-full px-1 sm:px-4 sm:py-2 text-xs sm:text-base rounded-lg focus:outline-none focus:ring"
                  />
                </div>
              </div>

              <div className=" ">
                <button
                  type="submit"
                  name="search"
                  className="w- px-1 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  <span className="text-sm md:text-sm">Submit</span>
                </button>
              </div>
            </div>
            {filteredCategories?.length > 0 ? (
              <ul className="border border-gray-300 rounded-md overflow-y-auto max-h-28 w-1/2"> 
                {filteredCategories?.map((cat) => (
                  <li
                    key={cat._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    value=""
                    onClick={() => {
                      handleCategorySelection(cat.name), sendCatId(cat._id);
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </form>
        </div>
        {/* Banner content */}
      </div>
      {locationPopupVisible && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
          {/* <div className="w-1/2 h-28 bg-sky-200 p-2"> */}
          <Location onCloseLocationPopup={handleCloseLocationPopup} />
          {/* </div> */}
        </div>
      )}

      <div className="flex justify-center mt-5 md:mt-10">
        <div className="">
          <div className="text-center">
            <h3 className="text-xl text-blue-700 font-medium">
              Our Top Categories
            </h3>
          </div>
          <div className="text-center">
            <h1 className="text-[30px] font-bold">Browse By Category</h1>
          </div>
          <div className="text-center mt-2">
            <h5 className="text-[15px] text-gray-600">
              Search Your Required Professionals With Our Categories
            </h5>
          </div>
        </div>
      </div>
      <div className="ms-5 sm:ms-0 mt-10 sm:mt-0 ">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 place-items-center gap-y-8 gap-x-5 ps- , pe-0 sm:p-20">
          <div
            onClick={() => handleClick("ELECTRICIAN")}
            className="col-span-2 items-center bg-white w-30 sm:w-40 "
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/electrician.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Electricians</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("PLUMBER")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/plumber.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Plumbers</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("PAINTING")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/painter.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Painters</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("CARPENTER")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/carpenter.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Carpenters</h2>
                <h2 className="text-xs">200 workers </h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("AC TECHNICIAN")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-8 md:ms-0"
                src="/categories/ac.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">A/C Technicians</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("CLEANING SERVICE")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-8 md:ms-0"
                src="categories/clean.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Cleaning Service</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("INTERIOR DESIGNING")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-8 md:ms-0"
                src="/categories/designer.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Interior Designers</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("FLOORING")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/flooring.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Flooring</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("GENERAL CONTRACTOR")}
            className="col-span-2 bg-white  w-30 sm:w-44"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-8 md:ms-0"
                src="/categories/contractor.png"
                alt=""
              />
              <div>
                <h2 className="text-[13px]">General Contractors</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("ROOFERS")}
            className="col-span-2 bg-white w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-2 md:ms-0"
                src="/categories/roof.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Roofers</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("APPLIENCE REPAIR")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-8 md:ms-0"
                src="/categories/repair-tools.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Applience Repair</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
          <div
            onClick={() => handleClick("LANDSCAPERS")}
            className="col-span-2 bg-white  w-30 sm:w-40"
          >
            <div className="block sm:flex items-center">
              <img
                className="w-8 sm:w-10 flex ms-4 md:ms-0"
                src="/categories/woodcutter.png"
                alt=""
              />
              <div>
                <h2 className="text-sm">Landscapers</h2>
                <h2 className="text-xs">200 workers</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sec 3">
        <div className="sub-1 flex justify-center text-[18px] sm:text-2xl mt-10 sm:mt-0">
          <h1>
            Welcome to <span className="text-blue-600"> Peofessionals</span>{" "}
            Factory
          </h1>
        </div>
        <div className=" sub-2 sm:flex justify-around p-5 sm:p-20">
          <img className="w-full sm:w-3/4 " src="/icons/workers.png" alt="" />
          <div className="grid grid-col-4 place-items-center mt-8">
            <div className="1row col-span-2 flex gap-4">
              <div className=" sm:w-36 lg:w-48">
                <img
                  className="h-14 sm:h-20 m-auto"
                  src="/icons/people.png"
                  alt=""
                />
                <h4 className="text-center text-sm lg:text-base">
                  More than 10k visitors every day
                </h4>
              </div>
              <div className="sm:w-36 lg:w-48">
                <img
                  className=" h-14 sm:h-20 m-auto"
                  src="/icons/handshake.png"
                  alt=""
                />
                <h4 className="text-center text-sm lg:text-base">
                  Leading professional service providers
                </h4>
              </div>
            </div>
            <div className="2row col-span-2 flex gap-4">
              <div className="sm:w-36 lg:w-48">
                <img
                  className="h-14 sm:h-20 m-auto"
                  src="/icons/support.png"
                  alt=""
                />
                <h4 className="text-center text-sm lg:text-base">
                  Dedicated and free Support
                </h4>
              </div>
              <div className="sm:w-36 lg:w-48">
                <img
                  className="h-14 sm:h-20 m-auto"
                  src="/icons/target.png"
                  alt=""
                />
                <h4 className="text-center text-sm lg:text-base">
                  Only relevent and verified workers
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default userHome;
