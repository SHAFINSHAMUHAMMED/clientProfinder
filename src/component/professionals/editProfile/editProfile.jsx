import React, { useState, useEffect } from "react";
import proAxiosInstance from "../../../Axios/professionalsAxios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { proImage } from "../../../Redux/professionalsState";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { CgSpinner } from "react-icons/cg";

function EditProfile({
  role,
  closePopup,
  userData,
  updateUserData,
  update,
  count,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const proAxios = proAxiosInstance();
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector((state) => state.professional.Token);
  const proId = useSelector((store) => store.professional.proId);
  const [Cat, setCat] = useState("");
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill: "", _id: null });
  const [description, setDescription] = useState("");

  const [formdata, setFormdata] = useState({
    phone: userData.phone,
    name: userData.name,
    file: userData.image,
    partTime: userData.charge.partime,
    fullTime: userData.charge.fulltime,
    // category: userData.category,
    skills: userData.skills,
    description: userData.description,
  });
  const handleNameChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      name: value,
    }));
  };

  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      phone: value,
    }));
  };
  const handlePartimeChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      partTime: value,
    }));
  };
  const handleFulltimeChange = (event) => {
    const { value } = event.target;
    setFormdata((prevData) => ({
      ...prevData,
      fullTime: value,
    }));
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setDescription(value);
    setFormdata((prevData) => ({
      ...prevData,
      description: value,
    }));
  };
  const handleAddSkill = () => {
    if (newSkill.skill.trim() !== "") {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      setFormdata((prevData) => ({
        ...prevData,
        skills: updatedSkills,
      }));
      setNewSkill("");
    }
  };
  const handleDeleteSkill = (index) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    setFormdata((prevData) => ({
      ...prevData,
      skills: updatedSkills,
    }));
  };

  const fetchData = async () => {
    try {
      const res = await proAxios.get("/listCat");
      if (res.data.status) {
        setCat(res.data.category);
      } else {
        navigate("/professional/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!token) {
    navigate("/");
  }
  const changeimg = (event) => {
    const file = event.target.files[0];
    const allowedExtensions = /\.(jpg|jpeg|png)$/i;
    if (!allowedExtensions.test(file.name)) {
      setErrMsg("File Not supported.");
      return;
    }

    setFormdata((prevData) => ({
      ...prevData,
      file: file,
    }));
    setErrMsg("");
  };

  useEffect(() => {}, [formdata.phone, formdata.name, formdata.file]);

  const requestData = {
    id: proId,
    name: formdata.name,
    phone: formdata.phone,
    file: formdata.file,
    // category: formdata.category,
    skills: formdata.skills.map((skill) => skill),
    partTime: formdata.partTime,
    fullTime: formdata.fullTime,
    description: formdata.description,
  };
  console.log(requestData);
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      formdata.name === userData.name &&
      formdata.phone === userData.phone &&
      formdata.file === userData.image &&
      formdata.description === userData.description
    ) {
      // No changes made, display an error message
      setErrMsg("No changes were made.");
      setLoading(false);
      return;
    }
    if (!formdata.name || formdata.name.trim().length < 3) {
      setErrMsg("Enter Valid Name.");
      return;
    }
    if (!formdata.phone || !/^\d{10}$/.test(formdata.phone.toString().trim())) {
      setErrMsg("Phone must be a 10-digit number.");
      return;
    }
    if (!formdata.fullTime || formdata.partTime) {
      setErrMsg("Enter All Charges");
    }
    proAxios
      .post("/proEdit", requestData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.data.status === "success") {
          closePopup(false);
          updateUserData({
            ...userData,
            name: formdata.name,
            phone: formdata.phone,
            image: formdata.file,
            skills: formdata.skills,
            description: formdata.description,
            partTime: formdata.partTime,
            fullTime: formdata.fullTime,
          });
          update(count + 1);
          dispatch(proImage({ image: res.data.image }));
          Toast.fire({
            icon: "success",
            title: "Profile updated",
          }).then(() => {
            navigate("/professional/profile");
          });
        } else {
          closePopup(false);
          Toast.fire({
            icon: "error",
            title: res.data.message,
          }).then(() => {
            navigate("/professional/profile");
          });
        }
      });
  };
  const handleCancelButton = () => {
    closePopup(false);
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

  return (
    <div className="absolute left-1/2 m-auto min-h-screen w-fit flex justify-center items-start">
      <form
        action=""
        onSubmit={handleUpdateProfile}
        encType="multipart/form-data"
      >
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
          <label
            htmlFor="file"
            className="flex flex-col items-center cursor-pointer mb-4"
          >
            <img
              src={
                formdata.file instanceof File
                  ? URL.createObjectURL(formdata.file)
                  : userData.image
                  ? userData.image
                  : "/icons/man.png"
              }
              alt="...."
              className="avatar rounded-full w-20 h-20 mb-2"
            />
            <span className="text-blue-500">Choose Image</span>
          </label>
          <div className="mb-4">
            <input
              type="file"
              name="file"
              accept=".jpg, .jpeg, .png"
              id="file"
              onChange={changeimg}
              className="hidden"
            />
          </div>
          <div className="flex justify-between">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-left font-medium mb-1"
              >
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formdata.name}
                onChange={handleNameChange}
                placeholder="Your Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-left font-medium mb-1"
              >
                Your Dial Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formdata.phone}
                onChange={handlePhoneChange}
                placeholder="Your Dial number"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex">
            {/* <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-left font-medium mb-1"
              >
                Your Category
              </label>
              <input
                type="text"
                name="location"
                id="location"
                defaultValue={formdata.category.name}
                onChange={handleSearchChange}
                placeholder="Your Dial number"
                className="w-full p-2 border rounded"
              />
            </div> */}

            <div className="mb-4">
              <label
                htmlFor="skills"
                className="block text-left font-medium mb-1"
              >
                Your Skills
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  // value={newSkill}
                  onChange={(e) =>
                    setNewSkill({ skill: e.target.value, _id: null })
                  }
                  placeholder="Your Skills"
                  className="w-full p-2 border rounded "
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-gray-500 px-1 h-8  rounded-md -ml-10"
                >
                  add
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="Partime"
                className="block text-left font-medium mb-1"
              >
                Your PartTime Charge
              </label>
              <input
                type="text"
                name="partimeChange"
                value={formdata.partTime}
                onChange={handlePartimeChange}
                placeholder="Your Part Time "
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          {/* {filteredCategories.length > 0 ? (
              <ul className="border border-gray-300 rounded-md overflow-y-auto max-h-36">
                {filteredCategories.map((category) => (
                  <li
                    key={category._id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      handleCategorySelection(category.name),
                        sendId(category._id);
                    }}
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )} */}
          <div className="flex">
            <div className="mb-4">
              <label
                htmlFor="Fullcharge"
                className="block text-left font-medium mb-1"
              >
                Your FullTime Charge
              </label>
              <input
                type="text"
                name="fullimeChange"
                value={formdata.fullTime}
                onChange={handleFulltimeChange}
                placeholder="Your Full Time"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-left font-medium mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Your Description"
              className="w-full p-2 border rounded"
            />
          </div>
          {skills.length > 0 && (
            <div className="mb-4">
              <label className="block text-left font-medium mb-1">
                Added Skills:
              </label>
              <div className="border border-gray-300 rounded p-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-1"
                  >
                    <span>{skill.skill}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(index)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {errMsg && <div className="text-red-500 mb-4">{errMsg}</div>}
          <div className="flex justify-end">
            <button
              className="bg-gray-300 hover:bg-gray-500 text-white py-1 px-2 rounded me-2"
              onClick={handleCancelButton}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              disabled={loading}
            >
              {loading ? (
                <CgSpinner size={20} className="animate-spin mr-2" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
