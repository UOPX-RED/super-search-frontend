import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ResultsPage from "./pages/ResultsPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";
import { Button } from "@mui/material";

function App() {
  const path = window.location;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (urlParams.has("token")) {
      const token = urlParams.get("token") as string;

      try {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = tokenParts[1];
          const decodedJWT = JSON.parse(atob(payload));

          localStorage.setItem("userName", decodedJWT.name || "User");
          localStorage.setItem(
            "userEmail",
            decodedJWT.email || decodedJWT.preferred_username || ""
          );
          localStorage.setItem("userExp", decodedJWT.exp?.toString() || "0");
          localStorage.setItem("userToken", token);

          urlParams.delete("token");
          const newUrl =
            path.pathname + (urlParams.toString() ? `?${urlParams}` : "");
          window.history.replaceState({}, "", newUrl);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }

    if (localStorage.getItem("userToken")) {
      const expTime = Number(localStorage.getItem("userExp") || "0");
      if (expTime && expTime < Date.now() / 1000) {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userExp");
        localStorage.removeItem("userToken");

        localStorage.setItem("lastRoute", path.pathname);

        redirectToLogin();
      } else {
        setAuth(true);
      }
    } else {
      setAuth(false);
    }

    localStorage.setItem("lastRoute", path.pathname);
  }, [path.pathname, queryString]);

  const redirectToLogin = async () => {
    try {
      const baseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : window.location.origin;

      window.location.href = `${baseUrl}/auth/init`;
    } catch (error) {
      console.error("Login redirect error:", error);
    }
  };

  if (!auth) {
    return (
      <div className="p-4 h-screen w-full flex justify-center items-center">
        <Button
          variant="contained"
          onClick={redirectToLogin}
          sx={{
            backgroundColor: "#0CBC8B",
            color: "#FFFFFF",
            borderRadius: "100px",
            fontFamily: "Inter, sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#0aa87a",
            },
          }}
        >
          Login to Begin
        </Button>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/results/:id" element={<ResultDetailsPage />} />
    </Routes>
  );
}

export default App;
