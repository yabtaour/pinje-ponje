"use client";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import useSWR from "swr";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/app/components/loader";

const fetchUsers = async (url: string) => {
  console.log(url);
  try {

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response) {
      throw new Error("Failed to fetch posts");
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};


const SearchPage = () => {
  const [page, setPage] = useState(1);
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const router = useRouter();

  const { data, error, isLoading, isValidating } = useSWR(
    `http://localhost:3000/users?search=${encodedSearchQuery}&take=9&skip=${
      (page - 1) * 9
    }`,
    fetchUsers,
    { revalidateOnFocus: false }
  );

  if (!encodedSearchQuery) {
    router.push("/");
  }

  if (isLoading) {
    <Loader/>;
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data && data.length === 9) {
      setPage((prev) => prev + 1);
    }
  };


  if (!data || data.length === 0) {
    return isLoading ? (
        <Loader/>
    ) : (    <div className="flex items-center justify-center h-screen">
    <div className="text-red-500">No users found</div>
  </div>);
  }
  console.log("Data: ", data);

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'unranked':
        return 'text-gray-500'; // or any color you prefer
      case 'iron':
        return 'text-gray-700'; // or any color you prefer
      case 'bronze':
        return 'text-yellow-600'; // or any color you prefer
      case 'silver':
        return 'text-gray-800'; // or any color you prefer
      case 'gold':
        return 'text-yellow-700'; // or any color you prefer
      default:
        return 'text-gray-800'; // default color
    }
  };

  const getUserBoxStyle = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'unranked':
        return 'bg-gray-300'; // Add your specific styles for unranked
      case 'iron':
        return 'bg-gray-400'; // Add your specific styles for iron
      case 'bronze':
        return 'bg-yellow-500'; // Add your specific styles for bronze
      case 'silver':
        return 'bg-gray-500'; // Add your specific styles for silver
      case 'gold':
        return 'bg-yellow-400'; // Add your specific styles for gold
      // Add more cases for other ranks as needed
      default:
        return ''; // Default style or add your custom default style
    }
  };

  return (

    <div className="container h-screen mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Showing results for:{" "}
        <span className="text-blue-500">{searchQuery}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


        {
        data.map((user: any) => (
          <Link key={user.id} href={`/profile/${user.id}`}>
          <div key={user.id} className={`p-4 rounded-lg ${getUserBoxStyle(user.rank)}`}>
              <div className="flex items-center flex-wrap justify-center mb-4">
                <img
                  src={
                    user.profile?.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg"
                  }
                  alt={`${user.username}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-lg font-semibold text-center">
                {user.username}
              </p>
              <p className="text-center mt-2">
                <span className={`ml-1 text-lg ${getRankColor(user.rank)}`}>
                  {user.rank}
                </span>
              </p>
              {user.profile && (
                <div className="mt-2">
                  <p className="text-gray-700 text-center">
                    {user.profile.bio && user.profile.bio.length > 50
                      ? `${user.profile.bio.substring(0, 50)}...`
                      : user.profile.bio}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1 || isValidating}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={isValidating || (data && data.length < 9)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
