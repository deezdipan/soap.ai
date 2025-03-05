const patientData = {
    patient1: {
        age: "30",
        gender: "Male",
        disorder: "Anxiety",
        weakness: "Social Interaction",
        strength: "Resilience",
        target: "Improve confidence"
    },
    patient2: {
        age: "25",
        gender: "Female",
        disorder: "Depression",
        weakness: "Low Energy",
        strength: "Creativity",
        target: "Enhance motivation"
    }
};

function showProfile() {
    let patient = document.getElementById("patient").value;
    let data = patientData[patient];
    document.getElementById("profileInfo").innerHTML = 
        `Profile:<br>
        Age: ${data.age}<br>
        Gender: ${data.gender}<br>
        Disorder: ${data.disorder}<br>
        Weakness: ${data.weakness}<br>
        Strength: ${data.strength}<br>
        Target: ${data.target}`;
}

function recommendIntervention() {
    alert("Recommending interventions based on patient profile...");
}

function openOntologyModal() {
    document.getElementById("ontologyModal").style.display = "block";
    drawOntologyGraph();
}

function closeOntologyModal() {
    document.getElementById("ontologyModal").style.display = "none";
}

// function drawOntologyGraph() {
//     const width = 500, height = 400;
//     const svg = d3.select("svg");
//     svg.selectAll("*").remove();
    
//     const graph = {
//         nodes: [
//             { id: "Intervention", group: 1 },
//             { id: "Cognitive Therapy", group: 2 },
//             { id: "Medication", group: 2 },
//             { id: "Support Groups", group: 2 },
//             { id: "Lifestyle Changes", group: 2 }
//         ],
//         links: [
//             { source: "Intervention", target: "Cognitive Therapy" },
//             { source: "Intervention", target: "Medication" },
//             { source: "Intervention", target: "Support Groups" },
//             { source: "Intervention", target: "Lifestyle Changes" }
//         ]
//     };

//     const simulation = d3.forceSimulation(graph.nodes)
//         .force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
//         .force("charge", d3.forceManyBody().strength(-300))
//         .force("center", d3.forceCenter(width / 2, height / 2));

//     const link = svg.selectAll("line")
//         .data(graph.links)
//         .enter().append("line")
//         .style("stroke", "#999")
//         .style("stroke-width", 2);

//     const node = svg.selectAll("circle")
//         .data(graph.nodes)
//         .enter().append("circle")
//         .attr("r", 10)
//         .style("fill", d => d.group === 1 ? "red" : "blue");

//     simulation.on("tick", () => {
//         link.attr("x1", d => d.source.x)
//             .attr("y1", d => d.source.y)
//             .attr("x2", d => d.target.x)
//             .attr("y2", d => d.target.y);

//         node.attr("cx", d => d.x)
//             .attr("cy", d => d.y);
//     });
// }

function drawOntologyGraph() {
const width = 500, height = 400;
const svg = d3.select("svg");
svg.selectAll("*").remove();

const graph = {
nodes: [
    { id: "Intervention", group: 1 },
    { id: "Cognitive Therapy", group: 2 },
    { id: "Medication", group: 2 },
    { id: "Support Groups", group: 2 },
    { id: "Lifestyle Changes", group: 2 }
],
links: [
    { source: "Intervention", target: "Cognitive Therapy" },
    { source: "Intervention", target: "Medication" },
    { source: "Intervention", target: "Support Groups" },
    { source: "Intervention", target: "Lifestyle Changes" }
]
};

const simulation = d3.forceSimulation(graph.nodes)
.force("link", d3.forceLink(graph.links).id(d => d.id).distance(100))
.force("charge", d3.forceManyBody().strength(-300))
.force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.selectAll("line")
.data(graph.links)
.enter().append("line")
.style("stroke", "#999")
.style("stroke-width", 2);

const node = svg.selectAll("g")
.data(graph.nodes)
.enter().append("g") // Create group elements to contain circles and text
.call(d3.drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded));

node.append("circle")
.attr("r", 40)  // Increased radius for better label fitting
.style("fill", d => d.group === 1 ? "red" : "blue");

node.append("text")
.attr("text-anchor", "middle")  // Center text horizontally
.attr("dy", "0.35em")  // Center text vertically
.style("fill", "white")  // Make text readable inside nodes
.style("font-size", "10px")
.text(d => d.id);

simulation.on("tick", () => {
link.attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

node.attr("transform", d => `translate(${d.x},${d.y})`);
});

function dragStarted(event, d) {
if (!event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function dragged(event, d) {
d.fx = event.x;
d.fy = event.y;
}

function dragEnded(event, d) {
if (!event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}
}