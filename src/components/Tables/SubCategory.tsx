import axios from "axios";
import { useState, useEffect } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import config from "../../config/config";
const alertNotificationFunction = (alertType, sMessage) => {
  NotificationManager[alertType](`${sMessage}`);
};

const SubCategories = () => {
  //FOR SUBCATEGORY
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [currentSubCategoryPage, setCurrentSubCategoryPage] = useState(1);
  const [totalSUbCategoryPage, setTotalSubCategoryPage] = useState(1);
  const [subCategoryPerPage, setSubCategoryPerPage] = useState(10);

  const [addSubCategorySuccess, setAddSubCategorySuccess] = useState(false);
  const [updateSubCategorySuccess, setUpdateSubCategorySuccess] =
    useState(false);
  const [deleteSubCategorySuccess, setDeleteSubCategorySuccess] =
    useState(false);
  const [searchSubCategory, setSearchSubCategory] = useState("");

  //FOR UPDATE SUBCATEGORY

  const [formUpdateSubCategory, setFormUpdateSubCategory] = useState({
    iUpdateSubCategoryID: "",
    iUpdateCategoryID: "",
    sUpdateSubCategoryName: "",
  });

  const handleUpdateSubCategoryInput = (event) => {
    const { name, value } = event.target;
    setFormUpdateSubCategory({ ...formUpdateSubCategory, [name]: value });
  };

  const handleSubmitUpdateSubCategory = async (event) => {
    event.preventDefault();
    const iUpdateSubCategoryID = formUpdateSubCategory.iUpdateSubCategoryID;
    const sUpdateSubCategoryName = formUpdateSubCategory.sUpdateSubCategoryName;

    if (sUpdateSubCategoryName == "") {
      alertNotificationFunction("info", "Please add Sub Category");
      return false;
    } else {
      const response = await axios.patch(
        `${config.VENDOR_BASE_URL}/subCategory/update-sub-category/${iUpdateSubCategoryID}`,
        formUpdateSubCategory
      );

      if (response.statusText == "OK") {
        setUpdateSubCategorySuccess(true);
        alertNotificationFunction(
          "success",
          "Your sub Category Update Successfully"
        );
        setIsUpdateSubCategoryModalOpen(false);
      } else {
        alertNotificationFunction(
          "error",
          "Your sub Category not Update Successfully"
        );
      }
    }
  };

  // DELETE SUB CATEGORY
  const handleDeleteSubCategory = async (subCategoryID) => {
    const confirmDelete = () => {
      return new Promise((resolve) => {
        confirmAlert({
          title: "Confirm to delete",
          message: "Are you sure you want to delete this SUb Category ?",
          buttons: [
            {
              label: "Yes",
              onClick: () => resolve(true),
            },
            {
              label: "No",
              onClick: () => resolve(false),
            },
          ],
        });
      });
    };
    const connfirm = await confirmDelete();
    if (connfirm) {
      try {
        const response = await axios.delete(
          `${config.VENDOR_BASE_URL}/subCategory/delete-sub-category/${subCategoryID}`
        );
        if (response.statusText == "OK") {
          alertNotificationFunction(
            "success",
            "Your Sub Category is Deleted Successfully"
          );
          setDeleteSubCategorySuccess(true);
        } else {
          alertNotificationFunction(
            "error",
            "Something went Wong while Delete the sub category"
          );
        }
      } catch (error) {
        alertNotificationFunction(
          "error",
          "An error occurred while deleting the sub category."
        );
      }
    } else {
      alertNotificationFunction("info", "Deletion cancelled");
    }
  };

  //SUB CATEGORY
  useEffect(() => {
    const fetchSubCategoryData = async () => {
      try {
        const response = await axios.post(
          `${config.VENDOR_BASE_URL}/subCategory/select-sub-category?page=${currentSubCategoryPage}&limit=${subCategoryPerPage}&search=${searchSubCategory}`
        );
        if (response.statusText == "OK") {
          setSubCategoryList(response.data.subCategories);
          setTotalSubCategoryPage(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching sub categories", error);
      }
    };
    fetchSubCategoryData();
  }, [
    currentSubCategoryPage,
    searchSubCategory,
    addSubCategorySuccess,
    updateSubCategorySuccess,
    deleteSubCategorySuccess,
  ]);

  // const paginate = (pageNumber) => setCurrentSubCategoryPage(pageNumber);
  // const nextPage = () =>
  //   setCurrentSubCategoryPage((prev) =>
  //     Math.min(prev + 1, totalSUbCategoryPage),
  //   );
  // const prevPage = () =>
  //   setCurrentSubCategoryPage((prev) => Math.max(prev - 1, 1));

  // FOR ADD SUB CATEGORY MODAL
  const [isAddSubCategoryModalOpen, setIsAddSubCategoryModalOpen] =
    useState(false);

  const toggleAddSubCategoryModal = () => {
    setIsAddSubCategoryModalOpen(!isAddSubCategoryModalOpen);
    setCurrentSubCategoryPage(0);
    setTotalSubCategoryPage(20);
    setSubCategoryPerPage(20);
  };

  // FOR UPDATE SUB CATEGORY MODAL
  const [isUpdateSubCategoryModalOpen, setIsUpdateSubCategoryModalOpen] =
    useState(false);

  const toggleUpdateSubCategoryModal = async (subCategoryID) => {
    setIsUpdateSubCategoryModalOpen(!isUpdateSubCategoryModalOpen);
    if (!isUpdateSubCategoryModalOpen) {
      const response = await axios.post(
        `${config.VENDOR_BASE_URL}/subCategory/select-sub-category/${subCategoryID}`
      );
      if (response.statusText == "OK") {
        setFormUpdateSubCategory({
          iUpdateSubCategoryID: response.data._id,
          iUpdateCategoryID: response.data.category_id,
          sUpdateSubCategoryName: response.data.sub_category_name,
        });
      } else {
        alertNotificationFunction(
          "error",
          "Something went Wong, Sub Category Not Found"
        );
      }
    }
  };

  // FOR ADD SUBCATEGORY
  const [formAddSubCategory, setFormAddSubCategory] = useState({
    iCategoryIDForAdd: "",
    sNameAddSubCategory: "",
  });

  const handleAddSubCategoryInput = (event) => {
    const { name, value } = event.target;
    setFormAddSubCategory({ ...formAddSubCategory, [name]: value });
  };

  const handleSubmitAddSubCategory = async (event) => {
    event.preventDefault();
    if (formAddSubCategory.iCategoryIDForAdd == "") {
      alertNotificationFunction("info", "Please Select category");
      return false;
    }
    if (formAddSubCategory.sNameAddSubCategory == "") {
      alertNotificationFunction("info", "Please add Sub Category");
      return false;
    }

    const response = await axios.post(
      `${config.VENDOR_BASE_URL}/subCategory/add-sub-category`,
      formAddSubCategory
    );
    console.log(response);
    if (response.status == 201 && response.statusText == "Created") {
      setAddSubCategorySuccess(true);
      alertNotificationFunction(
        "success",
        "Your Sub Category Added Successfully"
      );
      setIsAddSubCategoryModalOpen(false);
      setFormAddSubCategory({
        iCategoryIDForAdd: "",
        sNameAddSubCategory: "",
      });
    }
  };

  const handleSearchSubCategory = (e) => {
    setTimeout(() => {
      setSearchSubCategory(e.target.value);
    }, 1000);
  };

  // GET CATEGORY
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.post(
          `${config.VENDOR_BASE_URL}/category/select-category?page=0&limit=100`
        );
        if (response.statusText == "OK") {
          setCategoryList(response.data.categories);
        } else {
          console.error("Failed to fetch category data");
        }
      } catch (error) {
        console.error("Error fetching user category:", error);
      }
    };
    fetchCategoryData();
  }, [isAddSubCategoryModalOpen, isUpdateSubCategoryModalOpen]);

  const handleSubCategoryPageChange = (page) => {
    setCurrentSubCategoryPage(page);
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        {/* <!-- Sign In Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {/* TABLE */}

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Sub Category List
              </h4>
              <input
                type="text"
                placeholder="Search Sub Category ..."
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleSearchSubCategory}
              ></input>
              <div className="flex space-x-4">
                <button
                  onClick={toggleAddSubCategoryModal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                >
                  Add New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-1 flex items-center">
                <p className="font-medium">No.</p>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="font-medium">Category</p>
              </div>
              <div className="col-span-3 flex items-center">
                <p className="font-medium">Sub Category</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Action</p>
              </div>
            </div>

            {subCategoryList.map((subCategory, index) => {
              const categoryName =
                categoryList.find(
                  (category) => category._id === subCategory.category_id
                )?.category_name || "Unknown Category";
              return (
                <div
                  className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                  key={subCategory._id}
                >
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {index + 1}
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {categoryName}
                    </p>
                  </div>
                  <div className="col-span-3 hidden items-center sm:flex">
                    <p className="text-sm text-black dark:text-white">
                      {subCategory.sub_category_name}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() =>
                          toggleUpdateSubCategoryModal(subCategory._id)
                        }
                      >
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-primary"
                        onClick={() => handleDeleteSubCategory(subCategory._id)}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill=""
                          />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill=""
                          />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill=""
                          />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <ul className="flex">
                {/* First Button */}
                {currentSubCategoryPage > 2 && (
                  <li>
                    <button
                      onClick={() => handleSubCategoryPageChange(1)}
                      className="text-gray-500 hover:bg-gray-200 font-medium px-4 py-2 mx-1 rounded-md"
                    >
                      First
                    </button>
                  </li>
                )}

                {/* Prev Button */}
                {currentSubCategoryPage > 1 && (
                  <li>
                    <button
                      onClick={() =>
                        handleSubCategoryPageChange(currentSubCategoryPage - 1)
                      }
                      className="text-gray-500 hover:bg-gray-200 font-medium px-4 py-2 mx-1 rounded-md"
                    >
                      Prev
                    </button>
                  </li>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalSUbCategoryPage }, (_, index) => {
                  const pageNumber = index + 1;

                  // Only show 3 page numbers around the current page
                  if (
                    pageNumber >= currentSubCategoryPage - 1 &&
                    pageNumber <= currentSubCategoryPage + 1
                  ) {
                    return (
                      <li key={index}>
                        <button
                          onClick={() =>
                            handleSubCategoryPageChange(pageNumber)
                          }
                          className={`${
                            currentSubCategoryPage === pageNumber
                              ? "bg-gray-800 text-black"
                              : "text-gray-500 hover:bg-gray-200"
                          } font-medium px-4 py-2 mx-1 rounded-md`}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}

                {/* Next Button */}
                {currentSubCategoryPage < totalSUbCategoryPage && (
                  <li>
                    <button
                      onClick={() =>
                        handleSubCategoryPageChange(currentSubCategoryPage + 1)
                      }
                      className="text-gray-500 hover:bg-gray-200 font-medium px-4 py-2 mx-1 rounded-md"
                    >
                      Next
                    </button>
                  </li>
                )}

                {/* Last Button */}
                {currentSubCategoryPage < totalSUbCategoryPage - 1 && (
                  <li>
                    <button
                      onClick={() =>
                        handleSubCategoryPageChange(totalSUbCategoryPage)
                      }
                      className="text-gray-500 hover:bg-gray-200 font-medium px-4 py-2 mx-1 rounded-md"
                    >
                      Last | {totalSUbCategoryPage}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* END TABLE */}
        </div>
      </div>

      {/* FOR ADD SUB CATEGORY MODAL*/}
      <div>
        {isAddSubCategoryModalOpen && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Sub Category
                </h3>
                <button
                  onClick={toggleAddSubCategoryModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>

              <form
                className="p-4 md:p-5"
                onSubmit={handleSubmitAddSubCategory}
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 ">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      name="iCategoryIDForAdd"
                      value={formAddSubCategory.iCategoryIDForAdd}
                      onChange={handleAddSubCategoryInput}
                    >
                      <option>Select category</option>
                      {categoryList.map((Category, index) => (
                        <option key={index} value={Category._id}>
                          {Category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sub Category Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Sub Category Name"
                      name="sNameAddSubCategory"
                      value={formAddSubCategory.sNameAddSubCategory}
                      onChange={handleAddSubCategoryInput}
                    />
                  </div>
                </div>
                <br />
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* FOR UPDATE SUB CATEGORY MODAL*/}
      <div>
        {isUpdateSubCategoryModalOpen && (
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Sub Category
                </h3>
                <button
                  onClick={toggleUpdateSubCategoryModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>

              <form
                className="p-4 md:p-5"
                onSubmit={handleSubmitUpdateSubCategory}
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 ">
                    <input
                      type="hidden"
                      id="subCategoryID"
                      name="iUpdateSubCategoryID"
                      value={formUpdateSubCategory.iUpdateSubCategoryID}
                      onChange={handleUpdateSubCategoryInput}
                    />
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      name="iUpdateCategoryID"
                      value={formUpdateSubCategory.iUpdateCategoryID}
                      onChange={handleUpdateSubCategoryInput}
                    >
                      <option>Select category</option>
                      {categoryList.map((Category, index) => (
                        <option key={index} value={Category._id}>
                          {Category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sub Category Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Sub Category Name"
                      name="sUpdateSubCategoryName"
                      value={formUpdateSubCategory.sUpdateSubCategoryName}
                      onChange={handleUpdateSubCategoryInput}
                    />
                  </div>
                </div>
                <br />
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubCategories;
