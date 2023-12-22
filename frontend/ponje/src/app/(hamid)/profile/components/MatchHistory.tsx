import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User as NextUIUser } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { User } from '../../../types/user';
import { fetchGameHistory } from "@/app/utils/update";

const columns = [
  { name: "MODE", uid: "mode" },
  { name: "RESULT", uid: "result" },
  { name: "OPPONENT", uid: "opponent" },
  { name: "DATE", uid: "date" },
];

export default function MatchHistory({ user }: { user: User | null | undefined }) {
  
  const [matchHistory, setMatchHistory] = useState([]);
  
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const data = await fetchGameHistory(user.id, localStorage.getItem("access_token"));
          setMatchHistory(data || []); 
        } catch (err) {
          console.error(err);
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
        const opponent = match.players[1];
        return (
          <div className="p-1 rounded-lg ">
            <NextUIUser
              avatarProps={{ size: "sm", radius: "lg", src: opponent.user.profile.avatar ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
              name={opponent.user.username}
              className="text-[#77DFF8] p-1 rounded-lg space-x-2"
            />
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
            {
                matchHistory.length === 0 ? (
                    <TableBody style={{ backgroundColor: "#1B1A2D" , color : "#9BA4AF"  }} emptyContent={"This player hasnt played any games yet."}>{[]}</TableBody>
                ) : (
                    <TableBody items={matchHistory} style={{ backgroundColor: "#1B1A2D" }}>
                    {(match) => (
                      <TableRow key="match">
                        {(columnKey) => <TableCell>{renderCell(match, columnKey)}</TableCell>}
                      </TableRow>
                    )}
                  </TableBody>
                )
            }
      </Table>
    </div>
  );
}