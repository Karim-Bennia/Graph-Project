<template>
  <div class="edit-container">
    <h2>Editing Graph: {{ graph?.name }}</h2>
    <GraphCanvas :nodes="nodes" :edges="edges" />
    
    <div class="controls">
      <button @click="handleAddNode">Add Node</button>
      <button @click="handleAddEdge">Add Edge</button>
      <button @click="handleRemoveNode">Remove Node</button>
      <button @click="handleRemoveEdge">Remove Edge</button>
      <button @click="handleRemoveAll">Remove All</button>
      <nuxt-link :to="`/graphs/${id}/statistics`">View Statistics</nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useGraph from '~/composables/useGraph.js';
import GraphCanvas from '~/components/Graph/GraphCanvas.vue';

const route = useRoute();
const router = useRouter();
const { loadGraph, addNode, addEdge, removeNode, removeEdge, nodes, edges } = useGraph();

const id = route.params.id;
const graph = loadGraph(id);

const handleAddNode = () => {
  const tooltip = prompt("Enter tooltip for the new node:");
  if (tooltip) addNode(tooltip);
};

const handleAddEdge = () => {
  const sourceLabel = prompt("Enter source node label:");
  const targetLabel = prompt("Enter target node label:");
  const sourceNode = nodes.value.find(node => node.label === sourceLabel);
  const targetNode = nodes.value.find(node => node.label === targetLabel);

  if (sourceNode && targetNode && sourceNode.id !== targetNode.id) {
    addEdge(sourceNode.id, targetNode.id);
  } else {
    alert("Invalid nodes. Please ensure labels are correct and distinct.");
  }
};

const handleRemoveNode = () => {
  const label = prompt("Enter the label of the node to remove:");
  const node = nodes.value.find(n => n.label === label);
  if (node) removeNode(node.id);
};

const handleRemoveEdge = () => {
  const edgeId = prompt("Enter the edge ID to remove:");
  if (edgeId) removeEdge(edgeId);
};

const handleRemoveAll = () => {
  if (confirm("Are you sure you want to remove all nodes and edges?")) {
    nodes.value = [];
    edges.value = [];
  }
};
</script>

<style scoped>
.edit-container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button, a.nuxt-link {
  padding: 10px 15px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

button:hover, a.nuxt-link:hover {
  background-color: #0056b3;
}
</style>