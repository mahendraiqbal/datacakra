import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Edit, Trash2, PlusCircle } from "lucide-react";

interface Category {
  id: number;
  documentId: string;
  name: string;
  description: null | string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null | string;
}

interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null | string;
  category: Category | null;
}

export default function ArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(articles.length / itemsPerPage);

  // Fetch Articles and Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Create axios instance with authorization header
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch articles with category population
        const articlesResponse = await axiosInstance.get<{
          data: Article[];
        }>(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles?populate[category]=*"
        );

        // Fetch categories
        const categoriesResponse = await axiosInstance.get<{
          data: Category[];
        }>("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories");

        // Set articles and categories from the response data
        setArticles(articlesResponse.data.data);
        setCategories(categoriesResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch articles or categories",
        });
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading articles...</p>
      </div>
    );
  }

  // Add Article Handler
  const handleAddArticle = async () => {
    const { value: formValues, isDismissed } = await Swal.fire({
      title: "Add New Article",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Title">
        <textarea id="swal-input2" class="swal2-input" placeholder="Description"></textarea>
        <input id="swal-input3" class="swal2-input" placeholder="Cover Image URL">
        <select id="swal-input4" class="swal2-input">
          <option value="">Select Category</option>
          ${categories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("")}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById("swal-input1") as HTMLInputElement).value,
          (document.getElementById("swal-input2") as HTMLTextAreaElement).value,
          (document.getElementById("swal-input3") as HTMLInputElement).value,
          parseInt(
            (document.getElementById("swal-input4") as HTMLSelectElement)
              .value || "0"
          ),
        ];
      },
    });

    // Check if the user cancelled the dialog
    if (isDismissed) {
      return;
    }

    if (formValues) {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Create axios instance with authorization header
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const [title, description, cover_image_url, categoryId] = formValues;

        const response = await axiosInstance.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles",
          {
            data: {
              title,
              description,
              cover_image_url,
              category: categoryId || null,
            },
          }
        );

        // Assuming the response contains the newly created article
        const newArticle = response.data.data;

        // Update local state
        setArticles([
          ...articles,
          {
            ...newArticle,
            category: categoryId
              ? categories.find((cat) => cat.id === categoryId) || null
              : null,
          },
        ]);

        Swal.fire({
          icon: "success",
          title: "Article Added",
          text: "The new article has been successfully added.",
        });
      } catch (error) {
        console.error("Error adding article:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add article",
        });
      }
    }
  };

  // Edit Article Handler
  const handleEditArticle = async (documentId: string) => {
    const article = articles.find((a) => a.documentId === documentId);

    if (!article) return;

    const { value: formValues, isDismissed } = await Swal.fire({
      title: "Edit Article",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Title" value="${article.title}">
        <textarea id="swal-input2" class="swal2-input" placeholder="Description">${article.description}</textarea>
        <input id="swal-input3" class="swal2-input" placeholder="Cover Image URL" value="${article.cover_image_url}">
        <select id="swal-input4" class="swal2-input">
          <option value="">Select Category</option>
          ${categories.map((cat) => `<option value="${cat.id}" ${article.category?.id === cat.id ? "selected" : ""}>${cat.name}</option>`).join("")}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById("swal-input1") as HTMLInputElement).value,
          (document.getElementById("swal-input2") as HTMLTextAreaElement).value,
          (document.getElementById("swal-input3") as HTMLInputElement).value,
          parseInt(
            (document.getElementById("swal-input4") as HTMLSelectElement)
              .value || "0"
          ),
        ];
      },
    });

    // Check if the user cancelled the dialog
    if (isDismissed) {
      return;
    }

    if (formValues) {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        // Create axios instance with authorization header
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const [title, description, cover_image_url, categoryId] = formValues;

        // Log the payload for debugging
        console.log("Update Payload:", {
          data: {
            title,
            description,
            cover_image_url,
            category: categoryId || null,
          },
        });

        try {
          const response = await axiosInstance.put(
            `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${documentId}`,
            {
              data: {
                title,
                description,
                cover_image_url,
                category: categoryId || null,
              },
            }
          );

          // Log the full response for debugging
          console.log("Update Response:", response);

          // Update local state
          setArticles(
            articles.map((a) =>
              a.documentId === documentId
                ? {
                    ...a,
                    title,
                    description,
                    cover_image_url,
                    category: categoryId
                      ? categories.find((cat) => cat.id === categoryId) || null
                      : null,
                  }
                : a
            )
          );

          Swal.fire({
            icon: "success",
            title: "Article Updated",
            text: "The article has been successfully updated.",
          });
        } catch (error: any) {
          // More detailed error handling
          console.error("Full error object:", error);

          // Check if error response exists
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);

            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text:
                error.response.data.message ||
                "You are not allowed to update this article.",
            });
          } else if (error.request) {
            console.error("No response received:", error.request);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "No response from server",
            });
          } else {
            console.error("Error message:", error.message);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message || "Failed to update article",
            });
          }
        }
      } catch (generalError) {
        console.error("General error:", generalError);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An unexpected error occurred",
        });
      }
    }
  };

  const handleDeleteArticle = (documentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          const axiosInstance = axios.create({
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          await axiosInstance.delete(
            `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles/${documentId}`
          );

          setArticles(articles.filter((a) => a.documentId !== documentId));

          Swal.fire("Deleted!", "Your article has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting article:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to delete article",
          });
        }
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-sans p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Articles Management</h2>
        <button
          onClick={handleAddArticle}
          className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
        >
          <PlusCircle className="mr-2" /> Add New Article
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-800">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr
                key={article.documentId}
                className="border-b border-blue-700 hover:bg-blue-800/50 transition-colors"
              >
                <td className="p-3">{article.title}</td>
                <td className="p-3">{article.description}</td>
                <td className="p-3">
                  {article.category?.name || "No Category"}
                </td>
                <td className="p-3">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEditArticle(article.documentId)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteArticle(article.documentId)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
