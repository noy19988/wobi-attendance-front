import { useState, useEffect } from "react";
import { getAttendanceSummary, getAllUsers, editShift, deleteShift, Shift as ServiceShift } from "../api/attendanceApi.js";
import * as XLSX from "xlsx";
import { FaTrashAlt } from 'react-icons/fa';


type Shift = ServiceShift & {
  user?: {
    id: string;
    fullName?: string;
  };
  endTime?: string;
  hours?: number;
  outId?: string;
};

type User = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
};

const ManageUsersShiftsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Custom");
  const [selectedUser, setSelectedUser] = useState<User | null>({ id: "All Users", fullName: "All Users", firstName: "", lastName: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [error, setError] = useState("");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<{ [key: string]: { startDate: string; startTime: string; endDate: string; endTime: string } }>({});

  const fetchUsers = async () => {
    try {
      const userList = await getAllUsers() as { id: string; firstName: string; lastName: string; fullName: string; }[];
      console.log("Fetched users:", userList);

      setUsers([
        { id: "All Users", fullName: "All Users", firstName: "", lastName: "" },
        ...userList.map((user: { id: string, firstName: string, lastName: string, fullName: string }) => ({
          ...user,
          firstName: user.firstName || "",
          lastName: user.lastName || ""
        }))
      ]);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    const startObj = new Date(start);
    const endObj = new Date(end);
    if (startObj > endObj) {
      setError("Start date cannot be after end date");
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

  const handleUserButtonClick = () => {
    setShowUserOptions(!showUserOptions);
  };

  const handleUserSelect = (user: User) => {
    console.log("User selected:", user);
    setSelectedUser(user);
    setShowUserOptions(false);
  };
  
  const fetchShifts = async (start: string, end: string) => {
    if (!start || !end) return;
    if (!validateDates(start, end)) return;

    try {
      const data = await getAttendanceSummary(start, end, selectedUser?.id === "All Users" ? undefined : selectedUser?.id);
      
      const shiftsWithUserNames = data.map(shift => {
        if (shift.user && shift.user.id) {
          const foundUser = users.find(user => shift.user && user.id === shift.user.id);
          if (foundUser) {
            return {
              ...shift,
              user: {
                ...shift.user,
                fullName: foundUser.fullName
              }
            };
          }
        }
        return shift;
      });
      
      setShifts(shiftsWithUserNames);
    } catch (error) {
      console.error("Error fetching shift data:", error);
      setError("Error loading data. Please try again later.");
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      setEditData({});
    } else {
      const initialEditData: { [key: string]: { startDate: string; startTime: string; endDate: string; endTime: string } } = {};
      
      shifts.forEach((shift) => {
        const startDateTime = new Date(shift.timestamp);
        const endDateTime = shift.endTime ? new Date(shift.endTime) : null;
        
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };
        
        const formatTime = (date: Date) => {
          return date.toTimeString().split(' ')[0].substring(0, 5);
        };
        
        initialEditData[shift.id] = {
          startDate: formatDate(startDateTime),
          startTime: formatTime(startDateTime),
          endDate: endDateTime ? formatDate(endDateTime) : '',
          endTime: endDateTime ? formatTime(endDateTime) : '',
        };
      });
      
      setEditData(initialEditData);
    }
    
    setEditMode(!editMode);
  };

  const handleEditChange = (shiftId: string, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [shiftId]: {
        ...prev[shiftId],
        [field]: value
      }
    }));
  };

  const saveChanges = async () => {
    try {
      for (const shiftId in editData) {
        const shiftData = editData[shiftId];
        const shift = shifts.find(s => s.id === shiftId);
      
        if (!shift) continue;
      
        const startTimestamp = `${shiftData.startDate}T${shiftData.startTime}:00`;
        await editShift(shift.id, { timestamp: startTimestamp, type: "in" });
      
        if (shiftData.endDate && shiftData.endTime && shift.outId) {
          const endTimestamp = `${shiftData.endDate}T${shiftData.endTime}:00`;
          await editShift(shift.outId, { timestamp: endTimestamp, type: "out" });
        }
      }
      
      await fetchShifts(startDate, endDate);
      setEditMode(false);
      setEditData({});
    } catch (error) {
      console.error("Error saving changes:", error);
      setError("Error saving changes");
    }
  };

  const deleteShiftRecord = async (shiftId: string, outId: string | undefined) => {
    try {
      await deleteShift(shiftId);

      if (outId) {
        await deleteShift(outId);
      }

      await fetchShifts(startDate, endDate);
    } catch (error) {
      console.error("Error deleting shift:", error);
      setError("Error deleting the shift");
    }
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
  }, [selectedPeriod, selectedUser]);

  useEffect(() => {
    if (selectedPeriod === "Custom" && startDate && endDate) {
      fetchShifts(startDate, endDate);
    }
  }, [startDate, endDate, selectedPeriod]);

  const exportToExcel = () => {
    if (shifts.length === 0) return;

    const formattedData = shifts.map((shift, index) => ({
      "#": index + 1,
      "User Name": shift.user?.fullName || "N/A", 
      "User ID": shift.user?.id || "N/A",
      "Start Date": new Date(shift.timestamp).toLocaleDateString(),
      "End Date": shift.endTime ? new Date(shift.endTime).toLocaleDateString() : "N/A",
      "Start Time": new Date(shift.timestamp).toLocaleTimeString(),
      "End Time": shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : "N/A",
      "Hours": shift.hours ? shift.hours.toFixed(2) : "N/A",
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
  
    if (editMode && editData[shift.id]) {
      return (
        <tr className="border-b border-gray-100">
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
          {shift.user && shift.user.fullName ? shift.user.fullName : "N/A"}
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            {shift.user?.id || "N/A"}
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            <input
              type="date"
              value={editData[shift.id].startDate}
              onChange={(e) => handleEditChange(shift.id, "startDate", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full text-sm"
            />
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            <input
              type="date"
              value={editData[shift.id].endDate}
              onChange={(e) => handleEditChange(shift.id, "endDate", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full text-sm"
            />
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            <input
              type="time"
              value={editData[shift.id].startTime}
              onChange={(e) => handleEditChange(shift.id, "startTime", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full text-sm"
            />
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            <input
              type="time"
              value={editData[shift.id].endTime}
              onChange={(e) => handleEditChange(shift.id, "endTime", e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full text-sm"
            />
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            {hours}
          </td>
          <td className="py-3 px-4 text-sm text-gray-600 text-center">
            <button
              className="ml-2 py-1 px-2 text-white bg-red-600 rounded-full hover:bg-red-700"
              onClick={() => deleteShiftRecord(shift.id, shift.outId)}
              style={{
                fontSize: "16px",
                padding: "4px 8px",
                cursor: "pointer"
              }}
            >
              <FaTrashAlt />
            </button>
          </td>
        </tr>
      );
    }

    return (
      <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{shift.user?.fullName || "N/A"}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{shift.user?.id || "N/A"}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{startTime.toLocaleDateString()}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{endTime ? endTime.toLocaleDateString() : "N/A"}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{startTime.toLocaleTimeString()}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{endTime ? endTime.toLocaleTimeString() : "N/A"}</td>
        <td className="py-3 px-4 text-sm text-gray-600 text-center">{hours}</td>
      </tr>
    );
  };

  const columnWidths = {
    userName: "14%",
    userId: "10%",   
    date: "14%",
    endDate: "14%",
    startTime: "14%",
    endTime: "14%",
    hours: "10%",
    delete: "10%",
  };

  return (
    <div className="flex items-start justify-start min-h-screen bg-blue-50 pt-10 pl-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">Users Shift Manage</h1>
        <p className="mt-2 text-gray-500">View your users shifts and edit their working hours</p>

        <div className="mt-5 flex flex-col gap-4">
  <div className="mt-5 flex flex-wrap gap-2 items-center">
  {["Day", "Week", "Month", "Custom"].map((period) => (
    <button
      key={period}
      className={`py-2 px-4 rounded-lg ${selectedPeriod === period ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"}`}
      onClick={() => handlePeriodChange(period)}
    >
      {period}
    </button>
  ))}

  <div className="relative">
    <button
      className={`py-2 px-4 rounded-lg ${showUserOptions ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
      onClick={handleUserButtonClick}
    >
      {selectedUser ? `${selectedUser.fullName || ''}` : "Select User"}
    </button>

    {showUserOptions && (
      <div className="absolute top-full left-0 bg-white shadow-md rounded-md z-[9999]" style={{
        maxHeight: '300px',
        overflowY: 'auto',
        width: '100%',
        minWidth: '200px',
        border: '1px solid #ddd',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        {users.length === 0 ? (
          <div className="p-4 text-red-500">No users found!</div>
        ) : (
          users.map((user) => (
            <button
              key={user.id}
              className="block w-full text-left py-2 px-4 hover:bg-gray-100 focus:outline-none"
              onClick={() => handleUserSelect(user)}
            >
              {`${user.fullName} (ID: ${user.id})`}
            </button>
          ))
        )}
      </div>
    )}
  </div>

  {selectedPeriod === "Custom" && (
  <div className="flex flex-wrap items-center gap-2 ms-auto">
    <label htmlFor="startDate" className="text-sm text-gray-600">From:</label>
    <input
      type="date"
      id="startDate"
      value={startDate}
      onChange={(e) => handleStartDateChange(e.target.value)}
      className={`border ${error && error.includes('Start Date') ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 text-gray-800`}
      max={endDate || undefined}
    />
    <span className="mx-1">to</span>
    <input
      type="date"
      id="endDate"
      value={endDate}
      onChange={(e) => handleEndDateChange(e.target.value)}
      className={`border ${error && error.includes('End Date') ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 text-gray-800`}
      min={startDate || undefined}
    />
  </div>
)}


</div>

  
</div>

        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-auto" style={{ maxHeight: "400px" }}>
            
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50 sticky top-0 z-10">
                  <th style={{ width: columnWidths.userName }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    User Name
                  </th>
                  <th style={{ width: columnWidths.userId }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    User ID
                  </th>
                  <th style={{ width: columnWidths.date }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    Start Date
                  </th>
                  <th style={{ width: columnWidths.endDate }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    End Date
                  </th>
                  <th style={{ width: columnWidths.startTime }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    Start Time
                  </th>
                  <th style={{ width: columnWidths.endTime }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    End Time
                  </th>
                  <th style={{ width: columnWidths.hours }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                    Hours
                  </th>
                  {editMode && shifts.length > 0 && (
                    <th style={{ width: columnWidths.delete }} className="py-3 px-4 text-center text-sm font-medium text-gray-600">
                      Delete
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {shifts.length > 0 ? (
                  shifts.map((shift, index) => <ShiftRecord key={index} shift={shift} />)
                ) : (
                  <tr>
                    <td colSpan={editMode ? 8 : 7} className="py-8 text-center text-gray-500">
                      No shifts found for selected period
                    </td>
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
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
                <button
                  className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                  onClick={toggleEditMode}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                  onClick={toggleEditMode}
                  disabled={shifts.length === 0}
                >
                  Edit
                </button>
                <button
                  className={`flex items-center py-2 px-4 ${shifts.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400`}
                  onClick={exportToExcel}
                  disabled={shifts.length === 0}
                >
                  <span>Export Report</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersShiftsPage;