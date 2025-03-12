import axios from "axios";
import dotenv from "dotenv";

if (process.env.ENVIRONMENT === "LOCAL") {
  dotenv.config();
}

let api_url =
  process.env.COURSE_API ||
  "https://stage.phoenix.edu/services/courses/v1/templates/curriculum";

const getCourseInfo = async (courseCode) => {
  const url = `${api_url}?courseCode=${courseCode}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching course info:", error);
    throw error;
  }
};

if (process.env.ENVIRONMENT === "LOCAL") {
  getCourseInfo("CMGT/556")
    .then((data) => {
      console.log("data", data);
    })
    .catch((error) => {
      console.error("Error fetching course info:", error);
    });
}

export default getCourseInfo;
