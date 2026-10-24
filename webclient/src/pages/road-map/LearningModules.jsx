import { useState } from 'react';

function LearningModules({neededModules}) {
    const [hoveredNode, setHoveredNode] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const learningModules = {
        python_basics: ["Introduction & setup", "Variables & Data Types", "Control Flow", "Functions", "Modules & Packages"],
        data_structures: ["Lists", "Tuples", "Dictionaries", "Sets", "Queues", "Stacks"],
        sql_database: ["Introduction to SQL", "SQL SELECT Statement", "SQL INSERT Statement", "SQL UPDATE Statement", "SQL DELETE Statement", "SQL JOIN Statement"],
        machine_learning: ["Introduction to Machine Learning", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Deep Learning"],
        deep_learning: ["Introduction to Deep Learning", "Deep Learning Models", "Deep Learning Applications", "Deep Learning Frameworks", "Deep Learning Libraries"],
    }

    // Configuration for SVG layout
    const circleRadius = 20;
    const circleSpacing = 80;
    const rowSpacing = 50; // Reduced from 150 to 80 for tighter vertical spacing
    const padding = 60;
    const maxContainerWidth = 1140; // Bootstrap container max-width

    // Convert module names to display names
    const moduleDisplayNames = {
        python_basics: "Python Basics",
        data_structures: "Data Structures",
        sql_database: "SQL Database",
        machine_learning: "Machine Learning",
        deep_learning: "Deep Learning"
    };

    // Colors for each module
    const moduleColors = {
        python_basics: "#4A90E2",
        data_structures: "#50C878",
        sql_database: "#FF6B6B",
        machine_learning: "#FFA500",
        deep_learning: "#9B59B6"
    };

    // Inactive color (gray)
    const inactiveColor = "#9E9E9E";

    // Check if a module is active based on needed_modules prop
    const isModuleActive = (moduleKey) => {
        // If needed_modules is not provided or is undefined/null, treat all as inactive
        if (!neededModules) return false;
        // Check if the key exists in needed_modules
        return neededModules.hasOwnProperty(moduleKey);
    };

    // Calculate graph layout with multiple rows
    const calculateLayout = () => {
        const nodes = [];
        const edges = [];
        let currentX = padding;
        let currentY = padding + 30;
        let rowHeight = 0;
        const modulesPerRow = [];
        let currentRowModules = [];
        let currentRowWidth = 0;

        Object.entries(learningModules).forEach(([moduleKey, items], moduleIndex) => {
            const isActive = isModuleActive(moduleKey);
            const moduleColor = isActive ? moduleColors[moduleKey] : inactiveColor;
            const moduleName = moduleDisplayNames[moduleKey];
            
            // Calculate module width (header + circles)
            const moduleWidth = Math.max(150, items.length * circleSpacing + 40);
            
            // Check if we need a new row
            if (currentRowWidth + moduleWidth + 40 > maxContainerWidth && currentRowModules.length > 0) {
                modulesPerRow.push(currentRowModules);
                currentRowModules = [];
                currentRowWidth = 0;
                currentY += rowHeight + rowSpacing;
                rowHeight = 0;
                currentX = padding;
            }
            
            const moduleStartX = currentX;
            const moduleStartY = currentY;
            
            // Add module header
            const headerY = currentY;
            currentY += 40;
            
            // Add circles for items
            items.forEach((item, itemIndex) => {
                const circleX = currentX + (itemIndex * circleSpacing) + 25;
                const circleY = currentY;
                const nodeId = `${moduleKey}_${itemIndex}`;
                
                nodes.push({
                    id: nodeId,
                    x: circleX,
                    y: circleY,
                    item: item,
                    moduleKey: moduleKey,
                    moduleColor: moduleColor,
                    moduleName: moduleName,
                    isActive: isActive
                });
                
                // Connect to next item in same module
                if (itemIndex < items.length - 1) {
                    const nextNodeId = `${moduleKey}_${itemIndex + 1}`;
                    edges.push({
                        from: nodeId,
                        to: nextNodeId,
                        color: moduleColor,
                        isActive: isActive
                    });
                }
            });
            
            // Connect last node of previous module to first node of current module
            if (moduleIndex > 0) {
                const prevModule = Object.entries(learningModules)[moduleIndex - 1];
                const prevModuleKey = prevModule[0];
                const prevModuleItems = prevModule[1];
                const prevModuleActive = isModuleActive(prevModuleKey);
                const lastPrevNodeId = `${prevModuleKey}_${prevModuleItems.length - 1}`;
                const firstCurrentNodeId = `${moduleKey}_0`;
                
                // Find node positions for connection
                const lastPrevNode = nodes.find(n => n.id === lastPrevNodeId);
                const firstCurrentNode = nodes.find(n => n.id === firstCurrentNodeId);
                
                if (lastPrevNode && firstCurrentNode) {
                    // Cross-module connection is active only if both modules are active
                    const crossModuleActive = isActive && prevModuleActive;
                    edges.push({
                        from: lastPrevNodeId,
                        to: firstCurrentNodeId,
                        color: crossModuleActive ? "#666" : inactiveColor,
                        isCrossModule: true,
                        isActive: crossModuleActive
                    });
                }
            }
            
            // Update row height
            const moduleHeight = 40 + circleRadius * 2 + 20;
            rowHeight = Math.max(rowHeight, moduleHeight);
            
            currentRowModules.push({ moduleKey, moduleWidth, moduleStartX, moduleStartY, items: items.length });
            currentRowWidth += moduleWidth + 40;
            currentX += moduleWidth + 40;
        });
        
        if (currentRowModules.length > 0) {
            modulesPerRow.push(currentRowModules);
        }
        
        return { nodes, edges, modulesPerRow, maxY: currentY + rowHeight + padding };
    };

    const { nodes, edges, modulesPerRow, maxY } = calculateLayout();
    const svgWidth = maxContainerWidth;
    const svgHeight = maxY;

    const handleMouseEnter = (node, event) => {
        setHoveredNode(node);
        const svg = event.currentTarget.ownerSVGElement;
        if (!svg) return;
        
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        setMousePosition({ 
            x: svgP.x, 
            y: node.y - circleRadius - 15 // Position above the circle
        });
    };

    const handleMouseMove = (event) => {
        if (hoveredNode) {
            const svg = event.currentTarget;
            if (!svg || !svg.createSVGPoint) return;
            
            const pt = svg.createSVGPoint();
            pt.x = event.clientX;
            pt.y = event.clientY;
            const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
            setMousePosition({ 
                x: svgP.x, 
                y: hoveredNode.y - circleRadius - 15 // Position above the circle
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredNode(null);
    };

    return (
        <div className="container-fluid" style={{ padding: '20px', position: 'relative' }}>
            <svg 
                width="100%" 
                height={svgHeight} 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', maxWidth: '100%' }}
                onMouseMove={handleMouseMove}
            >
                {/* Background */}
                <rect width={svgWidth} height={svgHeight} fill="#f8f9fa" rx="8" />
                
                {/* Module headers */}
                {modulesPerRow.map((row, rowIndex) => 
                    row.map(({ moduleKey, moduleStartX, moduleStartY, moduleWidth }) => {
                        const isActive = isModuleActive(moduleKey);
                        const moduleColor = isActive ? moduleColors[moduleKey] : inactiveColor;
                        const moduleName = moduleDisplayNames[moduleKey];
                        
                        return (
                            <g key={`header_${moduleKey}`}>
                                <rect
                                    x={moduleStartX}
                                    y={moduleStartY - 15}
                                    width={moduleWidth}
                                    height={50}
                                    fill={moduleColor}
                                    stroke="#333"
                                    strokeWidth="2"
                                    rx="5"
                                    opacity={isActive ? 1 : 0.7}
                                    style={{ transition: 'fill 0.4s ease, opacity 0.4s ease' }}
                                />
                                <text
                                    x={moduleStartX + moduleWidth / 2}
                                    y={moduleStartY + 12}
                                    textAnchor="middle"
                                    fill={isActive ? "black" : "#666"}
                                    fontSize="16"
                                    fontWeight="bold"
                                    fontFamily="Arial, sans-serif"
                                    style={{ transition: 'fill 0.4s ease' }}
                                >
                                    {moduleName}
                                </text>
                            </g>
                        );
                    })
                )}
                
                {/* Draw edges (connections) */}
                {edges.map((edge, edgeIndex) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    // Use gray color and lower opacity for inactive edges
                    const isEdgeActive = edge.isActive === true;
                    const edgeColor = isEdgeActive ? edge.color : inactiveColor;
                    const edgeOpacity = isEdgeActive ? 0.7 : 0.4;
                    
                    return (
                        <line
                            key={`edge_${edgeIndex}`}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={(toNode.x < 150 && edge.isCrossModule) ? toNode.x + 20 : toNode.x - 20}
                            y2={(toNode.x < 150 && edge.isCrossModule) ? toNode.y -20 : toNode.y}
                            stroke={edgeColor}
                            strokeWidth={edge.isCrossModule ? "3" : "1.5"}
                            strokeDasharray={edge.isCrossModule ? "5,5" : "none"}
                            markerEnd="url(#arrowhead)"
                            opacity={edgeOpacity}
                            style={{ transition: 'stroke 0.4s ease, opacity 0.4s ease' }}
                        />
                    );
                })}
                
                {/* Draw nodes (circles) */}
                {nodes.map((node) => (
                    <g key={node.id}>
                        {/* Circle */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={circleRadius}
                            fill={node.moduleColor}
                            stroke="#333"
                            strokeWidth="2"
                            style={{ 
                                cursor: 'pointer',
                                transition: 'fill 0.4s ease, opacity 0.4s ease'
                            }}
                            opacity={node.isActive ? 1 : 0.6}
                            onMouseEnter={(e) => handleMouseEnter(node, e)}
                            onMouseLeave={handleMouseLeave}
                        />
                        {/* Native SVG title for accessibility */}
                        <title>{node.item}</title>
                    </g>
                ))}

                {/* Tooltip */}
                {hoveredNode && (
                    <g pointerEvents="none">
                        <rect
                            x={mousePosition.x - 100}
                            y={mousePosition.y - 40}
                            width={200}
                            height={35}
                            fill="#333"
                            fillOpacity="0.95"
                            rx="8"
                            stroke="#fff"
                            strokeWidth="2"
                            filter="url(#shadow)"
                        />
                        <text
                            x={mousePosition.x}
                            y={mousePosition.y - 18}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="600"
                        >
                            {hoveredNode.item}
                        </text>
                    </g>
                )}
                
                {/* Definitions */}
                <defs>
                    {/* Arrow marker definition */}
                    <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                    >
                        <polygon points="0 0, 10 3, 0 6" fill="#333" />
                    </marker>
                    
                    {/* Shadow filter for tooltip */}
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                        <feOffset dx="2" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    );
}

export default LearningModules;
