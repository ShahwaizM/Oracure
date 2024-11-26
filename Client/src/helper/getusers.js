// Fetch all dentists
export const fetchDentists = async () => {
  try {
    const response = await fetch("http://localhost:5000/auth/dentists");
    const dentists = await response.json();
    return dentists;
  } catch (error) {
    console.error("Error fetching dentists:", error);
  }
};

// Fetch all patients
export const fetchPatients = async () => {
  try {
    const response = await fetch("http://localhost:5000/auth/patients");
    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};
// getusers.js
export const fetchsingleDentist = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/auth/getDentist/${id}`);
    const fetchedDentist = await response.json(); // Await the response properly
    console.log("Response data: ", fetchedDentist);
    return fetchedDentist;
  } catch (error) {
    console.error("Error fetching Dentist", error);
  }
};
export const bookAppointmentAPI = async (
  doctorId,
  selectedDay,
  selectedTime,
  token
) => {
  const response = await fetch(
    `http://localhost:5000/auth/appointmentbooking/${doctorId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Send the token in the Authorization header
      },
      body: JSON.stringify({ selectedDay, selectedTime }),
    }
  );
  return await response.json();
};
