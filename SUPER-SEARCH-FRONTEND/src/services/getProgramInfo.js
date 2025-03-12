import axios from "axios";
import dotenv from "dotenv";

if (process.env.ENVIRONMENT === "LOCAL") {
  dotenv.config();
}

let api_url =
  process.env.PROGRAMS_API ||
  `https://stage.phoenix.edu/services/programs/v2/templates?$filter=programId eq 'BSB/A' and version eq '025A'`;

const getProgramInfo = async (programCode, version) => {
  const url = `${api_url}?$filter=programId eq '${programCode}' and version eq '${version}'`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching course info:", error);
    throw error;
  }
};

if (process.env.ENVIRONMENT === "LOCAL") {
  getProgramInfo("BSB/A", "025A")
    .then((data) => {
      console.log("data", data);
    })
    .catch((error) => {
      console.error("Error fetching course info:", error);
    });
}

export default getProgramInfo;
