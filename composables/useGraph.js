import { ref, watch, onMounted } from 'vue';

const LOCAL_STORAGE_KEY = 'graphs';

export default function useGraph() {
  const graphs = ref([]);
  const nodes = ref([]);
  const edges = ref([]);
  const loading = ref(false);
  const error = ref('');

  const loadGraphs = () => {
    try {
      loading.value = true;
      if (typeof window !== 'undefined') {
        const storedGraphs = localStorage.getItem(LOCAL_STORAGE_KEY);
        graphs.value = storedGraphs ? JSON.parse(storedGraphs) : {};
      }
    } catch (e) {
      error.value = 'Failed to load graphs from storage.';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadGraphs();
  });

  watch(graphs, () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(graphs.value));
    }
  }, { deep: true });

  const createGraph = (name, description) => {
    if (!name || typeof name !== 'string' || !description || typeof description !== 'string') {
      throw new Error('Invalid input: Both name and description are required and must be strings.');
    }
  
    try {
      loading.value = true;
      const id = `graph-${Date.now()}`;
      
      const newGraph = {
        id,
        name: name.trim(),
        description: description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        nodes: {},
        edges: {}
      };
  
      graphs.value = { ...graphs.value, [id]: newGraph };
      saveGraphsToLocalStorage();
  
      return newGraph;
    } catch (e) {
      console.error('Failed to create graph:', e);
      throw new Error('An error occurred while creating the graph.');
    } finally {
      loading.value = false;
    }
  };
    
  const saveGraphsToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(graphs.value));
      } catch (e) {
        console.error('Failed to save graphs to localStorage:', e);
        throw new Error('An error occurred while saving graphs to local storage.');
      }
    }
  };
  
  const loadGraph = (graphId) => {
    const graph = graphs.value[graphId];
    if (graph) {
      nodes.value = graph.nodes;
      edges.value = graph.edges;
    }
    return graph;
  };


  const addNode = (label, graphId) => {
    if (!label) {
        alert('Node label is required.');
        return;
      }
    
      const duplicateNode = Object.values(nodes.value).some(node => node.name === label);
      if (duplicateNode) {
        alert(`Node with name "${label}" already exists.`);
        return;
      }
  
    const nodeId = `node-${Date.now()}`;
    nodes.value[nodeId] = { name: label };
    updateCurrentGraph(graphId);
  };

  
  const addEdge = (sourceLabel, targetLabel, graphId) => {
    const source = Object.keys(nodes.value).find(id => nodes.value[id].name === sourceLabel);
    const target = Object.keys(nodes.value).find(id => nodes.value[id].name === targetLabel);

    if (source && target && source !== target) {
      const edgeId = `edge-${Date.now()}`;
      edges.value[edgeId] = { source, target };
      updateCurrentGraph(graphId);
    } else {
      alert("Invalid nodes or attempt to connect a node to itself.");
    }
  };

  const updateCurrentGraph = (graphId) => {
    if (graphs.value[graphId]) {
      graphs.value[graphId].nodes = { ...nodes.value };
      graphs.value[graphId].edges = { ...edges.value };
      graphs.value[graphId].updated_at = new Date().toISOString();
    }
  };

  const removeNode = (name, graphId) => {
    const nodeId = Object.keys(nodes.value).find(id => nodes.value[id].name === name);
  
    if (!nodeId) {
      alert(`Node with name "${name}" does not exist.`);
      return;
    }
  
    delete nodes.value[nodeId];
  
    Object.keys(edges.value).forEach(edgeId => {
      const edge = edges.value[edgeId];
      if (edge.source === nodeId || edge.target === nodeId) {
        delete edges.value[edgeId];
      }
    });
  
    updateCurrentGraph(graphId); 
  };
  
  const removeEdge = (sourceName, targetName, graphId) => {
    const sourceId = Object.keys(nodes.value).find(id => nodes.value[id].name === sourceName);
    const targetId = Object.keys(nodes.value).find(id => nodes.value[id].name === targetName);
  
    if (!sourceId || !targetId) {
      alert("Both nodes must exist to remove an edge.");
      return;
    }
  
    const edgeId = Object.keys(edges.value).find(
      id => (edges.value[id].source === sourceId && edges.value[id].target === targetId) ||
            (edges.value[id].source === targetId && edges.value[id].target === sourceId) // If edges are undirected
    );
  
    if (!edgeId) {
      alert("No edge exists between the specified nodes.");
      return;
    }
  
    delete edges.value[edgeId];
  
    updateCurrentGraph(graphId); 
  };
  const deleteGraph = (graphId) => {
    try {
      if (Array.isArray(graphs.value)) {
        graphs.value = graphs.value.filter((g) => g.id !== graphId);
      } else {
        delete graphs.value[graphId];
      }
  
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(graphs.value));
      }
  
      console.log(`Graph with ID ${graphId} deleted successfully.`);
    } catch (error) {
      console.error('Failed to delete the graph:', error);
      throw new Error('An error occurred while deleting the graph.');
    }
  };
      
  return {
    graphs,
    nodes,
    edges,
    loading,
    error,
    createGraph,
    loadGraph,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    deleteGraph
  };
}
