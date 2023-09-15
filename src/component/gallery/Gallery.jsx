import React, { useState, useEffect } from "react";
import proAxiosInstance from "../../Axios/professionalsAxios";
import { useSelector } from "react-redux";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import FadeLoader from "react-spinners/FadeLoader";

function Gallery() {
  const proAxios = proAxiosInstance();
  const proId = useSelector((store) => store.professional.proId);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [Gallery, setGallery] = useState([]);
  const [Message, setMessgage] = useState("");
  const [IsHovered, setIsHovered] = useState(null);
  const [update, setupdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imgPerPage] = useState(15);
  const navigate = useNavigate();
  useEffect(() => {
    proAxios
      .get(`/getGallery?proId=${proId}`)
      .then((res) => {
        if (res.data.gallery) {
          setGallery(res.data.gallery);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setMessgage(res.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
        if (error?.response?.status == 404) {
          navigate("/professional/*");
        } else if (error?.response?.status == 500) {
          navigate("/professional/serverError");
        } else {
          navigate("/professional/serverError");
        }
      });
    setupdate(false);
  }, [proId, update]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;

    // Filter only valid image
    const validImages = files.filter((file) =>
      allowedExtensions.test(file.name)
    );

    //at least 1 image and at most 5 image
    if (validImages.length > 0) {
      setSelectedImages(validImages.slice(0, 5));
      setIsPopupOpen(true);
    } else {
      alert("No valid images selected.");
    }
  };
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
  const handleUploadToDB = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("proId", proId);
    for (let i = 0; i < selectedImages.length; i++) {
      console.log(selectedImages[i]);
      formData.append(`file`, selectedImages[i]);
    }
    proAxios
      .post("/galleryUpload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        setupdate(true);
        if (res.data.status) {
          Toast.fire({
            icon: "success",
            title: res.data.message,
          }).then(() => {
            setIsPopupOpen(false);
          });
        }
      })
      .catch((error) => {
        console.log(error, "error in uploading");
        if (error?.response?.status == 404) {
          navigate("/professional/*");
        } else if (error?.response?.status == 500) {
          navigate("/professional/serverError");
        } else {
          navigate("/professional/serverError");
        }
      });
  };

  ///delete selected image while upload
  const handleRemoveImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleDeleteImage = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (shouldDelete) {
      setLoading2(id);
      proAxios
        .patch("/deleteImage", { proId: proId, img_id: id })
        .then((res) => {
          if (res.data.status) {
            setLoading2("");
            setupdate(true);
          }
        })
        .catch((error) => {
          setLoading2("");
          console.log("Error:", error);
          if (error?.response?.status == 404) {
            navigate("/professional/*");
          } else if (error?.response?.status == 500) {
            navigate("/professional/serverError");
          } else {
            navigate("/professional/serverError");
          }
        });
    }
  };
  const indexOfLastImg = currentPage * imgPerPage;
  const indexOfFirstImg = indexOfLastImg - imgPerPage;
  const currentImages = Gallery.gallery?.slice(indexOfFirstImg, indexOfLastImg);

  return (
    <div className="gallery-container h-[400px] overflow-y-auto ">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <FadeLoader color="#242ae8" /> {/* Loading spinner */}
        </div>
      ) : (
        <div className={isPopupOpen ? `blur-sm` : `blur-0`}>
          <div className="text-end p-5">
            <button
              className="bg-gray-500 text-white px-2 py-1  "
              onClick={() => document.getElementById("image-upload").click()}
            >
              Upload Images
            </button>
            <input
              type="file"
              name="file"
              id="image-upload"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              multiple
            />
          </div>
          {/* <div className="grid grid-cols-5 gap-2">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`Selected ${index + 1}`}
              className="h-auto w-full rounded-lg my-2"
            />
            <button
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
              onClick={() => handleDeleteImage(index)}
            >
              X
            </button>
          </div>
        ))}
      </div> */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
            {currentImages?.length > 0
              ? currentImages.map((image) => (
                  <div
                    key={image._id}
                    onMouseEnter={() => setIsHovered(image._id)}
                    onMouseLeave={() => setIsHovered(null)}
                    className="relative"
                  >
                    {loading2 === image._id ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CgSpinner
                          size={30}
                          className="animate-spin text-blue-500"
                        />
                      </div>
                    ) : null}
                    <img
                      className="h-32 w-40 sm:h-64 sm:w-64 rounded-lg m-auto"
                      src={image.image}
                      alt=""
                    />
                    {IsHovered === image._id && (
                      <button
                        className="absolute top-2 right-14 sm:right-10 bg-red-500 text-white rounded-full p-1"
                        onClick={() => handleDeleteImage(image._id)}
                      >
                        <FaTrash /> {/* Render the delete icon */}
                      </button>
                    )}
                  </div>
                ))
              : "No Images"}
          </div>
        </div>
      )}
      {/* {console.log(Gallery.gallery.length)} */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(Gallery.gallery?.length / imgPerPage)}
        onPageChange={setCurrentPage}
        page="adminList"
      />
      {isPopupOpen && (
        <div className="popup-content absolute w-3/4 sm:w-3/5 md:w-2/5 lg:w-3/5 bg-slate-300 left-[15%] top-[50%] sm:top-[65%] xl:top-[60%] sm:left-[20%] md:left-[40%] lg:left-[30%] xl:left-[28%] rounded-md">
          <div className="popup-header flex justify-between items-center p-5">
            <h2 className=" ms-2 text-sm sm:text-lg font-semibold">
              Selected Images
            </h2>
            <button
              className="close-popup"
              onClick={() => setIsPopupOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" h-4 w-4 sm:h-6 sm:w-6 me-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="popup-body flex flex-col items-center">
            <div className="selected-images flex justify-center gap-1 p-5">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className=" w-36 h-16 sm:w-48 sm:h-24 rounded-lg my-2"
                  />
                  <button
                    className="absolute bg-orange-600 w-3  top-2 right-1 text-white text-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleUploadToDB}
              encType="multipart/form-data"
              className="popup-footer flex justify-end"
            >
              <button
                type="submit"
                className="bg-blue-500 text-white px-2 py-1 rounded mb-5"
                // onClick={handleUploadToDB}
              >
                {loading ? (
                  <CgSpinner size={20} className="animate-spin mr-2" />
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
