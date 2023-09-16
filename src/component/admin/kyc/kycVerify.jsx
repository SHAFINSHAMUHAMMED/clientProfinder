import React, { useState, useEffect } from "react";
import AdminAxiosInterceptor from "../../../Axios/adminAxios";
function kycVerify() {
  const [Kyc, setKyc] = useState([]);
  const [Update, setUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const adminAxios = AdminAxiosInterceptor();

  useEffect(() => {
    adminAxios
      .get("/kycRequests")
      .then((res) => {
        if (res?.data?.status) {
          const formattedKycData = res.data.data.flatMap((item) => {
            return item.kyc
              .filter((kycItem) => !kycItem.verified)
              .map((kycItem) => ({
                name: kycItem.name,
                email: item.email,
                role: kycItem.role,
                userid: kycItem.userId,
                proid: kycItem.proId,
                image: kycItem.image,
                id: kycItem._id,
              }));
          });
          setKyc(formattedKycData);
        }
      })
      .catch((error) => {
        console.error("Error fetching KYC data:", error);
      });
  }, [Update]);

  const handleVerify = (id, user, pro, role) => {
    adminAxios
      .patch("/kycVerify", { id: id, userId: user, proId: pro, role: role })
      .then((res) => {
        if (res.status) {
          setUpdate(!Update);
        }
      });
  };

  const handleReject = (id, user, pro, role) => {
    adminAxios
      .patch("/rejectkyc", { id: id, userId: user, proId: pro, role: role })
      .then((res) => {
        if (res.data.status) {
          setUpdate(!Update);
        }
      });
  };

  const handleViewImage = (imageURL) => {
    console.log(imageURL);
    setSelectedImage(imageURL);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="p-2 sm:p-20">
      <h3 className="text-center font-bold text-2xl mb-5 sm:mb-20">
        Verify KYC
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr>
              <th className="border text-left py-2 px-3">Name</th>
              <th className="border text-left py-2 px-3">Role</th>
              <th className="border text-left py-2 px-3">Contact</th>
              <th className="border text-center py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Kyc.map((item, index) => (
              <tr key={index}>
                <td className="border py-2 px-3">{item.name}</td>
                <td className="border py-2 px-3">{item.role}</td>
                <td className="border py-2 px-3">{item.email}</td>
                <td className="border py-2 px-3">
                  <div className=" sm:flex justify-center">
                    <button
                      onClick={() =>
                        handleReject(
                          item.id,
                          item.userid,
                          item.proid,
                          item.role
                        )
                      }
                      className="bg-red-500 text-white px-2 py-1 sm:mr-2 w-16 mb-2 sm:mb-0 rounded-lg"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleVerify(
                          item.id,
                          item.userid,
                          item.proid,
                          item.role
                        )
                      }
                      className="bg-green-500 text-white px-2 py-1 sm:mr-2 w-16 mb-2 sm:mb-0 rounded-lg"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleViewImage(item.image)}
                      className="bg-blue-500 text-white px-2 py-1 sm:mr-2 w-16 mb-2 sm:mb-0 rounded-lg"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-800 opacity-70"
            onClick={closeModal}
          ></div>
          <div className="bg-white p-4 rounded-lg shadow-lg z-10">
            <img src={selectedImage} alt="View" />
            <button
              className="bg-blue-500 text-white px-2 py-1 mt-2"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default kycVerify;
