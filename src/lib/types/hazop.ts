// HAZOP System Types

export interface Project {
  id: string;
  name: string;
  description: string;
  processDescription: string;
  pfdReference?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
}

export interface Node {
  id: string;
  projectId: string;
  name: string;
  description: string;
  designIntent: string;
  equipment: string[];
  position: { x: number; y: number };
  createdAt: Date;
}

export interface ProcessParameter {
  id: string;
  name: string;
  description: string;
  unit?: string;
  category: 'physical' | 'chemical' | 'operational';
}

export const PROCESS_PARAMETERS: ProcessParameter[] = [
  { id: 'flow', name: 'Flow', description: 'Rate of fluid movement', unit: 'kg/s', category: 'physical' },
  { id: 'pressure', name: 'Pressure', description: 'Force per unit area', unit: 'bar', category: 'physical' },
  { id: 'temperature', name: 'Temperature', description: 'Thermal energy level', unit: '°C', category: 'physical' },
  { id: 'level', name: 'Level', description: 'Height of liquid in vessel', unit: 'm', category: 'physical' },
  { id: 'composition', name: 'Composition', description: 'Chemical makeup of mixture', unit: '%', category: 'chemical' },
  { id: 'ph', name: 'pH', description: 'Acidity/alkalinity measure', unit: 'pH', category: 'chemical' },
  { id: 'viscosity', name: 'Viscosity', description: 'Fluid resistance to flow', unit: 'cP', category: 'physical' },
  { id: 'concentration', name: 'Concentration', description: 'Amount of solute in solution', unit: 'mol/L', category: 'chemical' },
  { id: 'reaction', name: 'Reaction', description: 'Chemical transformation rate', category: 'chemical' },
  { id: 'mixing', name: 'Mixing', description: 'Degree of homogeneity', category: 'operational' },
  { id: 'phase', name: 'Phase', description: 'State of matter', category: 'physical' },
  { id: 'time', name: 'Time', description: 'Duration of operation', unit: 'min', category: 'operational' },
  { id: 'sequence', name: 'Sequence', description: 'Order of operations', category: 'operational' },
  { id: 'speed', name: 'Speed', description: 'Rate of mechanical motion', unit: 'rpm', category: 'operational' },
];

export interface GuideWord {
  id: string;
  name: string;
  description: string;
  applicableParameters: string[];
}

export const GUIDE_WORDS: GuideWord[] = [
  { id: 'no', name: 'No / Not', description: 'Complete negation of design intent', applicableParameters: ['flow', 'pressure', 'temperature', 'level', 'reaction', 'mixing', 'sequence'] },
  { id: 'more', name: 'More', description: 'Quantitative increase', applicableParameters: ['flow', 'pressure', 'temperature', 'level', 'concentration', 'viscosity', 'time', 'speed'] },
  { id: 'less', name: 'Less', description: 'Quantitative decrease', applicableParameters: ['flow', 'pressure', 'temperature', 'level', 'concentration', 'viscosity', 'time', 'speed'] },
  { id: 'reverse', name: 'Reverse', description: 'Opposite direction or order', applicableParameters: ['flow', 'sequence', 'reaction'] },
  { id: 'as-well-as', name: 'As Well As', description: 'Additional activity or material', applicableParameters: ['composition', 'phase', 'reaction', 'mixing'] },
  { id: 'part-of', name: 'Part Of', description: 'Incomplete activity or composition', applicableParameters: ['composition', 'sequence', 'mixing', 'reaction'] },
  { id: 'other-than', name: 'Other Than', description: 'Complete substitution', applicableParameters: ['composition', 'phase', 'reaction', 'sequence'] },
  { id: 'early', name: 'Early', description: 'Occurs before intended time', applicableParameters: ['time', 'sequence', 'reaction'] },
  { id: 'late', name: 'Late', description: 'Occurs after intended time', applicableParameters: ['time', 'sequence', 'reaction'] },
];

export interface Deviation {
  id: string;
  nodeId: string;
  parameter: string;
  guideWord: string;
  description: string;
  causes: Cause[];
  consequences: Consequence[];
  safeguards: Safeguard[];
  recommendations: Recommendation[];
  riskRating?: RiskRating;
  status: 'open' | 'in-review' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Cause {
  id: string;
  description: string;
  category: 'equipment' | 'human' | 'process' | 'external';
}

export interface Consequence {
  id: string;
  description: string;
  category: 'safety' | 'environmental' | 'operational' | 'economic';
  severity: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic';
}

export interface Safeguard {
  id: string;
  description: string;
  type: 'prevention' | 'detection' | 'mitigation';
  effectiveness: 'low' | 'medium' | 'high';
  existing: boolean;
}

export interface Recommendation {
  id: string;
  deviationId: string;
  description: string;
  type: 'engineering' | 'administrative' | 'ppe' | 'procedural';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  dueDate?: Date;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface RiskRating {
  severity: 1 | 2 | 3 | 4 | 5;
  likelihood: 1 | 2 | 3 | 4 | 5;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const SEVERITY_MATRIX: Record<number, string> = {
  1: 'Negligible - No injury, minimal impact',
  2: 'Minor - First aid, minor damage',
  3: 'Moderate - Medical treatment, moderate damage',
  4: 'Major - Serious injury, significant damage',
  5: 'Catastrophic - Fatality, major disaster',
};

export const LIKELIHOOD_MATRIX: Record<number, string> = {
  1: 'Rare - Once in 100 years',
  2: 'Unlikely - Once in 10 years',
  3: 'Possible - Once per year',
  4: 'Likely - Once per month',
  5: 'Almost Certain - Weekly or more',
};

export function calculateRiskLevel(severity: number, likelihood: number): 'low' | 'medium' | 'high' | 'critical' {
  const riskScore = severity * likelihood;
  if (riskScore <= 4) return 'low';
  if (riskScore <= 9) return 'medium';
  if (riskScore <= 16) return 'high';
  return 'critical';
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeData?: Node;
    deviationCount?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, string>;
}

// Export/Import types
export interface HAZOPExport {
  version: string;
  exportDate: string;
  project: Project;
  nodes: Node[];
  deviations: Deviation[];
}
