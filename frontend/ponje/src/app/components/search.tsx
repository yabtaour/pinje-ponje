import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@chakra-ui/react';

const SearchInput = () => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get("q") : ""
  );
  const router = useRouter();
  const toast = useToast();
  
  useEffect(() => {
    if (!searchQuery || typeof searchQuery !== "string") {
      {
        setSearchQuery(null);
      }
    } else {
      const encodedSearchQuery = encodeURI(searchQuery);
      router.push(`/search?q=${encodedSearchQuery}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;

    // Limit input to 20 characters
    const truncatedInput = inputText.slice(0, 20);
    setSearchQuery(truncatedInput);
  };
  
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Trim leading and trailing spaces
      const trimmedQuery = searchQuery?.trim();
  
      if (trimmedQuery) {
        setSearchQuery(trimmedQuery);
  
        const encodedSearchQuery = encodeURI(trimmedQuery);
        router.push(`/search?q=${encodedSearchQuery}`);
      }
    }
  };

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Trim leading and trailing spaces
    const trimmedQuery = searchQuery?.trim();

    if (trimmedQuery) {
      setSearchQuery(trimmedQuery);

      const encodedSearchQuery = encodeURI(trimmedQuery);
      router.push(`/search?q=${encodedSearchQuery}`);
    }
  };


  return (
    <form onSubmit={onSearch} className="flex justify-center">
      <input
        value={searchQuery || ""}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        className="px-3 py-1 sm:px-4 sm:py-2 flex-1 text-white bg-gray-800 focus:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        placeholder="Search..."
      />
    </form>
  );
};

export default SearchInput;