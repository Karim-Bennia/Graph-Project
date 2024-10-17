<template>
  <div class="container">
    <h2>Create a New Graph</h2>
    <div class="create-graph-form">
      <input v-model="newGraphName" placeholder="Graph Name" />
      <input v-model="newGraphDescription" placeholder="Graph Description" />
      <button @click="createNewGraph" :disabled="!isFormValid">Create Graph</button>
    </div>

    <h2>Graph List</h2>
    <div class="graph-list">
      <div
        v-for="(graph, id) in graphs"
        :key="id" 
        class="graph-card"
        @click="navigateToGraph(graph.id)"
      >
        <h3>{{ graph.name }}</h3>
        <p>{{ graph.description }}</p>
        <small>Created: {{ formatDate(graph.created_at) }}</small>
        <div class="card-buttons">
          <button @click.stop="navigateToStatistics(graph.id)">Statistics</button>
          <button @click.stop="confirmAndDeleteGraph(graph.id)" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useGraph from '~/composables/useGraph.js';

const { graphs, createGraph, deleteGraph } = useGraph();
const router = useRouter();

const newGraphName = ref('');
const newGraphDescription = ref('');
const isFormValid = computed(() => newGraphName.value && newGraphDescription.value);

const createNewGraph = () => {
  if (isFormValid.value) {
    createGraph(newGraphName.value, newGraphDescription.value);
    newGraphName.value = '';
    newGraphDescription.value = '';
  }
};

const navigateToGraph = (id) => {
  router.push(`/graphs/${id}`);
};

const navigateToStatistics = (id) => {
  router.push(`/graphs/${id}/statistics`);
  
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const confirmAndDeleteGraph = (id) => {
  if (confirm("Are you sure you want to delete this graph?")) {
    try {
      deleteGraph(id);
    } catch (error) {
      alert(error.message);
    }
  }
};


</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 50px;
}

h2 {
  color: #34495e;
  font-size: 2rem;
  margin-bottom: 20px;
}

.create-graph-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.create-graph-form input {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 220px;
  transition: border-color 0.3s;
}

.create-graph-form input:focus {
  outline: none;
  border-color: #3498db;
}

.create-graph-form button {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: bold;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.create-graph-form button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.create-graph-form button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.graph-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding: 10px;
  background-color: #ecf0f1;
  border-radius: 12px;
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.05);
}

.graph-card {
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
}

.graph-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.graph-card h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.graph-card p {
  color: #7f8c8d;
  margin: 10px 0;
}

.graph-card small {
  display: block;
  color: #95a5a6;
  margin-top: 10px;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.card-buttons button {
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.card-buttons button:hover {
  transform: scale(1.05);
}

.card-buttons .delete-button {
  background-color: #e74c3c;
  color: #ffffff;
}

.card-buttons .delete-button:hover {
  background-color: #c0392b;
}

.card-buttons button {
  background-color: #3498db;
  color: #ffffff;
}

.card-buttons button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .create-graph-form {
    flex-direction: column;
    gap: 15px;
  }

  .create-graph-form input, .create-graph-form button {
    width: 100%;
  }

  .graph-list {
    max-height: 400px;
  }
}
</style>
