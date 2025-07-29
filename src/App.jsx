import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRouter from "./router";
import "./App.css";

function App() {
  return (
    <Router basename="/admin">
      <AppRouter />
      <Toaster />
    </Router>
  );
}

export default App;
