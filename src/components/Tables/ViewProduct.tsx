import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "@auth0/auth0-react";
import config from "../../config/config";

const ViewProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  useEffect(() => {
    const fetchProductByID = async () => {
      try {
        const response = await axios.post(
          `${config.VENDOR_BASE_URL}/product/select-product/${id}`
        );

        if (response.status === 200) {
          setProductData(response.data.product);
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

  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Product" />
      {productData && (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Product Details
                </h3>
              </div>
              <form action="#">
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
                      value={productData.product_name}
                      disabled
                    />
                  </div>

                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-black dark:text-white">
                        Select Category
                      </label>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        value={productData.category_id}
                        disabled
                      >
                        <option
                          value=""
                          className="text-body dark:text-bodydark"
                        >
                          Select Country
                        </option>
                        {categoryList.map((category, index) => (
                          <option
                            key={index}
                            value={category._id} // Use the appropriate value for each option
                            className="text-body dark:text-bodydark"
                          >
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-black dark:text-white">
                        Select Sub Category
                      </label>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                        disabled
                        value={productData.sub_category_id}
                      >
                        <option
                          value=""
                          className="text-body dark:text-bodydark"
                        >
                          Select Country
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
                        value={productData.original_price}
                        disabled
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
                        value={productData.selling_price}
                        disabled
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
                        value={productData.quantity}
                        disabled
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
                        value={productData.label_tags}
                        disabled
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
                      value={productData.product_content}
                      disabled
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
                      value={productData.product_specification}
                      disabled
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
                        value={productData.brand}
                        disabled
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
                        value={productData.colors}
                        disabled
                      />
                    </div>
                  </div>

                  {productData.images.map((image, index) => (
                    <div
                      className="mb-4.5 flex flex-col gap-6 xl:flex-row"
                      key={index}
                    >
                      <img src={image} alt={`image-${index}`} width={260} />
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ViewProduct;
