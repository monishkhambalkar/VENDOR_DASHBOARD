import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layout/DefaultLayout";
import React, { useEffect, useState } from "react";
import config from "../../config/config";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const AddProduct = () => {
  let navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjVhZmViODI3OTM0YzRkNDI3NzVkZmYiLCJpYXQiOjE3MjE3NzAxMTgsImV4cCI6MTcyMjM3NDkxOH0.CMzIWRfGpj53bwJ6ieQhV11ubu9BoxvDftnoDIFqmr0";

  useEffect(() => {
    const fetchCategoryData = async () => {
      const response = await axios.post(
        `${config.VENDOR_BASE_URL}/category/select-category`
      );
      if (response.status === 200) {
        setCategoryList(response.data.categories);
      }
    };
    fetchCategoryData();
  }, []);

  const handleSelectCategory = async (e) => {
    const selectedCategoryId = e.target.value;

    if (selectedCategoryId !== "") {
      const response = await axios.post(
        `${config.VENDOR_BASE_URL}/subCategory/select-sub-category-by-category/${selectedCategoryId}`
      );
      if (response.status === 200) {
        if (response.data.length === 0) {
          alertNotificationFunction(
            "info",
            "No Sub Category under this category"
          );
        }
        setSubCategoryList(response.data);
      }
    }
  };

  const [formData, setFormData] = useState({
    sProductName: "",
    iCategory: "",
    iSubCategory: "",
    iOriginalPrice: "",
    iSellingPrice: "",
    sQty: "",
    sTags: "",
    sProductContent: "",
    sProductSpecification: "",
    sBrand: "",
    sColor: "",
    images: [],
  });

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        const index = parseInt(name.replace("sSubImage", "")) || 0;
        updatedImages[index] = files[0];
        return { ...prev, images: updatedImages };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const alertNotificationFunction = (alertType, sMessage) => {
    NotificationManager[alertType](`${sMessage}`);
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("sProductName", formData.sProductName);
    formDataToSend.append("iCategory", formData.iCategory);
    formDataToSend.append("iSubCategory", formData.iSubCategory);
    formDataToSend.append("iOriginalPrice", formData.iOriginalPrice);
    formDataToSend.append("iSellingPrice", formData.iSellingPrice);
    formDataToSend.append("sQty", formData.sQty);
    formDataToSend.append("sTags", formData.sTags);
    formDataToSend.append("sProductContent", formData.sProductContent);
    formDataToSend.append(
      "sProductSpecification",
      formData.sProductSpecification
    );
    formDataToSend.append("sBrand", formData.sBrand);
    formDataToSend.append("sColor", formData.sColor);

    formData.images.forEach((file, index) => {
      if (file) {
        formDataToSend.append("file", file);
      }
    });

    // Show the loader
    showLoader();

    try {
      const response = await axios.post(
        `${config.VENDOR_BASE_URL}/product/add-product`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      // Hide the loader
      hideLoader();

      //console.log(response);
      if (response.status === 201 && response.statusText == "Created") {
        alertNotificationFunction("success", "Product added successfully");
        navigate("/products");
      }
    } catch (error) {
      // Hide the loader
      hideLoader();
      alertNotificationFunction("error", "Error adding product");
      console.error("Error adding product:", error);
    }
  };

  // Functions to show and hide the loader
  function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "block";
    }
  }

  function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
    }
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Add Product" />
      <div
        className="flex space-x-2 justify-center items-center h-screen dark:invert"
        id="loader"
        style={{ display: "none" }}
      >
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Product Details
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Name
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sProductName"
                    value={formData.sProductName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Select Category
                      <span className="text-meta-1">*</span>
                    </label>
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      name="iCategory"
                      value={formData.iCategory}
                      onChange={(e) => {
                        handleInputChange(e);
                        handleSelectCategory(e);
                      }}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select Category
                      </option>
                      {categoryList.map((Category, index) => (
                        <option key={index} value={Category._id}>
                          {Category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-black dark:text-white">
                      Select Sub Category
                      <span className="text-meta-1">*</span>
                    </label>
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      name="iSubCategory"
                      value={formData.iSubCategory}
                      onChange={handleInputChange}
                    >
                      <option
                        value=""
                        disabled
                        className="text-body dark:text-bodydark"
                      >
                        Select Sub Category
                      </option>
                      {subCategoryList.map((subCategory, index) => (
                        <option value={subCategory._id} key={index}>
                          {subCategory.sub_category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Original Price
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="iOriginalPrice"
                      value={formData.iOriginalPrice}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Selling Price
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="iSellingPrice"
                      value={formData.iSellingPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Qty
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="sQty"
                      value={formData.sQty}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Label / Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Label, Tags"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="sTags"
                      value={formData.sTags}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Content
                  </label>
                  <textarea
                    placeholder="Product Content"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sProductContent"
                    value={formData.sProductContent}
                    onChange={handleInputChange}
                    rows={4} // You can adjust the number of rows as needed
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Product Specification
                  </label>
                  <textarea
                    placeholder="size / specification / height / width / "
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sProductSpecification"
                    value={formData.sProductSpecification}
                    onChange={handleInputChange}
                    rows={4} // You can adjust the number of rows as needed
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="Brand"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="sBrand"
                      value={formData.sBrand}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Colors
                    </label>
                    <input
                      type="text"
                      placeholder="Colors"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="sColor"
                      value={formData.sColor}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Main Image
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="file"
                    placeholder="Enter your City"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sMainImage"
                    value={formData.sMainImage}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Sub Image
                  </label>
                  <input
                    type="file"
                    placeholder="Enter your City"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sSubImage1"
                    value={formData.sSubImage1}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Sub Image
                  </label>
                  <input
                    type="file"
                    placeholder="Enter your City"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="sSubImage2"
                    value={formData.sSubImage2}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <NotificationContainer />
    </DefaultLayout>
  );
};

export default AddProduct;
