//document.body.onload = addElement;

async function import_graphml_file() {
    let input = document.createElement('input');
    const new_div = document.createElement("div");

    input.type = 'file';
    input.onchange = _ => handle_file_input(input, new_div);
    input.click();
}

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

// Create an empty graph
var nodes = [];
var links = [];

// Initialize the D3.js force simulation
var width = 600;
var height = 400;

var svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-300))
    .force("link", d3.forceLink(links).distance(100))
    .force("center", d3.forceCenter(600, 400));
//.force("center", d3.forceCenter(width / 2, height / 2));

// Create functions to add nodes and edges
d3.select("#add-node").on("click", addNode);
d3.select("#add-edge").on("click", addEdge);

function addNode() {
    nodes.push({ id: nodes.length });
    updateGraph();
}

function addEdge() {
    var node1 = parseInt(document.getElementById("node1").value);
    var node2 = parseInt(document.getElementById("node2").value);

    if (isNaN(node1) || isNaN(node2) || node1 === node2) {
        alert("Invalid node IDs. Please enter valid IDs.");
        return;
    }

    links.push({ source: node1, target: node2 });
    updateGraph();
}

function updateGraph() {
    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link");

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 30)
        .style("fill", "orange")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

    node.exit().remove();
    link.exit().remove();
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alpha(1).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

