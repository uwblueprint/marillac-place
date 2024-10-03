import React from "react";
import { Button } from "@chakra-ui/react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { TableData } from "./CommonTable";

type ExportProps = {
  exportData: TableData[];
};

// set exportData to be the list of objects needed to be exported
const ExportToCSV = ({ exportData }: ExportProps): React.ReactElement => {
  const jsonToCSV = (jsonData: Array<TableData>) => {
    let csv = "";
    const headers = Object.keys(jsonData[0]);
    csv += `${headers.join(",")}\n`;
    // Add the data
    jsonData.forEach((row: TableData) => {
      const data = headers
        .map((header) => JSON.stringify(row[header]))
        .join(",");
      csv += `${data}\n`;
    });
    return csv;
  };

  const downloadJsonAsCSV = () => {
    const csvData = jsonToCSV(exportData);
    // Create a CSV file and allow the user to download it
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
  };

  return (
    <>
      <Button
        alignItems="center"
        variant="secondary"
        onClick={downloadJsonAsCSV}
        gap={1}
      >
        <FileDownloadOutlinedIcon /> Export{" "}
      </Button>
    </>
  );
};

export default ExportToCSV;
