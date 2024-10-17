<template>
  <div class="statistics-container" v-if="graph">
    <h2>Graph Statistics</h2>

    <div class="graph-info">
      <p><strong>Created At:</strong> {{ formatDate(graph.created_at) }}</p>
      <p><strong>Updated At:</strong> {{ formatDate(graph.updated_at) }}</p>
      <p><strong>Number of Nodes:</strong> {{ nodeCount }}</p>
      <p><strong>Number of Relations:</strong> {{ edgeCount }}</p>
    </div>

    <h3>Nodes Information</h3>
    <table class="nodes-table">
      <thead>
        <tr>
          <th>Node Label</th>
          <th>Node Tooltip</th>
          <th>Node Neighbors</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(node, key) in graph.nodes" :key="key">
          <td>{{node.name }}</td>
          <td>...</td>
          <td>{{ getNodeNeighborsLabels(key).join(', ') || 'None' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else-if="loading">Loading graph data...</p>
  <p v-else>Graph not found.</p>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useGraph from '~/composables/useGraph.js';

const route = useRoute();
const { loadGraph } = useGraph();
const graph = ref(null);
const loading = ref(true);
const nodeCount = ref(0);
const edgeCount = ref(0);

onMounted(() => {
  if (process.client) {
    const loadedGraph = loadGraph(route.params.id);
    if (loadedGraph) {
      graph.value = loadedGraph;
      console.log("Loaded Graph:", graph.value); 
      console.log("Nodes Structure:", graph.value.nodes); 
      
      if (typeof graph.value.nodes === 'object') {
        nodeCount.value = Object.keys(graph.value.nodes).length;
        edgeCount.value = Object.keys(graph.value.edges).length;
      } else {
        console.error("Nodes are not in an object format:", graph.value.nodes);
      }
    }
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB') + '   ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const getNodeNeighborsLabels = (nodeId) => {
  const neighbors = [];
  
  for (const edge of Object.values(graph.value.edges)) {
    if (edge.source === nodeId) {
      neighbors.push(graph.value.nodes[edge.target].name);
    } else if (edge.target === nodeId) {
      neighbors.push(graph.value.nodes[edge.source].name);
    }
  }
  
  return neighbors;
};
</script>

<style scoped>
.statistics-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #f0f8ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 50px;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.graph-info p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #555;
}

h3 {
  font-size: 1.5rem;
  margin: 1.5rem 0 1rem;
  color: #444;
  text-align: center;
}

.nodes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 0.9rem;
}

.nodes-table th, .nodes-table td {
  padding: 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.nodes-table th {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
}

.nodes-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.nodes-table tr:nth-child(odd) {
  background-color: #fff;
}

.nodes-table tr:hover {
  background-color: #e0f7fa;
}

.nodes-table td {
  color: #333;
}

button {
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #2575fc;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 20px;
}

button:hover {
  background-color: #6a11cb;
  transform: translateY(-3px);
}

button:active {
  background-color: #5b10b2;
}
</style>
