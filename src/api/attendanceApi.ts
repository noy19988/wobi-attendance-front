import axios from "axios";

export interface Shift {
    id: string;
    startTime: string;
    endTime: string;
    date: string;
    hours: number;
    timestamp: string;
    user?: {  
      id: string;
      fullName?: string; 
    };
  }
  

interface AttendanceSummary {
  userId: string;
  from: string;
  to: string;
  totalHours: number;
  totalMinutes: number;
  records: Shift[];
}

interface ShiftResponse {
  message: string;
  record?: {
    id: string;
    timestamp: string;
  };
  shift?: {
    id: string;
    timestamp: string;
    user: {
      id: string;
      username: string;
    };
  };
}


const API_URL = "http://localhost:3000/attendance";

export const startShift = async (): Promise<ShiftResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.post<ShiftResponse>(`${API_URL}/start`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error starting shift:", error);
    throw new Error("Failed to start shift.");
  }
};

export const endShift = async (): Promise<ShiftResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.post<ShiftResponse>(`${API_URL}/end`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error ending shift:", error);
    throw new Error("Failed to end shift.");
  }
};

export const getCurrentShift = async (): Promise<ShiftResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.get<ShiftResponse>(`${API_URL}/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current shift:", error);
    throw new Error("Failed to fetch current shift.");
  }
};

export const getShiftHistory = async (
  startDate: string,
  endDate: string
): Promise<Shift[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  try {
    const response = await axios.get<AttendanceSummary | AttendanceSummary[]>(
      `${API_URL}/summary`,
      {
        params: {
          from: startDate,
          to: endDate,
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return data.flatMap((summary) => summary.records ?? []);
    } else if (data.records) {
      return data.records;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching shift history:", error);
    throw new Error("Failed to fetch shift history.");
  }
};


export const getAttendanceSummary = async (
  startDate: string,
  endDate: string,
  userId?: string
): Promise<Shift[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.get<AttendanceSummary | AttendanceSummary[]>(
      `${API_URL}/summary`,
      {
        params: {
          from: startDate,
          to: endDate,
          userId: userId || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (Array.isArray(data)) {
      return data.flatMap((summary) => summary.records ?? []);
    } else if (data.records) {
      return data.records;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    throw new Error("Failed to fetch attendance summary.");
  }
};

export const getAllUsers = async (): Promise<{ id: string; fullName: string }[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.get("http://localhost:3000/auth/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = (response.data as { users: { id: string; fullName: string }[] }).users;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users.");
  }
};

export const editShift = async (
  shiftId: string,
  updatedData: { timestamp: string; type: "in" | "out" }
) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.put(
      `http://localhost:3000/attendance/edit/${shiftId}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating shift:", error);
    throw new Error("Failed to update shift.");
  }
};

export const deleteShift = async (shiftId: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found in localStorage");

  try {
    const response = await axios.delete(
      `http://localhost:3000/attendance/delete/${shiftId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting shift:", error);
    throw new Error("Failed to delete shift.");
  }
};
