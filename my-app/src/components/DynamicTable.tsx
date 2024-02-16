import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

interface Column {
  header: string;
  field: string;
}

interface Props {
  data: any[] | undefined;
  columns: Column[];
  children?: React.ReactNode;
}

const DynamicTable: React.FC<Props> = ({ data, columns, children }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper
        style={{
          border: "2px solid red",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
          minHeight: "350px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>{column.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, columnIndex) => (
                    <TableCell key={columnIndex}>{row[column.field]}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>No data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      {children}
    </div>
  );
};

export default DynamicTable;
