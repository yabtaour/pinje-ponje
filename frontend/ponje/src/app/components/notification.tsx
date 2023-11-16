
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import axios from "axios";
import React from "react";

export default function Notification() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasMore, setHasMore] = React.useState(false);

    let list = useAsyncList({
        async load({ signal, cursor }) {
            // Calculate take and skip based on your pagination logic
            const take = 10; // Adjust as needed
            const skip = cursor ? cursor.split('=').pop() : 0;

            try {
                let res = await axios.get(`https://swapi.py4e.com/api/people/?search=&take=${take}&skip=${skip}`, { signal });

                console.log(res.data);
                setHasMore(res.data.next !== null);

                return {
                    items: res.data.results,
                    cursor: res.data.next,
                };
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                setHasMore(false);
                return {
                    items: [],
                    cursor: null,
                };
            }
        },
    });

    const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });

    return (
        <Table
            hideHeader
            isHeaderSticky
            aria-label="Example table with infinite pagination"
            baseRef={scrollerRef}
            bottomContent={
                hasMore ? (
                    <div className="flex w-full justify-center">
                        <Spinner ref={loaderRef} color="white" />
                    </div>
                ) : null
            }
            classNames={{
                base: "max-h-[520px] overflow-scroll",
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                <TableColumn key="name">hamid</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                items={list.items}
                loadingContent={<Spinner color="white" />}
            >
                {(item: any) => (
                    <TableRow key={item.name}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}