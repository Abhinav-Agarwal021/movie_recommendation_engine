import { useState } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [input, setInput] = useState("")

  const sendReq = () => {
    axios.post('http://localhost:5000/recommend', { "movie": input }).then(data => console.log(data))
    setInput("")
  }

  return (
    <div className="App">
      <input value={input} onChange={(e) => setInput(e.target.value)}></input>
      <button onClick={sendReq}>Recommend</button>
    </div>
  );
}

export default App;
