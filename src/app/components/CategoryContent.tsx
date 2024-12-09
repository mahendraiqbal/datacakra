import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  PlusCircle as AddIcon,
  Edit2 as EditIcon,
  Trash2 as DeleteIcon,
  List as CategoryIcon,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  documentId: number;
}

export default function CategoryContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please login again.");
        return;
      }

      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await axiosInstance.get<{ data: Category[] }>(
        "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories"
      );
      setCategories(response.data.data);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const { value: categoryName } = await Swal.fire({
      title: "Add New Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Enter category name",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (categoryName) {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Token not found. Please login again.",
        });
        return;
      }

      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories",
          { data: { name: categoryName } }
        );

        Swal.fire({
          icon: "success",
          title: "Category Added",
          text: `Category "${categoryName}" has been added successfully!`,
        });

        setCategories((prevCategories) => [
          ...prevCategories,
          response.data.data,
        ]);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Add Failed",
          text: "Failed to add category. Please try again later.",
        });
      }
    }
  };

  const handleEditCategory = async (category: Category) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Category",
      input: "text",
      inputLabel: "Category Name",
      inputValue: category.name,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Category name is required!";
        }
      },
    });

    if (formValues) {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Token not found. Please login again.",
        });
        return;
      }

      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.put(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories/${category.documentId}`,
          { data: { name: formValues } }
        );

        Swal.fire({
          icon: "success",
          title: "Category Updated",
          text: `Category "${response.data.data.name}" has been updated successfully!`,
        });

        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === category.id
              ? { ...cat, name: response.data.data.name }
              : cat
          )
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update category. Please try again later.",
        });
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the category "${category.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Token not found. Please login again.",
        });
        return;
      }

      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await axiosInstance.delete(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories/${category.documentId}`
        );

        Swal.fire({
          icon: "success",
          title: "Category Deleted",
          text: `Category "${category.name}" has been deleted successfully!`,
        });

        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== category.id)
        );
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete category. Please try again later.",
        });
      }
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const currentCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <CategoryIcon className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Category Management
          </h2>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <AddIcon className="w-5 h-5" />
          <span>Add Category</span>
        </button>
      </div>

      <p className="text-gray-500 mb-4">Manage your categories below.</p>

      {isLoading ? (
        <div className="text-center text-gray-600">Loading categories...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : currentCategories.length === 0 ? (
        <div className="text-center text-gray-500">No categories found</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {currentCategories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <span className="text-gray-800 font-medium">{category.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <DeleteIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
