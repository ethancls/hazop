import { writable, derived, get } from 'svelte/store';
import type { 
  Project, 
  Node, 
  Deviation, 
  Recommendation,
  FlowNode,
  FlowEdge,
  HAZOPExport
} from '../types/hazop';
import { calculateRiskLevel } from '../types/hazop';

// Helper to generate unique IDs
export function generateId(): string {
  return crypto.randomUUID();
}

// Projects Store
function createProjectsStore() {
  const { subscribe, set, update } = writable<Project[]>([]);

  return {
    subscribe,
    add: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newProject: Project = {
        ...project,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      update(projects => [...projects, newProject]);
      return newProject;
    },
    update: (id: string, updates: Partial<Project>) => {
      update(projects => 
        projects.map(p => 
          p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
        )
      );
    },
    delete: (id: string) => {
      update(projects => projects.filter(p => p.id !== id));
    },
    load: (projects: Project[]) => set(projects),
  };
}

// Nodes Store
function createNodesStore() {
  const { subscribe, set, update } = writable<Node[]>([]);

  return {
    subscribe,
    add: (node: Omit<Node, 'id' | 'createdAt'>) => {
      const newNode: Node = {
        ...node,
        id: generateId(),
        createdAt: new Date(),
      };
      update(nodes => [...nodes, newNode]);
      return newNode;
    },
    update: (id: string, updates: Partial<Node>) => {
      update(nodes => 
        nodes.map(n => n.id === id ? { ...n, ...updates } : n)
      );
    },
    delete: (id: string) => {
      update(nodes => nodes.filter(n => n.id !== id));
    },
    getByProject: (projectId: string, nodes: Node[]) => 
      nodes.filter(n => n.projectId === projectId),
    load: (nodes: Node[]) => set(nodes),
  };
}

// Deviations Store
function createDeviationsStore() {
  const { subscribe, set, update } = writable<Deviation[]>([]);

  return {
    subscribe,
    add: (deviation: Omit<Deviation, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newDeviation: Deviation = {
        ...deviation,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      update(deviations => [...deviations, newDeviation]);
      return newDeviation;
    },
    update: (id: string, updates: Partial<Deviation>) => {
      update(deviations => 
        deviations.map(d => 
          d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
        )
      );
    },
    delete: (id: string) => {
      update(deviations => deviations.filter(d => d.id !== id));
    },
    getByNode: (nodeId: string, deviations: Deviation[]) => 
      deviations.filter(d => d.nodeId === nodeId),
    load: (deviations: Deviation[]) => set(deviations),
  };
}

// Current Selection Store
export const currentProject = writable<Project | null>(null);
export const currentNode = writable<Node | null>(null);
export const currentDeviation = writable<Deviation | null>(null);

// UI State
export const sidebarOpen = writable(true);
export const modalOpen = writable<string | null>(null);
export const darkMode = writable(false);

// Initialize stores
export const projects = createProjectsStore();
export const nodes = createNodesStore();
export const deviations = createDeviationsStore();

// Derived stores
export const projectNodes = derived(
  [currentProject, nodes],
  ([$currentProject, $nodes]) => 
    $currentProject ? $nodes.filter(n => n.projectId === $currentProject.id) : []
);

export const nodeDeviations = derived(
  [currentNode, deviations],
  ([$currentNode, $deviations]) => 
    $currentNode ? $deviations.filter(d => d.nodeId === $currentNode.id) : []
);

export const allRecommendations = derived(
  deviations,
  ($deviations) => 
    $deviations.flatMap(d => 
      d.recommendations.map(r => ({ ...r, deviation: d }))
    )
);

export const openRecommendations = derived(
  allRecommendations,
  ($recommendations) => 
    $recommendations.filter(r => r.status === 'open' || r.status === 'in-progress')
);

// Flow diagram nodes derived from HAZOP nodes
export const flowNodes = derived(
  [projectNodes, deviations],
  ([$projectNodes, $deviations]): FlowNode[] => 
    $projectNodes.map(node => {
      const nodeDevs = $deviations.filter(d => d.nodeId === node.id);
      const highestRisk = nodeDevs.reduce((max, d) => {
        if (!d.riskRating) return max;
        const level = d.riskRating.riskLevel;
        if (level === 'critical') return 'critical';
        if (level === 'high' && max !== 'critical') return 'high';
        if (level === 'medium' && max !== 'critical' && max !== 'high') return 'medium';
        return max;
      }, 'low' as 'low' | 'medium' | 'high' | 'critical');

      return {
        id: node.id,
        type: 'hazopNode',
        position: node.position,
        data: {
          label: node.name,
          nodeData: node,
          deviationCount: nodeDevs.length,
          riskLevel: highestRisk,
        },
      };
    })
);

// Statistics derived store
export const projectStats = derived(
  [currentProject, projectNodes, deviations],
  ([$currentProject, $projectNodes, $deviations]) => {
    if (!$currentProject) return null;
    
    const projectDeviations = $deviations.filter(d => 
      $projectNodes.some(n => n.id === d.nodeId)
    );

    const riskCounts = projectDeviations.reduce((acc, d) => {
      if (d.riskRating) {
        acc[d.riskRating.riskLevel] = (acc[d.riskRating.riskLevel] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const recommendationCounts = projectDeviations.flatMap(d => d.recommendations)
      .reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalNodes: $projectNodes.length,
      totalDeviations: projectDeviations.length,
      riskCounts,
      recommendationCounts,
      openActions: (recommendationCounts['open'] || 0) + (recommendationCounts['in-progress'] || 0),
      completedActions: recommendationCounts['completed'] || 0,
    };
  }
);

// Local Storage Persistence
const STORAGE_KEY = 'hazop_data';

export function saveToLocalStorage() {
  const data = {
    projects: get(projects),
    nodes: get(nodes),
    deviations: get(deviations),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromLocalStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.projects) projects.load(data.projects);
      if (data.nodes) nodes.load(data.nodes);
      if (data.deviations) deviations.load(data.deviations);
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }
}

// Export functionality
export function exportProject(project: Project): HAZOPExport {
  const projectNodesList = get(nodes).filter(n => n.projectId === project.id);
  const nodeIds = projectNodesList.map(n => n.id);
  const projectDeviations = get(deviations).filter(d => nodeIds.includes(d.nodeId));

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    project,
    nodes: projectNodesList,
    deviations: projectDeviations,
  };
}

export function importProject(data: HAZOPExport): Project {
  // Generate new IDs to avoid conflicts
  const idMap = new Map<string, string>();
  
  const newProjectId = generateId();
  idMap.set(data.project.id, newProjectId);
  
  const newProject: Project = {
    ...data.project,
    id: newProjectId,
    name: `${data.project.name} (Imported)`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  projects.add(newProject);

  data.nodes.forEach(node => {
    const newNodeId = generateId();
    idMap.set(node.id, newNodeId);
    nodes.add({
      ...node,
      id: newNodeId,
      projectId: newProjectId,
    });
  });

  data.deviations.forEach(deviation => {
    const newDeviationId = generateId();
    const newNodeId = idMap.get(deviation.nodeId);
    if (newNodeId) {
      deviations.add({
        ...deviation,
        id: newDeviationId,
        nodeId: newNodeId,
      });
    }
  });

  return newProject;
}

// Auto-save on changes
projects.subscribe(() => saveToLocalStorage());
nodes.subscribe(() => saveToLocalStorage());
deviations.subscribe(() => saveToLocalStorage());
