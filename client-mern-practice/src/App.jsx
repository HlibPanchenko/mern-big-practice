import "./App.scss";
import Registration from "./components/auth/Registration";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Registration />
    </div>
  );
}

export default App;
