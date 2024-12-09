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

interface Article {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
  } | null;
}

export default function DashboardContent() {
  const [user, setUser] = useState<string>("");
  const [articleCount, setArticleCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [articleComments, setArticleComments] = useState<
    { title: string; commentCount: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const axiosInstance = axios.create({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userResponse = await axiosInstance.get<{ username: string }>(
          `${BASE_URL}/users/me`,
        );
        setUser(userResponse.data.username);

        const articlesResponse = await axiosInstance.get<{
          data: Article[];
        }>(`${BASE_URL}/articles?populate[category]=*`);
        setArticleCount(articlesResponse.data.data.length);

        const categoryCounts: Record<number, { name: string; count: number }> =
          {};

        articlesResponse.data.data.forEach((article) => {
          if (article.category) {
            if (!categoryCounts[article.category.id]) {
              categoryCounts[article.category.id] = {
                name: article.category.name,
                count: 0,
              };
            }
            categoryCounts[article.category.id].count += 1;
          }
        });

        const categoriesData = Object.entries(categoryCounts).map(
          ([id, category]) => ({
            id: Number(id),
            name: category.name,
            articleCount: category.count,
          }),
        );

        const commentsResponse = await axiosInstance.get<{
          data: {
            id: number;
            title: string;
            comments: { id: number }[];
          }[];
        }>(`${BASE_URL}/articles?populate=*`);

        const commentsData = commentsResponse.data.data.map((article) => ({
          title: article.title,
          commentCount: article.comments.length,
        }));

        setCategories(categoriesData);
        setArticleComments(commentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: categories.map((category) => category.name),
    colors: ["#4285F4", "#34A853", "#FBBC05", "#FF5722", "#9C27B0", "#2196F3"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
        },
      },
    ],
    legend: {
      position: "bottom",
    },
  };

  const chartSeries = categories.map((category) => category.articleCount);

  const barChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: articleComments.map((article) => article.title),
      labels: {
        style: {
          colors: "#FFFFFF",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF",
        },
      },
    },
    colors: ["#34A853"],
    legend: {
      labels: {
        colors: "#FFFFFF",
      },
    },
  };

  const barChartSeries = [
    {
      name: "Comments",
      data: articleComments.map((article) => article.commentCount),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
        <div className="text-white text-2xl text-center">{error}</div>
      </div>
    );
  }

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

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-white">
            Article Distribution by Category
          </h2>
          {categories.length > 0 ? (
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="pie"
              width="100%"
              height={350}
            />
          ) : (
            <div className="text-center py-8 text-blue-200">
              No categories found
            </div>
          )}
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-white">
            Comments Distribution by Article
          </h2>
          {articleComments.length > 0 ? (
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              width="100%"
              height={350}
            />
          ) : (
            <div className="text-center py-8 text-blue-200">
              No comments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
