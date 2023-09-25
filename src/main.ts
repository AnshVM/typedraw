import './style.css'
import Parser from './language/parser'
import Renderer from './render/render'
import Scanner from './language/scanner'

const source = `
    actor client = "Client";
    actor server = "Server";
    actor database = "Database";

    action client -> server = "Request for data";
    action server -> database = "Run sql query";
    action database -> server = "Send data";
    action server -> client = "send process data";
`

const scanner = new Scanner(source);
const tokens = scanner.scanTokens();
const parser = new Parser(tokens, source);
const statements = parser.parse();

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const renderer = new Renderer(statements, context, canvas.width);
renderer.render();
