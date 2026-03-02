import dagre from "dagre";
import React, { useEffect, useState } from 'react';
import ReactFlow, {
    ConnectionMode,
    Controls,
    getConnectedEdges,
    getOutgoers,
    useEdgesState,
    useNodesState
} from "reactflow";

import "reactflow/dist/style.css";
import { TurboNode } from './TurboNode';
import UserDetailView from "./modal";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";
        node.position = {
            x: nodeWithPosition.x,
            //  - nodeWidth + ((nodeWithPosition.x) / 4),
            y: nodeWithPosition.y - nodeHeight + nodeWithPosition.y
        };
        return node;
    });

    return { nodes, edges };
};

const LayoutFlow = (props) => {

    const { chartData } = props;


    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        chartData?.initialNodes,
        chartData?.initialEdges
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [hidden, setHidden] = useState(true);
    const [state, setState] = useState({
        view: null,
    })

    const hide = (hidden, childEdgeID, childNodeID) => (nodeOrEdge) => {
        if (
            childEdgeID.includes(nodeOrEdge.id) ||
            childNodeID.includes(nodeOrEdge.id)
        )
            nodeOrEdge.hidden = hidden;
        return nodeOrEdge;
    };

    const checkTarget = (edge, id) => {
        let edges = edge.filter((ed) => {
            return ed.target !== id;
        });
        return edges;
    };

    let outgoers = [];
    let connectedEdges = [];
    let stack = [];

    const nodeClick = (some, node) => {
        let currentNodeID = node.id;
        stack.push(node);
        while (stack.length > 0) {
            let lastNOde = stack.pop();
            let childnode = getOutgoers(lastNOde, nodes, edges);
            let childedge = checkTarget(
                getConnectedEdges([lastNOde], edges),
                currentNodeID
            );
            childnode.map((goer, key) => {
                stack.push(goer);
                outgoers.push(goer);
            });
            childedge.map((edge, key) => {
                connectedEdges.push(edge);
            });
        }

        let childNodeID = outgoers.map((node) => {
            return node.id;
        });
        let childEdgeID = connectedEdges.map((edge) => {
            return edge.id;
        });

        setNodes((node) => node.map(hide(hidden, childEdgeID, childNodeID)));
        setEdges((edge) => edge.map(hide(hidden, childEdgeID, childNodeID)));
        setHidden(!hidden);
    };

    const handleAction = async (data) => {
        setState({
            ...state,
            view: data,
        })
    };

    const nodeTypes = {
        cutom: (props) => <TurboNode {...props} nodeEevent={nodeClick} handleAction={handleAction} />,
    };

    useEffect(() => {
        if (props?.selectUser) {
            focusNode(props.selectUser);
        }
    }, [props.selectUser]);


    function getSourceIds(jsonData, targetId) {

        const sourceIds = [];

        function findSourceId(targetId) {
            for (const item of jsonData) {
                if (item.target === targetId) {
                    sourceIds.push({ source: item.source, target: item.target });
                    if (item?.source) { findSourceId(item?.source); } // Recursive call to find the next source ID
                }
            }
        }

        findSourceId(targetId);
        return sourceIds;
    }

    const focusNode = (selectedNodeId) => {

        const sourceIds = getSourceIds(edges, JSON.stringify(selectedNodeId));

        const eds = edges?.map(v => {
            let obj = {};
            obj = {
                ...v,
                animated: false,
                style: {}
            }
            if (sourceIds?.find(c => c.source === v.source && v.target === c.target)?.source) {
                obj = {
                    ...obj,
                    style: { stroke: "#1076B4", strokeWidth: 3 },
                    animated: true
                }
            }
            return {
                ...obj
            }
        })
        const nds = nodes?.map(v => {
            let obj = {};
            obj = {
                ...v,
                data: {
                    ...v.data,
                    color: v?.data?.isloggedUser ? "#607d8b8a" : "",
                    background: v?.data?.isloggedUser ? "#E2EDF3" : "",
                }
            }
            if (JSON.stringify(selectedNodeId) === v?.id) {
                obj = {
                    ...obj,
                    data: {
                        ...v.data,
                        color: "#1076B4",
                        background: "#E2EDF3",
                    }

                }
            }
            return {
                ...obj,
            }
        })
        setEdges([...eds])
        setNodes([...nds])
    };

    const defaultViewport = { x: 200, y: 20, zoom: 0.7 };

    return (
        <React.Fragment>
            <UserDetailView data={state?.view} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onConnect={ConnectionMode.Loose}
                defaultViewport={defaultViewport}
            >
                <Controls showInteractive={false} />
            </ReactFlow>
        </React.Fragment>
    );
};

export default LayoutFlow;
