"use client";

import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import useSWR from "swr";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loader from "@/app/components/loader";
import Image from "next/image";

// import Spinner from "./Spinner";
// import Posts from "../Posts";

const Spinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className={`mr-2 w-8 h-8 animate-spin fill-green-300 text-green-700`}
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const fetchUsers = async (url: string) => {
  console.log(url);
  try {
    //   useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await axios.get(`/users/${params.id}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    //                 },
    //             });
    //             setUser(data.data);
    //             setLoading(false);
    //             console.log(data.data);
    //         } catch (err) {
    //             console.error(err);
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response) {
      throw new Error("Failed to fetch posts");
    }
    console.log("This is a response : ", response.data);
    // Axios automatically throws an error for non-2xx responses, so no need to check response.ok
    
    return response.data;
  } catch (error: any) {
    // Handle errors here
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};


const SearchPage = () => {
  const [page, setPage] = useState(1);
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const router = useRouter();

  console.log("This One had Both: ", searchQuery, " - ", encodedSearchQuery);

  const { data, error, isLoading, isValidating } = useSWR(
    `http://localhost:3000/users?search=${encodedSearchQuery}&take=9&skip=${
      (page - 1) * 9
    }`,
    fetchUsers,
    { revalidateOnFocus: false }
  );

  // useEffect(() => {
  //   if (data) {
  //     // If data is available, set loading to false after a short delay
  //     const delay = setTimeout(() => {
  //       setLoading(false);
  //     }, 500); // Adjust the delay time as needed

  //     // Cleanup the timeout to avoid memory leaks
  //     return () => clearTimeout(delay);
  //   }
  // }, [data]);

  if (!encodedSearchQuery) {
    router.push("/");
  }

  if (isLoading) {
    <Spinner />;
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

  const [showNoUsersMessage, setShowNoUsersMessage] = useState(false);

  useEffect(() => {
    // Set a timeout to show the message after 2 seconds (adjust the time as needed)
    const timeoutId = setTimeout(() => {
      setShowNoUsersMessage(true);
    }, 5000);
  
    // Clear the timeout when the component unmounts to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  if (!data || data.length === 0) {
    return showNoUsersMessage ? (
        <Loader/>
    ) : null;
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
      <h1 className="text-2xl font-semibold mb-4">
        Showing results for:{" "}
        <span className="text-blue-500">{searchQuery}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


        {
        data.map((user: any) => (
          <Link key={user.id} href={`/profile/${user.id}`}>
            <div className="bg-white p-4 rounded shadow-md cursor-pointer transition-transform transform hover:scale-105">
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
