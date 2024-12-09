"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import DashboardContent from "../components/DashboardContent";
import ArticlesContent from "../components/ArticlesContent";
import CategoryContent from "../components/CategoryContent";
import { Rocket, TrendingUp, Zap } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import ArticleView from "../components/ArticleView";

export default function Dashboard() {
  const [activeContent, setActiveContent] = useState("dashboard");

  const handleAddCategory = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add New Category",
      html: `
        <input
          id="category-name"
          class="swal2-input"
          placeholder="Enter category name"
        />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (
          document.getElementById("category-name") as HTMLInputElement
        ).value;
        if (!name) {
          Swal.showValidationMessage("Category name is required");
        }
        return { name };
      },
    });

    if (formValues) {
      const token = localStorage.getItem("token");

      try {
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const response = await axiosInstance.post(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories",
          { data: { name: formValues.name } }
        );

        Swal.fire({
          icon: "success",
          title: "Category added",
          text: `Category "${response.data.data.name}" has been added successfully!`,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to add category. Please try again later.",
        });
      }
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "dashboard":
        return <DashboardContent />;
      case "articles":
        return <ArticlesContent />;
      case "category":
        return <CategoryContent />;
      case "articlesView":
        return <ArticleView />
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onMenuClick={setActiveContent} />

      <main className="flex-1 p-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">{renderContent()}</div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl py-2 font-bold mb-1">This is Just Static</h1>
                  <h3 className="text-xl font-bold mb-2">Quick Stats</h3>
                  <p className="text-sm opacity-75">
                    Your performance overview
                  </p>
                </div>
                <Rocket className="w-10 h-10 text-white/70" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span>Total Articles</span>
                  <span className="font-bold">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Categories</span>
                  <span className="font-bold">8</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Trending</h3>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <ul className="space-y-3">
                {[
                  { title: "Top Article 1", views: 1245 },
                  { title: "Popular Category", views: 987 },
                  { title: "Emerging Topic", views: 678 },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center pb-3 border-b last:border-b-0"
                  >
                    <span className="text-gray-700">{item.title}</span>
                    <span className="text-gray-500 text-sm">
                      {item.views} views
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Quick Actions
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="12 2 12 12 16 14" />
                  <path d="M20.9 12A8.91 8.91 0 0112 21a8.91 8.91 0 01-8.9-9A8.91 8.91 0 0112 3a8.91 8.91 0 018.9 9z" />
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() =>
                    Swal.fire("New Article feature not implemented")
                  }
                >
                  New Article
                </button>
                <button
                  className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
