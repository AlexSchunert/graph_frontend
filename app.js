import { Graph } from 'graphology';
import { write } from 'graphology-gexf';

//document.body.onload = addElement;

async function import_graphml_file() {
    let input = document.createElement('input');
    const new_div = document.createElement("div");

    input.type = 'file';
    input.onchange = _ => handle_file_input(input, new_div);
    input.click();
}
window.import_graphml_file = import_graphml_file

async function handle_file_input(input, new_div) {
    // you can use this method to get file and perform respective operations
    let files = Array.from(input.files);
    console.log(files);
    console.log(files[0].type);
    const load_confirmation = document.createTextNode("Load File: " + files[0].name);
    new_div.appendChild(load_confirmation);
    //const current_div = document.getElementById("div1");
    document.body.appendChild(new_div)

    try {
        const file_content = await load_txt_file(files[0]);
        const host = window.location.host;
        const host_textfile_route = "http://" + host + "/text_file"
        console.log(file_content)
        //console.log("http://" + host + "/text_file");
        fetch(host_textfile_route, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(file_content),
        })
            .then(response => response.json()) // Assuming the server responds with JSON
            .then(data => {
                console.log('Response from server:', data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }
    catch (error) {
        console.error(error);
    }
}


async function load_txt_file(file) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
            //console.log(reader.result);
        }
        reader.onerror = () => {
            reject(reader.error);

        };
        reader.readAsText(file);
    })
}

// JavaScript for the interactive canvas

// Get a reference to the canvas element and its 2D context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Array to store information about the circles
var circles = [];
var lines = [];
var circlesToAddToGraph = [];
var linesToAddToGraph = [];

// Graph structure
const graph = new Graph();

// Variable to keep track of the circle currently being dragged
var selectedCircle = null;
var startCircleSelected = null;
var endCircleSelected = null;

// Function to create a new circle
function createCircle(id, x, y) {
    return {
        x: x,
        y: y,
        radius: 20,
        id: id,
        color: "#CCCCCC"
    };
}

function createLine(start, end) {
    return {
        start: start,
        end: end,
        color: "#AAAAAA"
    }
}


function updateGraph() {

    //var gefx = require('graphology-gexf');
    circlesToAddToGraph.forEach(circle => {
        graph.addNode(circle.id);
    });

    linesToAddToGraph.forEach(line => {
        if (!checkEdgeIsDuplicate(line)) {
            graph.addEdge(line.start.id, line.end.id);
        }

    });

    linesToAddToGraph = [];
    circlesToAddToGraph = [];

    //const graphMLString = exportToGraphML(graph);
    const gexfString = write(graph);
    console.log(gexfString);
}

function checkEdgeIsDuplicate(line) {

    var isDuplicate = false;

    graph.forEachEdge((edge, attributes, source, target) => {

        if ((source == line.start.id && target == line.end.id) ||
            target == line.start.id && source == line.end.id) {
            isDuplicate = true;
        }

        //console.log(`Edge ${source} -> ${target} with attributes:`, attributes);
    });

    return isDuplicate;
}

// Function to generate a random color
/*
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
*/

// Function to draw a circle
function drawCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();

    // Add id as text 
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = circle.id.toString();
    ctx.fillText(text, circle.x, circle.y);

    ctx.closePath();
}

function drawLine(line) {
    ctx.moveTo(line.start.x, line.start.y); // Move the "pen" to the starting point
    ctx.lineTo(line.end.x, line.end.y); // Draw a line to the ending point
    ctx.stroke();
    ctx.closePath();
}

// Redraw canvas 
function reDrawCanvas() {
    clearCanvas();
    circles.forEach(drawCircle);
    lines.forEach(drawLine);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearGraph() {
    circles = [];
    lines = [];
    clearCanvas();
    graph.clear();
}
window.clearGraph = clearGraph



function addNewCircle(x, y) {
    const id = circles.length;
    var newCircle = createCircle(id, x, y);
    circles.push(newCircle);
    circlesToAddToGraph.push(newCircle);
    drawCircle(newCircle);
}

// Determines mouse over circle 
function mouseInCircle(circles, x, y) {
    // Check if the mouse click is inside any circle
    for (var i = circles.length - 1; i >= 0; i--) {
        var circle = circles[i];
        var dx = x - circle.x;
        var dy = y - circle.y;
        if (dx * dx + dy * dy <= circle.radius * circle.radius) {
            // Start dragging this circle
            selectedCircle = circle;
            return true;
        }
    }
    return false;

}


// Function to handle mouse down events
function onMouseDown(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    var circle_selected = false;

    if (event.button == 0) {
        circle_selected = mouseInCircle(circles, x, y);
        // If no circle is clicked, create a new one
        if (circle_selected == false) {
            addNewCircle(x, y);
        }
    }
    else if (event.button == 2) {
        circle_selected = mouseInCircle(circles, x, y);
        startCircleSelected = selectedCircle;
        selectedCircle = null;

    }

}

// Function to handle mouse move events
function onMouseMove(event) {

    if (selectedCircle) {
        var x = event.offsetX;
        var y = event.offsetY;
        selectedCircle.x = x;
        selectedCircle.y = y;

        // Redraw the canvas
        reDrawCanvas();

    }
}

// Function to handle mouse up events
function onMouseUp(event) {

    if (event.button == 2 && startCircleSelected != null) {
        var x = event.offsetX;
        var y = event.offsetY;
        mouseInCircle(circles, x, y)
        endCircleSelected = selectedCircle;

        if (endCircleSelected != null &&
            endCircleSelected.x != startCircleSelected.x &&
            endCircleSelected.y != startCircleSelected.y) {
            var newLine = createLine(startCircleSelected, endCircleSelected);
            lines.push(newLine);
            linesToAddToGraph.push(newLine);
        }
    }

    selectedCircle = null;
    startCircleSelected = null;
    endCircleSelected = null;
    reDrawCanvas();
    updateGraph();
    console.log(graph)

}



// Attach event listeners
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});


