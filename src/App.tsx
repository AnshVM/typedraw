import { useEffect, useState } from "react"
import Editor from "./components/editor"
import './style.css'
import Scanner, { Token } from "./language/scanner";

const scan = (code:string):Scanner => {
  const scanner = new Scanner(code);
  scanner.scanTokens();
  return scanner;
}


function App() {
  const [input,setInput] = useState('');

  return (
    <div className='h-screen'>
      <Editor input={input} setInput={setInput} scanner={scan(input)}/>
    </div>
  )
}

export default App