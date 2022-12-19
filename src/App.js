import * as component from './components';
import * as layout from './layouts';


function App() {
  return (
    <div className="App text-5xl text-red-500 bg-gray-200">
      <layout.Navbar />
      <layout.Container>
        <component.Calendar>
        </component.Calendar>
      </layout.Container>
    </div>
  );
}

export default App;
