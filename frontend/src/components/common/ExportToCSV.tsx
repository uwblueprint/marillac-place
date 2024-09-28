import React from "react";
import { Button } from "@chakra-ui/react";
import DownloadIcon from "@mui/icons-material/Download";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

type ExportProps = {
  exportData: any;
};

const ExportToCSV = ({ exportData }: ExportProps): React.ReactElement => {
  // <ExportToCSV exportData={null}/>
  const sampleData = [
    {
      numOfIds: 1,
      productId: null,
      askOrgId: "Yes",
      orderId: 11608501,
      orgSelectionType: "FLOWER",
      batchCode: "B-E7BE5602-2F9B-E3",
      IDType: "OPEN",
      batchId: 413,
      creationDate: "2022-06-29",
      isOnline: "Yes",
      productName: null,
      batchProductArray: [
        {
          ID: 663255,
          TYPE: "PRODUCT",
          NAME: "SOME NAME",
        },
      ],
      numOfUsedIDs: 0,
      redemptionMethod: "ID",
      askSSN: "No",
      askEmployeeId: "Yes",
      batchStatus: "Active",
      productType: null,
      expirationDate: "2023-06-29",
    },
    {
      numOfIds: 1,
      productId: null,
      askOrgId: "No",
      orderId: 11608502,
      orgSelectionType: "LEAF",
      batchCode: "B-480A8929-57D5-97",
      IDType: "OPEN",
      batchId: 414,
      creationDate: "2022-06-29",
      isOnline: "Yes",
      productName: null,
      batchProductArray: [
        {
          ID: 663255,
          TYPE: "PRODUCT",
          NAME: "Other Name",
        },
      ],
      numOfUsedIDs: 0,
      redemptionMethod: "ID",
      askSSN: "No",
      askEmployeeId: "No",
      batchStatus: "Active",
      productType: null,
      expirationDate: "2023-06-29",
    },
  ];

  const jsonToCSV = (jsonData: any) => {
    let csv = "";
    const headers = Object.keys(jsonData[0]);
    csv += `${headers.join(",")}\n`;
    // Add the data
    jsonData.forEach((row: any) => {
      const data = headers
        .map((header) => JSON.stringify(row[header]))
        .join(",");
      csv += `${data}\n`;
    });
    return csv;
  };

  const downloadJsonAsCSV = () => {
    const csvData = jsonToCSV(exportData || sampleData); // Add .items.data
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
        // ={<DownloadIcon />} startIcon
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
