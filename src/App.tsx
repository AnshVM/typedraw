import { useState } from "react"
import Editor from "./components/editor"
import './style.css'
import Scanner from "./language/scanner";
import Parser from "./language/parser";
import { Statement } from "./language/ast";
import Sequence from "./components/sequence";
import { ChakraProvider} from '@chakra-ui/react'

const DEFAULT_CODE = `actor A = "Actor 1";
actor B = "Actor 2";
actor C = "Actor 3";
action A -> B = "First action";
action B -> C = "Second action";
action B <- C = "Third action";
action A <- B = "Final action";`

const scan = (code: string): Scanner => {
  const scanner = new Scanner(code);
  scanner.scanTokens();
  return scanner;
}

const parse = (scanner: Scanner, input: string): Statement[] => {
  const parser = new Parser(scanner.tokens, input);
  return parser.parse()
}

function App() {
  const [input, setInput] = useState(DEFAULT_CODE);

  const scanner = scan(input);
  const statements = parse(scanner, input);

  return (
    <ChakraProvider>
      <div className="h-screen flex flex-col">
        <div className='flex flex-row h-full'>
          <div className="">
            <Editor input={input} setInput={setInput} scanner={scanner} />
          </div>

          <div className="w-full">
            <Sequence statements={statements} />
          </div>
        </div>
      </div>
    </ChakraProvider>
  )
}

export default App