import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, FileText, Layers, ChevronDown } from "lucide-react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Category {
  id: number;
  name: string;
  articleCount: number;
}

export interface Article {
  id: number;
  title: string;
  category?: Category;
}

export interface UserResponse {
  username: string;
}

export interface ArticlesResponse {
  data: Article[];
}

export interface CategoriesResponse {
  data: Category[];
}

export default function DashboardContent() {
  const [user, setUser] = useState<string>("");
  const [articleCount, setArticleCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userResponse = await axiosInstance.get<{ username: string }>(
          "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/users/me"
        );
        setUser(userResponse.data.username);

        const articlesResponse = await axiosInstance.get<{
          data: any[];
          count: number;
        }>("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/articles");
        setArticleCount(articlesResponse.data.data.length);

        const categoriesResponse = await axiosInstance.get<{
          data: Category[];
        }>("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/categories");

        const categoriesData = categoriesResponse.data.data.map((category) => {
          const articleCount = articlesResponse.data.data.filter(
            (article) => article.category?.id === category.id
          ).length;
          return { ...category, articleCount };
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: categories.map((category) => category.name),
  };

  const chartSeries = categories.map((category) => category.articleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white font-sans rounded-lg">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-blue-200 opacity-80">
            Welcome back, {user || "User"}
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl transition transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <User className="text-blue-300" size={40} />
              <div>
                <h3 className="text-lg font-semibold text-blue-100">Profile</h3>
                <p className="text-sm text-blue-200 opacity-75">
                  {user || "Guest User"}
                </p>
              </div>
            </div>
          </div>

          {/* Articles Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl transition transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <FileText className="text-green-300" size={40} />
              <div>
                <h3 className="text-lg font-semibold text-green-100">
                  Active Articles
                </h3>
                <p className="text-3xl font-bold text-green-200">
                  {articleCount}
                </p>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl transition transform hover:scale-105">
            <div className="flex items-center space-x-4">
              <Layers className="text-purple-300" size={40} />
              <div className="w-full">
                <h3 className="text-lg font-semibold text-purple-100 mb-2">
                  Categories
                </h3>
                <div className="relative">
                  <select
                    className="w-full bg-white/10 text-white p-2 rounded-lg appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const value =
                        e.target.value === "" ? null : Number(e.target.value);
                      setSelectedCategory(value);
                    }}
                  >
                    <option value="" className="text-gray-800">
                      Select Category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                        className="text-gray-800"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grafik Distribusi Artikel */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4">
            Article Distribution by Category
          </h2>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
            width="400"
          />
        </div>
      </div>
    </div>
  );
}
