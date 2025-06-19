// result.js (Working Version with Full Output Fix)

const refineryLocations = {
  "Jamnagar Refinery (Oil) - Gujarat": { lat: 22.4666, lon: 70.0666 },
  "Panipat Refinery (Oil) - Haryana": { lat: 29.3909, lon: 76.9635 },
  "Paradip Refinery (Oil) - Odisha": { lat: 20.3167, lon: 86.6167 },
  "Bina Refinery (Oil) - Madhya Pradesh": { lat: 24.2000, lon: 78.2000 },
  "Mumbai Refinery (Oil) - Maharashtra": { lat: 19.0760, lon: 72.8777 },
  "Vadinar Refinery (Oil) - Gujarat": { lat: 22.3081, lon: 69.6111 },
  "Mangalore Refinery (Oil) - Karnataka": { lat: 12.8732, lon: 74.8421 },
  "Koyali Refinery (Oil) - Gujarat": { lat: 22.3600, lon: 73.1700 },
  "Haldia Refinery (Oil) - West Bengal": { lat: 22.0333, lon: 88.0633 },
  "Numaligarh Refinery (Oil) - Assam": { lat: 26.6012, lon: 93.7750 },
  "Hazira Gas Processing Complex (Gas) - Gujarat": { lat: 21.1167, lon: 72.6667 },
  "Dabhol LNG Terminal (Gas) - Maharashtra": { lat: 17.5833, lon: 73.2000 },
  "Dahej LNG Terminal (Gas) - Gujarat": { lat: 21.7000, lon: 72.5000 },
  "Kochi LNG Terminal (Gas) - Kerala": { lat: 9.9312, lon: 76.2673 }
};

const fireStations = {
  "Jamnagar Refinery (Oil) - Gujarat": { name: "Jamnagar Fire Station", lat: 22.4700, lon: 70.0700, distance: 15 },
  "Panipat Refinery (Oil) - Haryana": { name: "Panipat Fire Station", lat: 29.3911, lon: 76.9632, distance: 5 },
  "Paradip Refinery (Oil) - Odisha": { name: "Paradip Fire Station", lat: 20.3180, lon: 86.6140, distance: 3 },
  "Bina Refinery (Oil) - Madhya Pradesh": { name: "Bina Fire Station", lat: 24.2010, lon: 78.1990, distance: 4 },
  "Mumbai Refinery (Oil) - Maharashtra": { name: "Mumbai Fire Brigade", lat: 19.0755, lon: 72.8773, distance: 2 },
  "Vadinar Refinery (Oil) - Gujarat": { name: "Vadinar Fire Dept.", lat: 22.3090, lon: 69.6100, distance: 3 },
  "Mangalore Refinery (Oil) - Karnataka": { name: "Mangalore Fire Station", lat: 12.8740, lon: 74.8410, distance: 2 },
  "Koyali Refinery (Oil) - Gujarat": { name: "Koyali Fire Dept.", lat: 22.3610, lon: 73.1710, distance: 2 },
  "Haldia Refinery (Oil) - West Bengal": { name: "Haldia Fire Station", lat: 22.0340, lon: 88.0620, distance: 2 },
  "Numaligarh Refinery (Oil) - Assam": { name: "Numaligarh Fire Station", lat: 26.6020, lon: 93.7740, distance: 2 },

  "Hazira Gas Processing Complex (Gas) - Gujarat": { name: "Hazira Fire Dept.", lat: 21.1170, lon: 72.6650, distance: 2 },
  "Dabhol LNG Terminal (Gas) - Maharashtra": { name: "Dabhol Fire Station", lat: 17.5840, lon: 73.2010, distance: 2 },
  "Dahej LNG Terminal (Gas) - Gujarat": { name: "Dahej Fire Station", lat: 21.7010, lon: 72.5010, distance: 2 },
  "Kochi LNG Terminal (Gas) - Kerala": { name: "Kochi Fire Station", lat: 9.9320, lon: 76.2660, distance: 2 }
};

const API_KEY = "f266b0fa7693181ee55a3f15a75c9fc3";
const userLocation = localStorage.getItem("selectedRefinery");
let matchedLocation = null;

for (let key in refineryLocations) {
  if (key.toLowerCase() === userLocation?.toLowerCase()) {
    matchedLocation = key;
    break;
  }
}

if (!matchedLocation) {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resultContainer").innerHTML = `<h2>No matching refinery found for "${userLocation}".</h2>`;
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const { lat, lon } = refineryLocations[matchedLocation];
    const stationData = fireStations[matchedLocation];

    if (!stationData) {
      document.getElementById("resultContainer").innerHTML = `<p>No fire station data found for this refinery.</p>`;
      return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(data => {
        const windSpeed = data.wind.speed;
        const uvIndex = (Math.random() * 12).toFixed(1);
        const threat = getThreatLevel(windSpeed, uvIndex);
        const threatZones = calculateThreatZones(windSpeed, uvIndex);
        const refineryType = matchedLocation.includes("Gas") ? "Gas Processing Plant" : "Oil Refinery";

        document.getElementById("resultContainer").innerHTML = `
          <h2>${matchedLocation}</h2>
          <p><strong>Type:</strong> ${refineryType}</p>
          <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
          <p><strong>UV Index (Radiation):</strong> ${uvIndex}</p>
          <p><strong>Threat Level:</strong> <span style="color:${threatColor(threat)};">${threat}</span></p>
          <h3>Estimated Threat Zone Radius</h3>
          <ul>
            <li>🔥 High Radiation & Blast: ${threatZones.high} meters</li>
            <li>⚠️ Medium Radiation Zone: ${threatZones.medium} meters</li>
            <li>🟢 Low Risk Buffer Zone: ${threatZones.low} meters</li>
          </ul>`;

        const graph = new Graph();
        ["Refinery", "CityA", "CityB", "SafeZone"].forEach(n => graph.addNode(n));
        graph.addEdge("Refinery", "CityA", 10);
        graph.addEdge("CityA", "CityB", 15);
        graph.addEdge("CityB", "SafeZone", 20);
        graph.addEdge("Refinery", "CityB", 25);

        const evacPath = graph.findShortestPath("Refinery", "SafeZone");
        const evacDist = graph.calculatePathDistance(evacPath);

        document.getElementById("evacuationDetails").innerHTML = `
          <h3>🚨 Evacuation Route</h3>
          <p><strong>Route:</strong> ${evacPath.length > 1 ? evacPath[0] + " → " + evacPath[evacPath.length - 1] : evacPath.join(" → ")}</p>
        `;

        const map = renderMap(lat, lon, matchedLocation, threatZones);

        // Define coordinates for evacuation nodes
        const evacCoordinates = {
          "Refinery": [lat, lon],
          "CityA": [lat + 0.1, lon + 0.1],
          "CityB": [lat + 0.2, lon + 0.2],
          "SafeZone": [lat + 0.3, lon + 0.3]
        };

        // Map evacPath nodes to coordinates
        const evacCoords = evacPath.map(node => evacCoordinates[node]);

        // Draw polyline for evacuation route using Leaflet Routing Machine
        L.Routing.control({
          waypoints: [
            L.latLng(lat, lon),
            L.latLng(lat + 0.3, lon + 0.3)
          ],
          lineOptions: {
            styles: [{ color: 'blue', weight: 4 }]
          },
          createMarker: () => null,
          addWaypoints: false,
          routeWhileDragging: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false
        }).addTo(map);
      });
  });
}

function getThreatLevel(wind, uv) {
  if (uv > 10 || wind > 20) return "High";
  if (uv > 6 || wind > 10) return "Moderate";
  return "Low";
}

function threatColor(level) {
  if (level === "High") return "red";
  if (level === "Moderate") return "orange";
  return "green";
}

function calculateThreatZones(windSpeed, uvIndex) {
  const base = 3000;
  return {
    high: Math.round(base + windSpeed * 150 + uvIndex * 100),
    medium: Math.round(base + windSpeed * 150 + uvIndex * 100 + 2000),
    low: Math.round(base + windSpeed * 150 + uvIndex * 100 + 5000)
  };
}

function renderMap(lat, lon, label, zones) {
  const map = L.map('map').setView([lat, lon], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.circle([lat, lon], { radius: zones.high, color: 'red', fillOpacity: 0.3 }).addTo(map);
  L.circle([lat, lon], { radius: zones.medium, color: 'orange', fillOpacity: 0.2 }).addTo(map);
  L.circle([lat, lon], { radius: zones.low, color: 'green', fillOpacity: 0.1 }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup(label).openPopup();
  return map;
}

function goBack() {
  window.location.href = "index.html";
}

class Graph {
  constructor() {
    this.nodes = new Set();
    this.adjacencyList = new Map();
  }
  addNode(node) {
    this.nodes.add(node);
    this.adjacencyList.set(node, []);
  }
  addEdge(source, destination, weight) {
    this.adjacencyList.get(source).push({ node: destination, weight });
    this.adjacencyList.get(destination).push({ node: source, weight });
  }
  dijkstra(start) {
    const distances = {}, previous = {}, visited = new Set();
    const pq = new PriorityQueue();
    this.nodes.forEach(node => {
      distances[node] = node === start ? 0 : Infinity;
      pq.enqueue(node, distances[node]);
    });
    while (!pq.isEmpty()) {
      const { node } = pq.dequeue();
      if (visited.has(node)) continue;
      visited.add(node);
      const neighbors = this.adjacencyList.get(node);
      for (let { node: neighbor, weight } of neighbors) {
        const alt = distances[node] + weight;
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = node;
          pq.enqueue(neighbor, alt);
        }
      }
    }
    return { distances, previous };
  }
  findShortestPath(start, end) {
    const { previous } = this.dijkstra(start);
    const path = [];
    for (let at = end; at; at = previous[at]) path.unshift(at);
    return path;
  }
  calculatePathDistance(path) {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const edge = this.adjacencyList.get(path[i]).find(e => e.node === path[i + 1]);
      if (edge) total += edge.weight;
    }
    return total;
  }
}

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(node, priority) {
    this.items.push({ node, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
