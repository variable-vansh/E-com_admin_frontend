import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout.jsx";
import AppRouter from "./router";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <AppRouter />
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
