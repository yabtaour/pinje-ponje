
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import React from "react";

const columns = [
    { name: "TYPE", uid: "type" },
    { name: "Result", uid: "result" },
    { name: "Opponent", uid: "opponent" },
    { name: "XP", uid: "ex" },
    { name: "Date", uid: "date" },
];

const users = [
    {
        id: 1,
        Opponent: "Tony Reichert",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com",
        date: "20 minutes ago",
        ex: 40,
        result: "LOSS",
        type: "Normal"


    },
    {
        id: 2,
        Opponent: "Zoey Lang",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com",
        date: "20 minutes ago",
        ex: 40,
        result: "WIN",
        type: "Normal"


    },
    {
        id: 3,
        Opponent: "Jane Fisher",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com",
        date: "20 minutes ago",
        ex: 40,
        result: "LOSS",
        type: "Normal"


    },
    {
        id: 4,
        Opponent: "William Howard",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com",
        date: "20 minutes ago",
        ex: 40,
        result: "WIN",
        type: "Normal"


    },
    {
        id: 5,
        Opponent: "Kristen Copper",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com",
        date: "20 minutes ago",
        ex: 40,
        result: "WIN",
        type: "Normal"


    },
];



const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};



export default function MatchHistory() {


    const renderCell = React.useCallback((user: any, columnKey: any) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "opponent":
                return (
                    <button className="hover:bg-[#333153] p-1 rounded-lg ">
                        <User
                            avatarProps={{ radius: "lg", src: user.avatar }}
                            description={user.email}
                            name={cellValue}
                        >
                            {user.email}
                        </User>
                    </button>
                );
            case "date":
                return <p className="text-default-400">{cellValue}</p>;
            case "result":
                const bgColor = cellValue === "WIN" ? "bg-green-300" : "bg-red-300";
                return (
                    <span className={`px-2 py-1 font-semibold leading-tight text-green-700 rounded-sm ${bgColor}`}>
                        {cellValue}
                    </span>
                );
            default:
                return cellValue;
        }
    }, []);

    return (

        <div className="p-0 m-0">
            <h2 className="text-2xl font-light text-[#4E40F4] mb-1"> Match history </h2>
            <Table style={{
                padding: "0px",
                color: "#fff",
            }} radius='lg' isCompact isStriped className=" text[#fff]" aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn style={{
                            backgroundColor: "#333153"
                        }} key={column.uid} align={"center"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody style={
                    {}
                } className="bg-[#000] " items={users}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );

}
