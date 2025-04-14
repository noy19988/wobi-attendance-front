import axios from 'axios';

// טיפוס עבור התשובה שמתקבלת לאחר התחלת וסיום משמרת
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

// התחלת משמרת
export const startShift = async (): Promise<ShiftResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    const response = await axios.post<ShiftResponse>(`${API_URL}/start`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,  // שלח את הטוקן כאן
      },
      withCredentials: true,  // לוודא שאתה שולח את הקוקיז גם אם יש צורך
    });
    return response.data;
  } catch (error) {
    console.error("Error starting shift:", error);
    throw new Error("Failed to start shift.");
  }
};

// סיום משמרת
export const endShift = async (): Promise<ShiftResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found in localStorage");
    }

    const response = await axios.post<ShiftResponse>(`${API_URL}/end`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,  // שלח את הטוקן כאן
      },
      withCredentials: true,  // לוודא שאתה שולח את הקוקיז גם אם יש צורך
    });
    return response.data;
  } catch (error) {
    console.error("Error ending shift:", error);
    throw new Error("Failed to end shift.");
  }
};


export const getCurrentShift = async (): Promise<ShiftResponse> => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token retrieved:", token);  // הדפס את הטוקן שנשלח
  
      if (!token) {
        throw new Error("No token found in localStorage");
      }
  
      console.log(`Fetching current shift from: ${API_URL}/current`);  // הדפסת ה-URL של הבקשה
      const response = await axios.get<ShiftResponse>(`${API_URL}/current`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        withCredentials: true,
      });
  
      console.log("Response from /current API:", response);  // הדפס את התשובה שהתקבלה מה-API
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching current shift:", error.message);  // הדפסת השגיאה
      } else {
        console.error("Error fetching current shift:", error); 
      }
      throw new Error("Failed to fetch current shift.");
    }
  };