import React, { useEffect } from "react";
import { useState } from "react";
import Pagination from "@mui/material/Pagination";
import DynamicTable from "../components/DynamicTable";
import { columns, ITEMS_PER_PAGE } from "../utils/constants";
import { useEnterprise } from "../services/AccountServices";

type Props = {
  taxId: string;
  isRefetchTableTransactions: boolean;
};

export default function UserPage({ taxId, isRefetchTableTransactions }: Props) {
  const [page, setPage] = useState(1);
  const { data: getUsers, isLoading, error, refetch } = useEnterprise(taxId);

  useEffect(() => {
    if (isRefetchTableTransactions) {
      refetch();
    }
  }, [isRefetchTableTransactions, refetch]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // paggined data based on page number and items per page
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedData = getUsers.slice(start, end);

  return (
    <DynamicTable data={paginatedData} columns={columns}>
      {getUsers && getUsers.length > 0 ? (
        <Pagination
          count={Math.ceil(getUsers.length / ITEMS_PER_PAGE)}
          page={page}
          color="primary"
          onChange={handlePageChange}
        />
      ) : null}
    </DynamicTable>
  );
}
