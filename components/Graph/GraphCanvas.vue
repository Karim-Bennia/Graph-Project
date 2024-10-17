<template>
    <div class="graph-card">
      <div class="graph-header">
        <h2>Interactive Graph</h2>
      </div>
      <div class="graph-content">
        <v-network-graph
          :nodes="nodes"
          :edges="edges"
        />
      </div>
      <div class="button-group">
        <button @click="handleAddNode">Add Node</button>
        <button @click="handleAddEdge">Add Edge</button>
        <button @click="handleRemoveNode">Remove Node</button>
        <button @click="handleRemoveEdge">Remove Edge</button>
      </div>
    </div>
</template>
    
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import useGraph from '~/composables/useGraph.js';
  
  const { loadGraph,nodes, edges, addNode, addEdge, removeNode, removeEdge } = useGraph();
  const route = useRoute();
  const graph = ref(null);

  const graphId = route.params.id; 
  
  onMounted(() => {
  if (process.client) {
    graph.value = loadGraph(route.params.id); 
  }
});
  
const graphOptions = {
    node: {
      label: { visible: true }
    },
    edge: {
      color: '#2c3e50',
      width: 2,
    }
  };
  
  const handleAddNode = () => {
  const label = prompt('Enter node label:');
  if (label) addNode(label, graphId);
};

const handleAddEdge = () => {
  const sourceLabel = prompt('Enter source node label:');
  const targetLabel = prompt('Enter target node label:');
  addEdge(sourceLabel, targetLabel, graphId);
};

const handleRemoveNode = () => {
  const nodeName = prompt('Enter the name of the node to remove:');
  if (nodeName) {
    removeNode(nodeName, graphId);
  }
};

const handleRemoveEdge = () => {
  const sourceName = prompt('Enter the name of the source node:');
  const targetName = prompt('Enter the name of the target node:');
  if (sourceName && targetName) {
    removeEdge(sourceName, targetName, graphId);
  }
};


  </script>
  
  
  <style scoped>
  .graph-card {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background: linear-gradient(145deg, #f0f0f3, #d0d0d5);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.graph-header {
  margin-bottom: 20px;
}

.graph-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

.graph-content {
  width: 100%;
  height: 250px; /* Fixed height */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: inset 5px 5px 10px #e0e0e3, inset -5px -5px 10px #ffffff;
  margin-bottom: 30px;
  overflow: hidden; /* Prevent overflow */
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s, transform 0.2s;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button:active {
  background-color: #004080;
  transform: translateY(0);
}


</style>
  