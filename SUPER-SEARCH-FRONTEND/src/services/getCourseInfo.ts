import axios from "axios";

const api_url =
  import.meta.env.VITE_COURSE_API ||
  "/courses/v1/templates/curriculum";

const getCourseInfo = async (courseCode: string) => {
  const url = `${api_url}?courseCode=${courseCode}`;
  try {
    const response = await axios.get(url);
    const text = response.data.title + " " + response.data.description;
    // console.log("test:", text);
    return text
  } catch (error) {
    console.error("Error fetching course info:", error);
    throw error;
  }
};

export default getCourseInfo;
