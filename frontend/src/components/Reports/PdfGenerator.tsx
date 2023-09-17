import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { format } from "date-fns";

function PdfGenerator() {
  const selectedDate = useSelector((state: RootState) => state.selectedDate);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [pdfData, setPdfData] = useState<any[]>([]); // Initialize pdfData as an empty

  useEffect(() => {
    if (selectedDate) {
      setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/v1/data/${formattedDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setPdfData(data.dataForPDF);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [formattedDate]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.text("Report Heading", 10, 10);

    const columns = [
      "Total Hour",
      "Machine On Time",
      "Rejection Quantity",
      "Actual Production",
      "part_2055566_3rd",
      "Production",
      "Target Production",
      // "First Cycle",
      // "Last Cycle",
      // "part_8PEE027000161N_2ND",
      // "Average Cycle Time",
      // "Production Time",
      // "Ideal Time",
      // "Mhr Loss",
    ];
    const rows = pdfData.map(
      (
        item: {
          totalHour: number;
          machineOnTime: number;
          rejectionQuantity: number;
          actualProduction: number;
          part_2055566_3rd: number;
          production: number;
          targetProduction: number;
          firstCycle: number;
          lastCycle: number;
          part_8PEE027000161N_2ND: number;
          avgCycleTime: number;
          productionTime: number;
          idealTime: number;
          mhrLoss: number;
        },
        index: number
      ) => [
        // index + 1,
        item.totalHour,
        item.machineOnTime,
        item.rejectionQuantity,
        item.actualProduction,
        item.part_2055566_3rd,
        item.production,
        item.targetProduction,
        item.firstCycle,
        item.lastCycle,
        item.part_8PEE027000161N_2ND,
        item.avgCycleTime,
        item.productionTime,
        item.idealTime,
        item.mhrLoss,
      ]
    );

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      theme: "grid",

      didDrawPage: (data) => {
        doc.text("Production Summary : ", data.settings.margin.left, 15);
      },
    });

    doc.save(`${formattedDate}Report.pdf`);
  };

  return (
    <div>
      <button onClick={generatePDF} className="btn btn-info">
        Export as PDF
      </button>
    </div>
  );
}

export default PdfGenerator;
