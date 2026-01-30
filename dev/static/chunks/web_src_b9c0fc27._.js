(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web/src/lib/hazop/templates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// HAZOP Node Templates - Common process equipment types
__turbopack_context__.s([
    "GUIDE_WORDS",
    ()=>GUIDE_WORDS,
    "HAZOP_PARAMETERS",
    ()=>HAZOP_PARAMETERS,
    "NODE_CATEGORIES",
    ()=>NODE_CATEGORIES,
    "NODE_TEMPLATES",
    ()=>NODE_TEMPLATES
]);
const NODE_CATEGORIES = [
    {
        id: "vessels",
        name: "Vessels & Tanks",
        color: "#3b82f6"
    },
    {
        id: "heat-transfer",
        name: "Heat Transfer",
        color: "#ef4444"
    },
    {
        id: "fluid-handling",
        name: "Fluid Handling",
        color: "#22c55e"
    },
    {
        id: "separation",
        name: "Separation",
        color: "#a855f7"
    },
    {
        id: "control",
        name: "Control & Safety",
        color: "#f59e0b"
    },
    {
        id: "reaction",
        name: "Reaction Systems",
        color: "#ec4899"
    }
];
const NODE_TEMPLATES = [
    // Vessels & Tanks
    {
        id: "vessel",
        name: "Pressure Vessel",
        description: "Closed container designed to hold gases or liquids at a pressure different from ambient",
        icon: "Container",
        category: "vessels",
        color: "#3b82f6",
        defaultParameters: [
            "Pressure",
            "Temperature",
            "Level",
            "Flow"
        ],
        defaultDesignIntent: "To contain process fluid at designed pressure and temperature conditions"
    },
    {
        id: "storage-tank",
        name: "Storage Tank",
        description: "Atmospheric or low-pressure tank for bulk storage of liquids",
        icon: "Database",
        category: "vessels",
        color: "#3b82f6",
        defaultParameters: [
            "Level",
            "Temperature",
            "Composition"
        ],
        defaultDesignIntent: "To store process fluid at atmospheric or low pressure conditions"
    },
    {
        id: "drum",
        name: "Drum / Accumulator",
        description: "Vessel for liquid accumulation, surge control, or phase separation",
        icon: "Cylinder",
        category: "vessels",
        color: "#3b82f6",
        defaultParameters: [
            "Level",
            "Pressure",
            "Flow"
        ],
        defaultDesignIntent: "To provide surge capacity and maintain steady downstream flow"
    },
    // Heat Transfer
    {
        id: "heat-exchanger",
        name: "Heat Exchanger",
        description: "Equipment for transferring heat between two fluids",
        icon: "ArrowLeftRight",
        category: "heat-transfer",
        color: "#ef4444",
        defaultParameters: [
            "Temperature",
            "Flow",
            "Pressure",
            "Fouling"
        ],
        defaultDesignIntent: "To transfer heat from hot stream to cold stream achieving target outlet temperatures"
    },
    {
        id: "cooler",
        name: "Cooler / Condenser",
        description: "Heat exchanger for cooling or condensing process streams",
        icon: "ThermometerSnowflake",
        category: "heat-transfer",
        color: "#ef4444",
        defaultParameters: [
            "Temperature",
            "Flow",
            "Pressure",
            "Cooling Water Flow"
        ],
        defaultDesignIntent: "To reduce process temperature or condense vapors"
    },
    {
        id: "heater",
        name: "Heater / Reboiler",
        description: "Equipment for heating process streams or vaporizing liquids",
        icon: "Flame",
        category: "heat-transfer",
        color: "#ef4444",
        defaultParameters: [
            "Temperature",
            "Flow",
            "Pressure",
            "Steam Flow"
        ],
        defaultDesignIntent: "To increase process temperature or provide heat for vaporization"
    },
    {
        id: "furnace",
        name: "Fired Heater / Furnace",
        description: "Direct-fired heating equipment for high-temperature processes",
        icon: "Flame",
        category: "heat-transfer",
        color: "#ef4444",
        defaultParameters: [
            "Temperature",
            "Flow",
            "Fuel Flow",
            "Air Flow",
            "Stack Temperature"
        ],
        defaultDesignIntent: "To provide high-temperature heating through combustion"
    },
    // Fluid Handling
    {
        id: "pump",
        name: "Pump",
        description: "Equipment for moving liquids through piping systems",
        icon: "CircleDot",
        category: "fluid-handling",
        color: "#22c55e",
        defaultParameters: [
            "Flow",
            "Pressure",
            "NPSH",
            "Speed"
        ],
        defaultDesignIntent: "To transfer liquid at required flow rate and develop necessary pressure"
    },
    {
        id: "compressor",
        name: "Compressor",
        description: "Equipment for compressing gases to higher pressures",
        icon: "Gauge",
        category: "fluid-handling",
        color: "#22c55e",
        defaultParameters: [
            "Flow",
            "Pressure",
            "Temperature",
            "Speed",
            "Vibration"
        ],
        defaultDesignIntent: "To increase gas pressure to required operating conditions"
    },
    {
        id: "valve",
        name: "Control Valve",
        description: "Valve for controlling flow, pressure, or level",
        icon: "SlidersHorizontal",
        category: "fluid-handling",
        color: "#22c55e",
        defaultParameters: [
            "Flow",
            "Pressure Drop",
            "Position"
        ],
        defaultDesignIntent: "To regulate process variable by adjusting flow through the valve"
    },
    {
        id: "pipeline",
        name: "Pipeline Section",
        description: "Piping section for fluid transport between equipment",
        icon: "Minus",
        category: "fluid-handling",
        color: "#22c55e",
        defaultParameters: [
            "Flow",
            "Pressure",
            "Temperature",
            "Velocity"
        ],
        defaultDesignIntent: "To transport process fluid between equipment safely"
    },
    // Separation
    {
        id: "distillation",
        name: "Distillation Column",
        description: "Column for separating components based on boiling points",
        icon: "FlaskConical",
        category: "separation",
        color: "#a855f7",
        defaultParameters: [
            "Pressure",
            "Temperature",
            "Level",
            "Reflux Ratio",
            "Composition"
        ],
        defaultDesignIntent: "To separate feed into overhead and bottoms products at required purity"
    },
    {
        id: "separator",
        name: "Separator",
        description: "Vessel for separating phases (liquid/gas, oil/water)",
        icon: "Layers",
        category: "separation",
        color: "#a855f7",
        defaultParameters: [
            "Pressure",
            "Level",
            "Interface Level",
            "Flow"
        ],
        defaultDesignIntent: "To separate incoming stream into individual phases"
    },
    {
        id: "filter",
        name: "Filter / Strainer",
        description: "Equipment for removing solid particles from fluids",
        icon: "Filter",
        category: "separation",
        color: "#a855f7",
        defaultParameters: [
            "Flow",
            "Pressure Drop",
            "Differential Pressure"
        ],
        defaultDesignIntent: "To remove solid contaminants from process stream"
    },
    // Control & Safety
    {
        id: "relief-valve",
        name: "Relief Valve / PSV",
        description: "Pressure relief device for overpressure protection",
        icon: "ShieldAlert",
        category: "control",
        color: "#f59e0b",
        defaultParameters: [
            "Set Pressure",
            "Relieving Capacity"
        ],
        defaultDesignIntent: "To protect equipment from overpressure by relieving excess pressure"
    },
    {
        id: "control-loop",
        name: "Control Loop",
        description: "Instrumentation loop for process control",
        icon: "Activity",
        category: "control",
        color: "#f59e0b",
        defaultParameters: [
            "Setpoint",
            "Process Variable",
            "Controller Output"
        ],
        defaultDesignIntent: "To maintain process variable at setpoint through automatic control"
    },
    {
        id: "esd-system",
        name: "ESD System",
        description: "Emergency shutdown system for process safety",
        icon: "OctagonX",
        category: "control",
        color: "#f59e0b",
        defaultParameters: [
            "Trip Setpoint",
            "Response Time"
        ],
        defaultDesignIntent: "To safely shutdown process on detection of hazardous conditions"
    },
    // Reaction Systems
    {
        id: "reactor",
        name: "Reactor",
        description: "Vessel where chemical reactions take place",
        icon: "FlaskRound",
        category: "reaction",
        color: "#ec4899",
        defaultParameters: [
            "Temperature",
            "Pressure",
            "Residence Time",
            "Conversion",
            "Catalyst Activity"
        ],
        defaultDesignIntent: "To convert reactants to products under controlled conditions"
    },
    {
        id: "mixer",
        name: "Mixer / Agitator",
        description: "Equipment for mixing or blending materials",
        icon: "Blend",
        category: "reaction",
        color: "#ec4899",
        defaultParameters: [
            "Speed",
            "Power",
            "Mixing Time"
        ],
        defaultDesignIntent: "To achieve homogeneous mixture of process streams"
    }
];
const GUIDE_WORDS = [
    {
        word: "NO",
        aliases: [
            "NONE",
            "NOT"
        ],
        description: "Complete negation of design intent",
        examples: [
            "No flow",
            "No pressure",
            "No level"
        ]
    },
    {
        word: "MORE",
        aliases: [
            "HIGH",
            "HIGHER"
        ],
        description: "Quantitative increase above normal",
        examples: [
            "More flow",
            "High temperature",
            "High pressure"
        ]
    },
    {
        word: "LESS",
        aliases: [
            "LOW",
            "LOWER"
        ],
        description: "Quantitative decrease below normal",
        examples: [
            "Less flow",
            "Low temperature",
            "Low pressure"
        ]
    },
    {
        word: "REVERSE",
        aliases: [
            "BACKWARD"
        ],
        description: "Opposite direction or action",
        examples: [
            "Reverse flow",
            "Backflow"
        ]
    },
    {
        word: "AS WELL AS",
        aliases: [
            "ALSO",
            "CONTAMINATION"
        ],
        description: "Additional component or activity",
        examples: [
            "Impurities present",
            "Additional phase",
            "Contamination"
        ]
    },
    {
        word: "PART OF",
        aliases: [
            "INCOMPLETE"
        ],
        description: "Only part of design intent achieved",
        examples: [
            "Partial flow",
            "Incomplete reaction",
            "Partial separation"
        ]
    },
    {
        word: "OTHER THAN",
        aliases: [
            "WRONG",
            "DIFFERENT"
        ],
        description: "Complete substitution",
        examples: [
            "Wrong material",
            "Different composition"
        ]
    },
    {
        word: "EARLY",
        aliases: [
            "SOON",
            "BEFORE"
        ],
        description: "Timing - event occurs earlier than intended",
        examples: [
            "Premature startup",
            "Early activation"
        ]
    },
    {
        word: "LATE",
        aliases: [
            "DELAYED",
            "AFTER"
        ],
        description: "Timing - event occurs later than intended",
        examples: [
            "Delayed response",
            "Late shutdown"
        ]
    },
    {
        word: "FLUCTUATION",
        aliases: [
            "UNSTABLE",
            "VARYING"
        ],
        description: "Irregular or unstable operation",
        examples: [
            "Fluctuating flow",
            "Pressure swings",
            "Temperature cycling"
        ]
    }
];
const HAZOP_PARAMETERS = [
    "Flow",
    "Pressure",
    "Temperature",
    "Level",
    "Composition",
    "pH",
    "Viscosity",
    "Density",
    "Speed",
    "Time",
    "Frequency",
    "Voltage",
    "Current",
    "Signal",
    "Reaction",
    "Mixing",
    "Separation",
    "Information"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/src/components/hazop/flow-diagram.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FlowDiagram",
    ()=>FlowDiagram
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/web/node_modules/@xyflow/react/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/node_modules/@xyflow/system/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/web/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/web/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/web/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$hazop$2f$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web/src/lib/hazop/templates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
// Custom Node Component
function HAZOPNode({ data, selected }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `
        px-4 py-3 bg-card border-2 rounded-lg shadow-sm min-w-40 transition-all
        ${selected ? "ring-2 ring-primary ring-offset-2" : ""}
      `,
        style: {
            borderColor: data.color || "#3b82f6"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-1",
                children: data.nodeType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    className: "text-xs",
                    style: {
                        borderColor: data.color,
                        color: data.color
                    },
                    children: data.nodeType
                }, void 0, false, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 47,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-medium text-sm",
                children: data.label
            }, void 0, false, {
                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            data.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-muted-foreground mt-1 line-clamp-2",
                children: data.description
            }, void 0, false, {
                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mt-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    className: "text-xs",
                    children: [
                        data.deviationCount,
                        " deviations"
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = HAZOPNode;
const nodeTypes = {
    hazop: HAZOPNode
};
function FlowDiagram({ nodes, canEdit, onAddNode, onSavePositions, onSaveConnections }) {
    _s();
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasChanges, setHasChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Convert HAZOP nodes to React Flow nodes
    const initialNodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FlowDiagram.useMemo[initialNodes]": ()=>{
            return nodes.map({
                "FlowDiagram.useMemo[initialNodes]": (node, index)=>{
                    const position = node.position ? JSON.parse(node.position) : {
                        x: 100 + index * 200,
                        y: 100
                    };
                    return {
                        id: node.id,
                        type: "hazop",
                        position,
                        data: {
                            label: node.name,
                            description: node.description,
                            nodeType: node.nodeType,
                            color: node.color || "#3b82f6",
                            deviationCount: node._count.deviations
                        }
                    };
                }
            }["FlowDiagram.useMemo[initialNodes]"]);
        }
    }["FlowDiagram.useMemo[initialNodes]"], [
        nodes
    ]);
    const [flowNodes, setNodes, onNodesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNodesState"])(initialNodes);
    const [edges, setEdges, onEdgesChange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEdgesState"])([]);
    // Update nodes when prop changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlowDiagram.useEffect": ()=>{
            setNodes(initialNodes);
        }
    }["FlowDiagram.useEffect"], [
        initialNodes,
        setNodes
    ]);
    const onConnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FlowDiagram.useCallback[onConnect]": (params)=>{
            setEdges({
                "FlowDiagram.useCallback[onConnect]": (eds)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addEdge"])({
                        ...params,
                        type: "smoothstep",
                        animated: true,
                        markerEnd: {
                            type: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkerType"].ArrowClosed
                        }
                    }, eds)
            }["FlowDiagram.useCallback[onConnect]"]);
            setHasChanges(true);
        }
    }["FlowDiagram.useCallback[onConnect]"], [
        setEdges
    ]);
    const handleNodesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FlowDiagram.useCallback[handleNodesChange]": (changes)=>{
            onNodesChange(changes);
            // Check if any position changed
            if (changes.some({
                "FlowDiagram.useCallback[handleNodesChange]": (c)=>c.type === "position" && c.dragging === false
            }["FlowDiagram.useCallback[handleNodesChange]"])) {
                setHasChanges(true);
            }
        }
    }["FlowDiagram.useCallback[handleNodesChange]"], [
        onNodesChange
    ]);
    const handleSave = async ()=>{
        setSaving(true);
        try {
            // Save positions
            const positions = {};
            flowNodes.forEach((node)=>{
                positions[node.id] = node.position;
            });
            await onSavePositions(positions);
            // Save connections
            const connections = edges.map((edge)=>({
                    sourceId: edge.source,
                    targetId: edge.target,
                    label: typeof edge.label === "string" ? edge.label : undefined
                }));
            await onSaveConnections(connections);
            setHasChanges(false);
        } finally{
            setSaving(false);
        }
    };
    const handleAddFromTemplate = (template)=>{
        // Add at center of viewport
        const position = {
            x: 200,
            y: 200
        };
        onAddNode(template, position);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-150 border rounded-lg overflow-hidden bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ReactFlow"], {
            nodes: flowNodes,
            edges: edges,
            onNodesChange: handleNodesChange,
            onEdgesChange: onEdgesChange,
            onConnect: canEdit ? onConnect : undefined,
            nodeTypes: nodeTypes,
            connectionMode: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectionMode"].Loose,
            fitView: true,
            nodesDraggable: canEdit,
            nodesConnectable: canEdit,
            elementsSelectable: canEdit,
            defaultEdgeOptions: {
                type: "smoothstep",
                animated: true,
                markerEnd: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$system$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkerType"].ArrowClosed
                }
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Background"], {}, void 0, false, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 218,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Controls"], {}, void 0, false, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 219,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["MiniMap"], {
                    nodeColor: (node)=>node.data.color || "#3b82f6",
                    maskColor: "rgba(0, 0, 0, 0.1)"
                }, void 0, false, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this),
                canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Panel"], {
                    position: "top-left",
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            "Add Node"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                        lineNumber: 229,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                    className: "w-64 max-h-96 overflow-y-auto",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$hazop$2f$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_CATEGORIES"].map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuGroup"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-3 h-3 rounded-full",
                                                            style: {
                                                                backgroundColor: category.color
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 23
                                                        }, this),
                                                        category.name
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 21
                                                }, this),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$hazop$2f$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_TEMPLATES"].filter((t)=>t.category === category.id).map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                        onClick: ()=>handleAddFromTemplate(template),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-medium",
                                                                    children: template.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-muted-foreground line-clamp-1",
                                                                    children: template.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, template.id, false, {
                                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 25
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, category.id, true, {
                                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                            lineNumber: 236,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                    lineNumber: 234,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        hasChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            size: "sm",
                            variant: "outline",
                            onClick: handleSave,
                            disabled: saving,
                            children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "h-4 w-4 mr-2 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                        lineNumber: 269,
                                        columnNumber: 21
                                    }, this),
                                    "Saving..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        className: "h-4 w-4 mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                        lineNumber: 274,
                                        columnNumber: 21
                                    }, this),
                                    "Save Layout"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                            lineNumber: 266,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this),
                flowNodes.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Panel"], {
                    position: "top-center",
                    className: "mt-32",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center p-8 bg-card rounded-lg border shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-medium mb-2",
                                children: "No nodes yet"
                            }, void 0, false, {
                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground mb-4",
                                children: "Add your first process node to start building the flow diagram"
                            }, void 0, false, {
                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                lineNumber: 287,
                                columnNumber: 15
                            }, this),
                            canEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 23
                                                }, this),
                                                "Add First Node"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                            lineNumber: 293,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                        lineNumber: 292,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                        className: "w-64 max-h-96 overflow-y-auto",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$hazop$2f$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_CATEGORIES"].map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuGroup"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-3 h-3 rounded-full",
                                                                style: {
                                                                    backgroundColor: category.color
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                lineNumber: 302,
                                                                columnNumber: 27
                                                            }, this),
                                                            category.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 25
                                                    }, this),
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$lib$2f$hazop$2f$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NODE_TEMPLATES"].filter((t)=>t.category === category.id).map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                            onClick: ()=>handleAddFromTemplate(template),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-medium",
                                                                        children: template.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                        lineNumber: 315,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-muted-foreground line-clamp-1",
                                                                        children: template.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                        lineNumber: 316,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                                lineNumber: 314,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, template.id, false, {
                                                            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 29
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, category.id, true, {
                                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                                lineNumber: 300,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                        lineNumber: 298,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                                lineNumber: 291,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                        lineNumber: 285,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
                    lineNumber: 284,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
            lineNumber: 200,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/web/src/components/hazop/flow-diagram.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
_s(FlowDiagram, "lhmpA8AxCUTDLepPaA2JazTHBc8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNodesState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2f$node_modules$2f40$xyflow$2f$react$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useEdgesState"]
    ];
});
_c1 = FlowDiagram;
var _c, _c1;
__turbopack_context__.k.register(_c, "HAZOPNode");
__turbopack_context__.k.register(_c1, "FlowDiagram");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/web/src/components/hazop/flow-diagram.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/web/src/components/hazop/flow-diagram.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=web_src_b9c0fc27._.js.map