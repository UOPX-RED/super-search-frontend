import axios from "axios";
// import dotenv from "dotenv";

// if (import.meta.env.VITE_ENVIRONMENT === "LOCAL") {
//   dotenv.config();
// }

const api_url =
  import.meta.env.VITE_COURSE_API ||
  "/courses/v1/templates/curriculum";

const getCourseInfo = async (courseCode: string) => {
  const url = `${api_url}?courseCode=${courseCode}`;
  try {
    const response = await axios.get(url);
    const text = response.data.title + " " + response.data.description;
    console.log("test", text)
    return text
  } catch (error) {
    console.error("Error fetching course info:", error);
    throw error;
  }
};

if (import.meta.env.VITE_ENVIRONMENT === "LOCAL") {
  getCourseInfo("CMGT/556")
    .then((data) => {
      console.log("data", data);
    })
    .catch((error) => {
      console.error("Error fetching course info:", error);
    });
}

export default getCourseInfo;
