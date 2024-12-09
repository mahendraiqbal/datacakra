import React, { useEffect, useState } from "react";
import { MessageCircle, User, Calendar, Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Image from "next/image";

interface Comment {
  id: number;
  content: string;
  documentId: string;
}

interface Article {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  user?: {
    username: string;
  };
  comments: Comment[];
}

const ArticleView: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles?populate=*",
        );
        const data = await response.json();
        setArticles(data.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(articles.length / articlesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComment = async (articleId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Token not found", "Please login again.", "error");
      return;
    }

    const { value: comment } = await Swal.fire({
      title: "Add your comment",
      input: "textarea",
      inputLabel: "Your comment",
      inputPlaceholder: "Type your comment...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (comment) {
      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments",
          {
            data: {
              content: comment,
              article: articleId,
            },
          },
        );

        if (response.status === 200) {
          Swal.fire("Comment added!", "", "success");
        } else {
          Swal.fire("Failed to add comment", "", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const handleEditComment = async (
    documentId: string,
    currentContent: string,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Token not found", "Please login again.", "error");
      return;
    }

    const { value: editedComment } = await Swal.fire({
      title: "Edit your comment",
      input: "textarea",
      inputLabel: "Edit comment",
      inputValue: currentContent,
      inputPlaceholder: "Type your edited comment...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (editedComment) {
      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.put(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${documentId}`,
          {
            data: {
              content: editedComment,
            },
          },
        );

        if (response.status === 200) {
          Swal.fire("Comment updated!", "", "success");
        } else {
          Swal.fire("Failed to update comment", "", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const handleDeleteComment = async (documentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Token not found", "Please login again.", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.delete(
          `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/comments/${documentId}`,
        );

        if (
          response.status === 200 ||
          response.status === 201 ||
          response.status === 204
        ) {
          Swal.fire("Deleted!", "Your comment has been deleted.", "success");
        } else {
          Swal.fire("Failed to delete comment", "", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      {currentArticles.length > 0 ? (
        currentArticles.map((article) => (
          <div
            key={article.id}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-8"
          >
            <Image
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-72 object-cover"
              height={72}
              width={500}
            />
            <div className="p-6">
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                {article.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {article.description}
              </p>

              <div className="flex items-center mb-4 text-sm text-gray-500">
                <User className="mr-2" />
                <span>{article.user?.username || "Dummy Person"}</span>
                <span className="mx-2">|</span>
                <Calendar className="mr-2" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-3">
                  Comments
                </h3>
                {article.comments.length > 0 ? (
                  article.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start mb-4">
                      <MessageCircle className="w-6 h-6 text-gray-500 mr-3" />
                      <p className="text-gray-700">{comment.content}</p>
                      <button
                        onClick={() =>
                          handleEditComment(comment.documentId, comment.content)
                        }
                        className="ml-4 text-gray-600 hover:text-blue-500"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.documentId)}
                        className="ml-4 text-gray-600 hover:text-red-500"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}

                <button
                  onClick={() => handleComment(article.id)}
                  className="mt-4 text-blue-500"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading articles...</p>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="text-gray-500">
          Page {currentPage} of {Math.ceil(articles.length / articlesPerPage)}
        </span>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={
            currentPage === Math.ceil(articles.length / articlesPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArticleView;
