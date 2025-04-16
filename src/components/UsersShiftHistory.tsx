import { useState, useEffect } from "react";
import { getShiftHistory, Shift as ServiceShift } from "../api/attendanceApi";
import * as XLSX from "xlsx";

type Shift = ServiceShift;

const UserShiftHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Custom");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState("");

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    
    const startObj = new Date(start);
    const endObj = new Date(end);
    
    if (startObj > endObj) {
      setError("Start date cannot be after the end date");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    validateDates(value, endDate);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    validateDates(startDate, value);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setError(""); 
  };

  const fetchShifts = async (start: string, end: string) => {
    if (!start || !end) return;
    if (!validateDates(start, end)) return;

    try {
      const data = await getShiftHistory(start, end);
      setShifts(data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
      setError("Error loading data. Please try again later.");
    };
};

  useEffect(() => {
    const calculateDateRange = () => {
      const today = new Date();
      const format = (d: Date) => d.toISOString().split("T")[0];
      let start = "";
      let end = "";

      switch (selectedPeriod) {
        case "Day": {
          const startOfDay = new Date(today);
          startOfDay.setHours(0, 0, 0, 0);  
          start = format(startOfDay);
        
          const endOfDay = new Date(today);
          endOfDay.setHours(23, 59, 59, 999); 
          end = format(endOfDay);
          break;
        }
        
  
        case "Week": {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          start = format(startOfWeek);

          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - today.getDay()) + 1);
          end = format(endOfWeek);
          break;
        }

        case "Month": {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
          start = format(startOfMonth);
          end = format(endOfMonth);
          break;
        }

        case "Custom": {
          start = startDate;
          end = endDate;
          break;
        }

        default:
          return { start: "", end: "" };
      }

      return { start, end };
    };

    const { start, end } = calculateDateRange();
    
    if (selectedPeriod !== "Custom") {
      setStartDate(start);
      setEndDate(end);
    }

    if (start && end && validateDates(start, end)) {
      fetchShifts(start, end);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod === "Custom" && startDate && endDate) {
      fetchShifts(startDate, endDate);
    }
  }, [startDate, endDate, selectedPeriod]);

  const exportToExcel = () => {
    if (shifts.length === 0) return;
    
    const formattedData = shifts.map((shift, index) => ({
      "#": index + 1,
      Date: new Date(shift.timestamp).toLocaleDateString(),
      "Start Time": new Date(shift.timestamp).toLocaleTimeString(),
      "End Time": shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : "N/A",
      Hours: shift.hours ? shift.hours.toFixed(2) : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.border = {
          top: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shift Report");
    XLSX.writeFile(workbook, "shift_report.xlsx");
  };

  const ShiftRecord = ({ shift }: { shift: Shift }) => {
    const startTime = new Date(shift.timestamp);
    const endTime = shift.endTime ? new Date(shift.endTime) : null;
    const hours = shift.hours ? shift.hours.toFixed(2) : "N/A";

    return (
      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{startTime.toLocaleDateString()}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{startTime.toLocaleTimeString()}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{endTime ? endTime.toLocaleTimeString() : "N/A"}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{hours}</td>
      </tr>
    );
  };

  const columnWidths = {
    date: "25%",
    startTime: "25%",
    endTime: "25%",
    hours: "25%"
  };

  return (
<div className="flex flex-col min-h-screen" style={{ backgroundColor: 'rgb(247, 251, 255)' }} pt-10 px-10>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">My Shifts History</h1>
        <p className="mt-2 text-gray-500">View your past shifts and analyze your working hours</p>

        <div className="mt-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["Day", "Week", "Month", "Custom"].map((period) => (
              <button
                key={period}
                className={`py-2 px-4 rounded-lg ${
                  selectedPeriod === period ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => handlePeriodChange(period)}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center flex-wrap gap-2">
              <label htmlFor="startDate" className="text-sm text-gray-600">
                {selectedPeriod}:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className={`border ${error && error.includes('Start Date') ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 text-gray-800`}
                disabled={selectedPeriod !== "Custom"}
                max={endDate || undefined}
              />
              <span className="mx-1">to</span>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className={`border ${error && error.includes('End Date') ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 text-gray-800`}
                disabled={selectedPeriod !== "Custom"}
                min={startDate || undefined}
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: '400px' }}>
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
                  <th style={{ width: columnWidths.date }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">Date</th>
                  <th style={{ width: columnWidths.startTime }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">Start Time</th>
                  <th style={{ width: columnWidths.endTime }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">End Time</th>
                  <th style={{ width: columnWidths.hours }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
  {shifts.length > 0 ? (
    shifts.map((shift, index) => (
      <ShiftRecord key={index} shift={shift} />
    ))
  ) : (
    <tr>
      <td colSpan={4} className="py-8 text-center text-gray-500">No shifts found for selected period</td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-600 space-y-1">
            <div>Total Hours: {shifts.reduce((total, shift) => total + (shift.hours || 0), 0).toFixed(2)} hours</div>
            <div>Shifts Number: {shifts.length}</div>
          </div>
          <button
            className={`flex items-center py-2 px-4 ${shifts.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400`}
            onClick={exportToExcel}
            disabled={shifts.length === 0}
          >
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserShiftHistory;