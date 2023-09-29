import { MouseEventHandler, useEffect } from "react";
import { Statement } from "../language/ast"
import Renderer from "../render/render";
import { Box } from "@chakra-ui/layout";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/button";

type SequenceProps = {
    statements: Statement[];
}

const render = (statements: Statement[], ctx: CanvasRenderingContext2D, width: number) => {
    const renderer = new Renderer(statements, ctx, width);
    renderer.render()
}

export default function Sequence({ statements }: SequenceProps) {

    useEffect(() => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;

        ctx.scale(devicePixelRatio, devicePixelRatio);

        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,canvas.width,canvas.height)
        ctx.fillStyle = 'black';
        render(statements, ctx, canvas.width);
    })

    const handleClick:MouseEventHandler<HTMLAnchorElement> = (e) => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        e.currentTarget.href = canvas.toDataURL('image/png',1);
    }
    return (
        <div className="h-full">
            <Box position="fixed" bottom={4} right={4} zIndex={2}>
                <a onClick={handleClick} download="sequence.png"><IconButton aria-label="Download button" colorScheme="blue" icon={<ArrowDownIcon />} /></a>
            </Box>
            <canvas className="h-full w-full" id="canvas"></canvas>
        </div>
    )
}