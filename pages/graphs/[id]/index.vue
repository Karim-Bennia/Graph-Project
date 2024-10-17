<template>
    <div v-if="graph" class="graph-detail">
      <h2 class="graph-name">{{ graph.name }}</h2>
      <p class="graph-description">{{ graph.description }}</p>
    
      <div class="graph-canvas-container">
      <GraphCanvas :nodes="graph.nodes" :edges="graph.edges" />
      </div>

    </div>
    <p v-else>Loading graph data...</p>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import useGraph from '~/composables/useGraph.js';
  
  const { loadGraph } = useGraph();
  const route = useRoute();
  const graph = ref(null);
  
  onMounted(() => {
  if (process.client) { 
    graph.value = loadGraph(route.params.id);
  }
});
  </script>
  
  <style scoped>

.graph-detail {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.graph-name {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.graph-description {
  font-size: 1.2rem;
  color: #726c6ce1;
  margin-bottom: 20px;
}

.graph-canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  border: 2px solid;
  border-radius: 12px;
  padding: 10px;
  margin: 20px 0;
  min-height: 300px;
  max-height: 500px;
}

  </style>
  