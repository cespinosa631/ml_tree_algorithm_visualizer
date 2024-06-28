import "./App.css";
import GuiCanvas from "./components/guiCanvas/guiCanvas.js";
import SetSummary from "./components/discription/discription";
//import TextInANest from './components/discription/endDiscr';
function App() {
  return (
    <div className="App">
      <div className="dis">
        <SetSummary />
      </div>
      <div>
        <GuiCanvas />
      </div>
      <div className="credit"></div>
    </div>
  );
}

export default App;
