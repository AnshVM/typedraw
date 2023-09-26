import React from "react"
import CodeEditor from 'react-simple-code-editor';
import '../styles/editor.css'
import Scanner from "../language/scanner";


type EditorProps = {
    input:string;
    setInput:React.Dispatch<React.SetStateAction<string>>;
    scanner:Scanner;
}

export default function Editor({input,setInput,scanner}:EditorProps) {

    const handleChange = (code:string) => {
        setInput(code);
    }    

    return (
        <div className="py-10">
            <CodeEditor
                value={input}
                onValueChange={code => handleChange(code)}
                highlight={() => scanner.highlited.join('')}
                padding={10}
                className="container__editor bg-gray-100 h-52 w-1/2 
                mx-auto rounded-lg font-mono"
            />
        </div>
    )
}