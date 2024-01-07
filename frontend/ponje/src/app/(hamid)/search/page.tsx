"use client";

import Loader from "@/app/components/loader";
import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import { useToast } from '@chakra-ui/react';
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";




const SearchPage = () => {
  const [page, setPage] = useState(1);
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const router = useRouter();
  const toast = useToast();
  const fetchUsers = async (url: string) => {
    try {
      const token = getToken()
      const response = await axios.get(url, {
        headers: {
          Authorization: token
        },
      });
      if (!response) {
        throw new Error("Failed to fetch posts");
      }
      return response.data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  };
  const { data, error, isLoading, isValidating } = useSWR(
    `/users?search=${encodedSearchQuery}&take=9&skip=${(page - 1) * 9
    }`,
    fetchUsers,
    { revalidateOnFocus: false }
  );

  if (!encodedSearchQuery) {
    router.push("/");
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
      <div className='min-h-screen'>
        <Loader />;
      </div>
    ) : (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">No users found</div>
      </div>
    );
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

  return (

    <div className="container h-screen mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-white">
        Showing results for:{" "}
        <span className="text-blue-500">{searchQuery}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {
          data.map((user: any) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <div className="bg-[#272541] p-4 rounded shadow-md cursor-pointer transition-transform transform hover:scale-105">
                <div className="flex items-center flex-wrap justify-center mb-4">
                  <Image
                    src={
                      user.profile?.avatar ||
                      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg"
                    }
                    alt={`${user.username}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
                <p className="text-lg font-semibold text-center text-[#77D7F7]">
                  {user.username}
                </p>
                <p className="text-center mt-2">
                  <span className={`ml-1 text-lg ${getRankColor(user.rank)}`}>
                    {user.rank}
                  </span>
                </p>
                {user.profile && (
                  <div className="mt-2">
                    <p className="text-gray-300 text-center">
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
