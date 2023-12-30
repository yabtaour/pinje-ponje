import { getToken } from "@/app/utils/auth";
import { fetchGameHistory } from "@/app/utils/update";
import { useToast } from "@chakra-ui/react";
import { Button, User as NextUIUser, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { User } from '../../../types/user';

const columns = [
  { name: "MODE", uid: "mode" },
  { name: "RESULT", uid: "result" },
  { name: "OPPONENT", uid: "opponent" },
  { name: "DATE", uid: "date" },
];

export default function MatchHistory({ user }: { user: User | null | undefined }) {
  const [matchHistory, setMatchHistory] = useState([]);
  const [page, setPage] = useState(1);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {

          const token = getToken();
          const data = await fetchGameHistory(user.id, token);
          setMatchHistory(data || []);
        } catch (err) {
          console.error(err);
          toast({
            title: 'Error',
            description: "error while fetching game history",
            status: 'error',
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
            colorScheme: "red",
          });
        }
      };
      fetchData();



    }
  }, [user]);


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const delta = now.getTime() - date.getTime();

    if (delta < 60 * 1000) {
      return "a second ago";
    } else if (delta < 3600 * 1000) {
      return `${Math.floor(delta / (60 * 1000))} minutes ago`;
    } else if (delta < 24 * 3600 * 1000) {
      return `${Math.floor(delta / (3600 * 1000))} hours ago`;
    } else if (delta < 48 * 3600 * 1000) {
      return "yesterday";
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    }
  };

  const renderCell = React.useCallback((match: any, columnKey: any) => {

    const cellValue = match[columnKey];

    switch (columnKey) {
      case "opponent":
        const opponent = match?.players[0].user.username === user?.username
          ? match?.players[1]
          : match?.players[0];
        return (
          <div className="p-1 rounded-lg ">
            <Button
              className=" hover:bg-[#333153] p-1 rounded-lg space-x-2"
              onClick={() => {
                router.push(`/profile/${opponent.user.id}`);
              }}>

              <NextUIUser
                avatarProps={{ size: "sm", radius: "lg", src: opponent?.user?.profile?.avatar ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                name={opponent?.user?.username}
                className="text-[#77DFF8] p-1 rounded-lg space-x-2"
              />
            </Button>
          </div>
        );
      case "date":
        return <p className="text-default-400">{formatDate(match.createdAt)}</p>;
      case "result":
        const bgColor = match.players[0].status === "WINNER" ? "bg-green-300" : "bg-red-300";
        const textColor = match.players[0].status === "WINNER" ? "text-green-700" : "text-red-700";
        return (
          <span
            className={`px-1 py-0.5 font-semibold text-sm leading-tight ${textColor} rounded-sm ${bgColor}`}
          >
            {match.players[0].status}
          </span>
        );
      default:
        return cellValue;
    }
  }, []);

  const rowsPerPage = 5;
  const pages = Math.ceil(matchHistory.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return matchHistory.slice(start, end);
  }, [page, matchHistory]);

  function generateUniqueKey() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
  }

  return (
    <div className="p-0 m-0 ml-5">
      <h2 className="text-2xl font-light text-[#4E40F4] mb-1 ml-4"> Match history </h2>
      <Table isStriped style={{ padding: "0px", color: "#fff", borderRadius: "lg" }} className="text[#fff]" aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              className="bg-[#333153] text-[#8C87E1] font-medium text-sm"
              align="center"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {matchHistory.length === 0 ? (
          <TableBody style={{ backgroundColor: "#1B1A2D", color: "#9BA4AF" }} emptyContent={"This player hasn't played any games yet."}>{[]}</TableBody>
        ) : (
          <TableBody items={items} style={{ backgroundColor: "#1B1A2D" }}>
            {(match) => (
              <TableRow key={generateUniqueKey()}>
                {(columnKey) => <TableCell>{renderCell(match, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
      <div className="flex justify-center mt-4">
        <Pagination
          isCompact
          showControls
          showShadow
          style={{ color: "#fff" }}
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    </div>
  );
}