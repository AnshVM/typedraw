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
        <div className="h-full">
            <CodeEditor
                value={input}
                onValueChange={code => handleChange(code)}
                highlight={() => scanner.highlited.join('')}
                padding={2}
                className="container__editor bg-gray-100 w-96
                mx-auto rounded-lg font-mono h-full"
            />
        </div>
    )
}