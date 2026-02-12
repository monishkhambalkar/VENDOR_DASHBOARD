import Breadcrumb from "../Breadcrumbs/Breadcrumb";

import DefaultLayout from "../../layout/DefaultLayout";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config/config";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  let navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjVhZmViODI3OTM0YzRkNDI3NzVkZmYiLCJpYXQiOjE3MjE3NzAxMTgsImV4cCI6MTcyMjM3NDkxOH0.CMzIWRfGpj53bwJ6ieQhV11ubu9BoxvDftnoDIFqmr0";

  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    sub_category_id: "",
    original_price: "",
    selling_price: "",
    quantity: "",
    label_tags: "",
    product_content: "",
    product_specification: "",
    brand: "",
    colors: "",
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.sProductName == "")
      alertNotificationFunction("info", "Please input Product Name");
    if (formData.iCategory == "")
      alertNotificationFunction("info", "Please Select Category");
    if (formData.iSubCategory == "")
      alertNotificationFunction("info", "Please select Sub Category");
    if (formData.iSellingPrice == "")
      alertNotificationFunction("info", "Please input Selling Price");
    if (formData.sQty == "")
      alertNotificationFunction("info", "Please input Quantity");

    const formDataToSend = new FormData();
    formDataToSend.append("sProductName", formData.product_name);

    formDataToSend.append("iCategory", formData.category_id);
    formDataToSend.append("iSubCategory", formData.sub_category_id);
    formDataToSend.append("iOriginalPrice", formData.original_price);
    formDataToSend.append("iSellingPrice", formData.selling_price);
    formDataToSend.append("sQty", formData.quantity);
    formDataToSend.append("sTags", formData.label_tags);
    formDataToSend.append("sProductContent", formData.product_content);
    formDataToSend.append(
      "sProductSpecification",
      formData.product_specification
    );
    formDataToSend.append("sBrand", formData.brand);
    formDataToSend.append("sColor", formData.colors);

    formData.images.forEach((file, index) => {
      if (file) {
        formDataToSend.append("file", file);
      }
    });

    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.patch(
        `${config.VENDOR_BASE_URL}/product/update-product/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + accessToken,
          },
        }
      );

      if (response.status === 200 && response.statusText == "OK") {
        alertNotificationFunction("success", "Product updated successfully");
        navigate("/products");
      }
    } catch (error) {
      alertNotificationFunction("error", "Error updating product");
      console.error("Error updating product:", error);
    }
  };

  useEffect(() => {
    const fetchProductByID = async () => {
      try {
        const response = await axios.post(
          `${config.VENDOR_BASE_URL}/product/select-product/${id}`
        );

        if (response.status === 200) {
          setProductData(response.data.product);
          setFormData(response.data.product);
        }
      } catch (error) {
        console.log("Error while getting product ", error);
      }
    };

    fetchProductByID();
  }, [id]);

  useEffect(() => {
    const fetchCategory = async () => {
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
    fetchCategory();

    const fetchSubCategoryData = async () => {
      try {
        const response = await axios.post(
          `${config.VENDOR_BASE_URL}/subCategory/select-sub-category?page=1&limit=100`
        );
        if (response.statusText == "OK") {
          setSubCategoryList(response.data.subCategories);
        }
      } catch (error) {
        console.error("Error fetching sub categories", error);
      }
    };
    fetchSubCategoryData();
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Update Product" />
      {formData && (
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
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-black dark:text-white">
                        Category
                      </label>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        name="category_id"
                        value={formData.category_id}
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
                        {categoryList.map((category, index) => (
                          <option
                            key={index}
                            value={category._id}
                            className="text-body dark:text-bodydark"
                          >
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-black dark:text-white">
                        Sub Category
                      </label>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        name="sub_category_id"
                        value={formData.sub_category_id}
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
                          <option
                            key={index}
                            value={subCategory._id}
                            className="text-body dark:text-bodydark"
                          >
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
                      </label>
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Selling Price
                      </label>
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        name="selling_price"
                        value={formData.selling_price}
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
                        name="quantity"
                        value={formData.quantity}
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
                        name="label_tags"
                        value={formData.label_tags}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Content <span className="text-meta-1">*</span>
                    </label>
                    <textarea
                      placeholder="Product Content"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="product_content"
                      value={formData.product_content}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Product Specification{" "}
                      <span className="text-meta-1">*</span>
                    </label>
                    <textarea
                      placeholder="size / specification / hight / width / "
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="product_specification"
                      value={formData.product_specification}
                      onChange={handleInputChange}
                      rows={4}
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
                        name="brand"
                        value={formData.brand}
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
                        name="colors"
                        value={formData.colors}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {formData.images && (
                    <div>
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Image ${index + 1}`}
                          height="100px"
                          width="600px"
                        />
                      ))}
                    </div>
                  )}

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Main Image
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
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <NotificationContainer />
    </DefaultLayout>
  );
};

export default UpdateProduct;
