import React, { use, useEffect } from "react";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import "./index.css";
import "./App.css";
import AppRouter from "./routes/AppRouter";

export default function App() {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

  return (
    <AppRouter user={user} setUser={setUser}/>
  );
}


