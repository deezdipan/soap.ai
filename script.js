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
  document.getElementById("profileInfo").innerHTML = `
    <strong><u>Profile</u></strong>:<br>
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
  openTab('pdf1Tab');
}

function closeOntologyModal() {
  document.getElementById("ontologyModal").style.display = "none";
}

function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';

  if (tabId === 'pdf1Tab') {
    loadInterventionButtons('pdf1Tab', 'intervention.json');
  } else if (tabId === 'blankTab') {
    drawBlankGraph('blankTab');
  }
}

function loadInterventionButtons(tabId, file) {
  fetch(file)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('interventionButtons');
      container.innerHTML = ''; // Clear any previous buttons
      data.interventions.forEach((intervention, i) => {
        const btn = document.createElement("button");
        btn.textContent = `Intervention ${i + 1}`;
        btn.className = "tab-button";
        btn.onclick = () => drawAttributeGraph(tabId, intervention);
        container.appendChild(btn);
      });
    });
}

function drawAttributeGraph(tabId, intervention) {
  const svg = d3.select(`#${tabId} svg`);
  svg.selectAll("*").remove();

  const keys = Object.keys(intervention).filter(k => k !== "Short_Name");
  const nodes = [
    { id: "Intervention", group: 1 },
    ...keys.map(key => ({
      id: key.replace(/_/g, " "),
      value: intervention[key],
      group: 2
    }))
  ];

  const links = nodes.slice(1).map(n => ({
    source: "Intervention",
    target: n.id
  }));

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(130))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(250, 200));

  const link = svg.append("g")
    .selectAll("line")
    .data(links)
    .enter().append("line")
    .style("stroke", "#aaa");

  const nodeGroup = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
    .call(d3.drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded));

  nodeGroup.append("circle")
    .attr("r", 30)
    .style("fill", d => d.group === 1 ? "#ff6666" : "#6495ED")
    .on("click", function (_, d) {
      if (d.id !== "Intervention") {
        if (confirm(`Remove "${d.id}"?`)) {
          // Remove node visually
          d3.select(this.parentNode).remove();
    
          // Filter out the node and all its related links
          const updatedNodes = nodes.filter(n => n.id !== d.id);
          const updatedLinks = links.filter(l => l.source.id !== d.id && l.target.id !== d.id);
    
          // Remove lingering lines from DOM
          svg.selectAll("line")
            .filter(l => l.source.id === d.id || l.target.id === d.id)
            .remove();
    
          // Restart simulation with updated data
          simulation.nodes(updatedNodes);
          simulation.force("link").links(updatedLinks);
          simulation.alpha(1).restart();
    
          // Update the "nodes" and "links" arrays in memory if needed
          nodes.length = 0;
          nodes.push(...updatedNodes);
          links.length = 0;
          links.push(...updatedLinks);
        }
      }
    })
    
    .on("mouseover", function (event, d) {
      if (d.value) showTooltip(event, d.id, d.value);
    })
    .on("mouseout", hideTooltip);

  nodeGroup.append("text")
    .attr("text-anchor", "middle")
    .style("fill", "black")
    .style("font-size", "9px")
    .selectAll("tspan")
    .data(d => d.id.split(" ").reduce((acc, word, i) => {
      if (i % 2 === 0) acc.push(word);
      else acc[acc.length - 1] += " " + word;
      return acc;
    }, []))
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => i === 0 ? "0.35em" : "1.2em")
    .text(d => d);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
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

  // set up "View All Info"
  const viewBtn = document.getElementById("viewAllBtn");
  viewBtn.onclick = () => {
    const content = nodes
      .filter(n => n.id !== "Intervention")
      .map(n => `<div class="detail-section"><h3>${n.id}</h3><p>${n.value}</p></div>`)
      .join("");
    document.getElementById("detailsContent").innerHTML = content;
    document.getElementById("detailsModal").style.display = "block";
  };
}

function drawBlankGraph(tabId) {
  const nodes = [
    { id: "Example A", value: "Just a test node" },
    { id: "Example B", value: "Another example node" }
  ];
  const links = [{ source: "Example A", target: "Example B" }];
  drawAttributeGraph(tabId, nodes);
}

function showTooltip(event, title, text) {
  const tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = `<strong>${title}</strong><br>${text}`;
  tooltip.style.display = "block";
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip() {
  document.getElementById("tooltip").style.display = "none";
}

function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeOntologyModal();
    closeDetailsModal();
  }
});

document.getElementById("ontologyModal").addEventListener("click", function (e) {
  if (e.target === this) closeOntologyModal();
});

document.getElementById("detailsModal").addEventListener("click", function (e) {
  if (e.target === this) closeDetailsModal();
});
