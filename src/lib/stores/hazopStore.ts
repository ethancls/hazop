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
  projects.load([...get(projects), newProject]);

  data.nodes.forEach(node => {
    const newNodeId = generateId();
    idMap.set(node.id, newNodeId);
    const { id: _, createdAt: __, ...nodeData } = node;
    nodes.load([...get(nodes), {
      ...nodeData,
      id: newNodeId,
      projectId: newProjectId,
      createdAt: new Date(),
    }]);
  });

  data.deviations.forEach(deviation => {
    const newDeviationId = generateId();
    const newNodeId = idMap.get(deviation.nodeId);
    if (newNodeId) {
      const { id: _, createdAt: __, updatedAt: ___, ...deviationData } = deviation;
      deviations.load([...get(deviations), {
        ...deviationData,
        id: newDeviationId,
        nodeId: newNodeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    }
  });

  return newProject;
}

// Auto-save on changes
projects.subscribe(() => saveToLocalStorage());
nodes.subscribe(() => saveToLocalStorage());
deviations.subscribe(() => saveToLocalStorage());

// Create demo project with sample data
export function createDemoProject(): Project {
  const demoProject = projects.add({
    name: 'Reactor Cooling System',
    description: 'Demo HAZOP study for a chemical reactor cooling loop',
    processDescription: 'Continuous cooling water circulation system for an exothermic reactor. Includes heat exchanger, circulation pump, and cooling tower.',
    pfdReference: 'PFD-001-A',
    status: 'in-progress',
  });

  // Add sample nodes
  const reactorNode = nodes.add({
    projectId: demoProject.id,
    name: 'Chemical Reactor R-101',
    description: 'Main reaction vessel with jacket cooling',
    designIntent: 'Maintain reactor temperature at 80°C during exothermic reaction',
    equipment: ['Reactor vessel', 'Agitator', 'Temperature sensors', 'Cooling jacket'],
    position: { x: 100, y: 150 },
  });

  const pumpNode = nodes.add({
    projectId: demoProject.id,
    name: 'Circulation Pump P-101',
    description: 'Centrifugal pump for cooling water circulation',
    designIntent: 'Provide 50 m³/h of cooling water flow at 3 bar',
    equipment: ['Centrifugal pump', 'Flow meter', 'Pressure gauge'],
    position: { x: 400, y: 150 },
  });

  const heatExchangerNode = nodes.add({
    projectId: demoProject.id,
    name: 'Heat Exchanger E-101',
    description: 'Shell and tube heat exchanger',
    designIntent: 'Cool reactor outlet from 85°C to 35°C',
    equipment: ['Shell & tube HX', 'Temperature transmitters', 'Bypass valve'],
    position: { x: 700, y: 150 },
  });

  // Add sample deviations
  deviations.add({
    nodeId: reactorNode.id,
    parameter: 'temperature',
    guideWord: 'more',
    description: 'Temperature in reactor exceeds design limit',
    causes: [
      { id: '1', description: 'Cooling water flow interruption', category: 'process' },
      { id: '2', description: 'Runaway reaction', category: 'process' },
    ],
    consequences: [
      { id: '1', description: 'Product quality degradation', severity: 'moderate', category: 'operational' },
      { id: '2', description: 'Potential vessel overpressure', severity: 'major', category: 'safety' },
    ],
    safeguards: [
      { id: '1', type: 'detection', description: 'High temperature alarm TAH-101', effectiveness: 'high', existing: true },
      { id: '2', type: 'mitigation', description: 'Pressure relief valve PSV-101', effectiveness: 'high', existing: true },
    ],
    recommendations: [
      { id: '1', deviationId: '', description: 'Install redundant temperature sensor', type: 'engineering', priority: 'high', status: 'open', createdAt: new Date(), updatedAt: new Date() },
    ],
    riskRating: { severity: 3, likelihood: 2, riskLevel: 'medium' },
    status: 'open',
  });

  deviations.add({
    nodeId: pumpNode.id,
    parameter: 'flow',
    guideWord: 'no',
    description: 'No cooling water flow through system',
    causes: [
      { id: '1', description: 'Pump failure', category: 'equipment' },
      { id: '2', description: 'Power outage', category: 'external' },
    ],
    consequences: [
      { id: '1', description: 'Reactor overheating', severity: 'catastrophic', category: 'safety' },
      { id: '2', description: 'Emergency shutdown required', severity: 'major', category: 'operational' },
    ],
    safeguards: [
      { id: '1', type: 'detection', description: 'Low flow alarm FAL-101', effectiveness: 'high', existing: true },
      { id: '2', type: 'mitigation', description: 'Emergency response procedure ERP-005', effectiveness: 'medium', existing: true },
    ],
    recommendations: [
      { id: '1', deviationId: '', description: 'Install backup pump with auto-start', type: 'engineering', priority: 'critical', status: 'open', createdAt: new Date(), updatedAt: new Date() },
    ],
    riskRating: { severity: 4, likelihood: 2, riskLevel: 'high' },
    status: 'open',
  });

  return demoProject;
}

// AI-assisted HAZOP generation (simulated - would connect to real AI in production)
export interface AIGenerationRequest {
  processDescription: string;
  nodeCount?: number;
}

export interface AIGeneratedNode {
  name: string;
  description: string;
  designIntent: string;
  equipment: string[];
  suggestedDeviations: {
    parameter: string;
    guideWord: string;
    description: string;
  }[];
}

export async function generateHAZOPFromPrompt(request: AIGenerationRequest): Promise<AIGeneratedNode[]> {
  // Simulated AI response - in production, this would call an LLM API
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  const processLower = request.processDescription.toLowerCase();
  const generatedNodes: AIGeneratedNode[] = [];
  
  // Simple keyword-based generation for demo
  if (processLower.includes('reactor') || processLower.includes('reaction')) {
    generatedNodes.push({
      name: 'Reactor Vessel',
      description: 'Primary reaction vessel for chemical processing',
      designIntent: 'Maintain controlled reaction conditions for product synthesis',
      equipment: ['Reactor vessel', 'Agitator', 'Temperature probe', 'Pressure gauge'],
      suggestedDeviations: [
        { parameter: 'temperature', guideWord: 'more', description: 'Temperature exceeds design limit' },
        { parameter: 'pressure', guideWord: 'more', description: 'Overpressure condition' },
        { parameter: 'mixing', guideWord: 'less', description: 'Inadequate agitation' },
      ],
    });
  }
  
  if (processLower.includes('pump') || processLower.includes('flow') || processLower.includes('transfer')) {
    generatedNodes.push({
      name: 'Transfer Pump',
      description: 'Centrifugal pump for fluid transfer',
      designIntent: 'Provide consistent flow rate at required pressure',
      equipment: ['Pump', 'Motor', 'Flow meter', 'Check valve'],
      suggestedDeviations: [
        { parameter: 'flow', guideWord: 'no', description: 'Complete loss of flow' },
        { parameter: 'flow', guideWord: 'less', description: 'Reduced flow rate' },
        { parameter: 'pressure', guideWord: 'more', description: 'Downstream overpressure' },
      ],
    });
  }
  
  if (processLower.includes('heat') || processLower.includes('cool') || processLower.includes('exchanger')) {
    generatedNodes.push({
      name: 'Heat Exchanger',
      description: 'Shell and tube heat exchanger for thermal control',
      designIntent: 'Transfer heat between process and utility streams',
      equipment: ['Heat exchanger', 'Temperature sensors', 'Control valve', 'Bypass line'],
      suggestedDeviations: [
        { parameter: 'temperature', guideWord: 'more', description: 'Outlet temperature too high' },
        { parameter: 'temperature', guideWord: 'less', description: 'Insufficient cooling/heating' },
        { parameter: 'flow', guideWord: 'no', description: 'Loss of cooling medium' },
      ],
    });
  }
  
  if (processLower.includes('tank') || processLower.includes('storage') || processLower.includes('vessel')) {
    generatedNodes.push({
      name: 'Storage Tank',
      description: 'Process material storage vessel',
      designIntent: 'Safely store process fluids at ambient conditions',
      equipment: ['Storage tank', 'Level indicator', 'Vent', 'Drain valve'],
      suggestedDeviations: [
        { parameter: 'level', guideWord: 'more', description: 'Tank overflow condition' },
        { parameter: 'level', guideWord: 'less', description: 'Tank runs dry' },
        { parameter: 'composition', guideWord: 'other-than', description: 'Contamination of contents' },
      ],
    });
  }
  
  if (processLower.includes('valve') || processLower.includes('control')) {
    generatedNodes.push({
      name: 'Control Valve',
      description: 'Automated flow control valve',
      designIntent: 'Regulate flow based on process requirements',
      equipment: ['Control valve', 'Positioner', 'I/P converter', 'Manual bypass'],
      suggestedDeviations: [
        { parameter: 'flow', guideWord: 'more', description: 'Valve fails open' },
        { parameter: 'flow', guideWord: 'no', description: 'Valve fails closed' },
        { parameter: 'sequence', guideWord: 'other-than', description: 'Valve operates incorrectly' },
      ],
    });
  }
  
  // Add a generic node if nothing specific detected
  if (generatedNodes.length === 0) {
    generatedNodes.push({
      name: 'Process Unit',
      description: 'General process equipment',
      designIntent: 'Perform process operations as per design',
      equipment: ['Process equipment', 'Instrumentation', 'Safety devices'],
      suggestedDeviations: [
        { parameter: 'flow', guideWord: 'no', description: 'Loss of flow' },
        { parameter: 'temperature', guideWord: 'more', description: 'Temperature exceedance' },
        { parameter: 'pressure', guideWord: 'more', description: 'Overpressure' },
      ],
    });
  }
  
  return generatedNodes;
}

// Apply AI-generated nodes to a project
export function applyGeneratedNodes(
  projectId: string, 
  generatedNodes: AIGeneratedNode[],
  includeDeviations: boolean = false
) {
  let xPos = 100;
  const yPos = 150;
  const spacing = 300;
  
  generatedNodes.forEach((genNode, index) => {
    const node = nodes.add({
      projectId,
      name: genNode.name,
      description: genNode.description,
      designIntent: genNode.designIntent,
      equipment: genNode.equipment,
      position: { x: xPos + (index * spacing), y: yPos },
    });
    
    if (includeDeviations) {
      genNode.suggestedDeviations.forEach(dev => {
        deviations.add({
          nodeId: node.id,
          parameter: dev.parameter,
          guideWord: dev.guideWord,
          description: dev.description,
          causes: [],
          consequences: [],
          safeguards: [],
          recommendations: [],
          status: 'open',
        });
      });
    }
  });
}
