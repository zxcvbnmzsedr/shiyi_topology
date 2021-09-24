import React, {useContext, useState} from 'react';
import G6 from '@antv/g6';
import {useRequest} from "umi";
import {getData} from "../../services/chart/api";
import {Legend, Toolbar,} from '@antv/graphin-components';
import Graphin, {Behaviors, GraphinContext} from '@antv/graphin';
import {AimOutlined, DeleteOutlined, SearchOutlined, ZoomInOutlined, ZoomOutOutlined} from '@ant-design/icons';
import Search from "./compents/search";

const {
  ZoomCanvas,
  DragNodeWithForce,
  ActivateRelations, // 关联高亮
  Hoverable, // Hover操作
} = Behaviors;
const fittingString = (str, maxWidth, fontSize) => {
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth) {
      res = `${str.substr(0, i)}\n${str.substr(i)}`;
    }
  });
  return str;
};

const defaultLayout = {
  type: 'graphin-force',
  preset: {
    type: 'radial',
  },
  animation: true
}
const defaultNode = ({id, category,title}) => {
  return {
    id: id,
    category: category,
    style: {
      label: {
        value: fittingString(title, 80, 12),
      },
    }
  }
}
const todoNode = ({id, category,title}) => {
  return {
    id: id,
    category: category,
    style: {
      label: {
        value: fittingString(title, 80, 12),
      },
      keyshape: {
        fill: 'red',
        stroke: 'red',
        fillOpacity: 0.1,
        size: 26,
      },
    }
  }
}
const focusItem = (graph, id) => {
  if (!id) {
    return
  }
  const item = graph.findById(id)
  graph.focusItem(item, true, {
    easing: 'easeCubic',
    duration: 500,
  });
  const nodes = graph.getNodes();
  const edges = graph.getEdges();
  const nodeLength = nodes.length;
  const edgeLength = edges.length;
  const activeState = 'active'
  const inactiveState = 'inactive'
  for (let i = 0; i < nodeLength; i++) {
    const node = nodes[i];
    graph.setItemState(node, activeState, false);
    graph.setItemState(node, inactiveState, true);
  }
  for (let i = 0; i < edgeLength; i++) {
    const edge = edges[i];
    graph.setItemState(edge, activeState, false);
    graph.setItemState(edge, inactiveState, true);
  }

  graph.setItemState(item, inactiveState, false);
  graph.setItemState(item, activeState, true);

  const rEdges = item.getEdges();
  const rEdgeLegnth = rEdges.length;
  for (let i = 0; i < rEdgeLegnth; i++) {
    const edge = rEdges[i];
    let otherEnd;
    if (edge.getSource() === item) {
      otherEnd = edge.getTarget();
    } else {
      otherEnd = edge.getSource();
    }
    graph.setItemState(otherEnd, inactiveState, false);
    graph.setItemState(otherEnd, activeState, true);
    graph.setItemState(edge, inactiveState, false);
    graph.setItemState(edge, activeState, true);
    edge.toFront();


  }
}
const SampleBehavior = (props) => {
  const {id} = props
  const {graph, apis} = useContext(GraphinContext);
  if (id) {
    const nn = graph.findById(id);
    if (nn) {
      focusItem(graph, nn.getModel().id)
    }
  }
  return null;
};
const edgeStateStyles = {
  status: {
    inactive: {
      label: {
        visible: false,
      },
    },
  },
};
const G6Graph = (props) => {
  const {data} = useRequest(() => {
    return getData();
  });
  const {changeId, id} = props
  const {edges, nodes, combos} = data || {
    edges: [],
    nodes: [],
    combos: []
  };
  const nodesList = []
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id.includes("TODO")) {
      nodesList.push(todoNode(nodes[i]))
    } else {
      nodesList.push(defaultNode(nodes[i]))
    }
  }
  const edgeList = []
  for (let i = 0; i < edges.length; i++) {
    const tmp = {
      source: edges[i].source,
      target: edges[i].target,
      style: {
        label: {
          value: fittingString(edges[i].label, 3, 12),
          fill: '#000000',
          offset: [0, 0],
        }
      }
    }
    edgeList.push(tmp)
  }
  const graphinRef = React.createRef();
  React.useEffect(() => {
    const {
      graph, // g6 的Graph实例
      apis, // Graphin 提供的API接口,
    } = graphinRef.current;
    graph.on('node:click', (evt) => {
      changeId(evt.item.getModel().id)
    });
  }, []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClear = () => {
    changeId()
  };
  const handleFocus = () => {
    const {graph} = graphinRef.current;
    const {id} = props
    focusItem(graph, id)
  }
  const handleZoomIn = () => {
    const {graph, apis} = graphinRef.current;
    const {handleZoomIn} = apis;
    const {id} = props
    handleZoomIn();
    focusItem(graph, id)
  }
  const handleZoomOut = () => {
    const {graph, apis} = graphinRef.current;
    const {handleZoomOut} = apis;
    const {id} = props
    handleZoomOut();
    focusItem(graph, id)
  }
  const handleSearch = () => {
    setIsModalVisible(true);
  }

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelect = (value) => {
    changeId(value)
    setIsModalVisible(false);
  }
  return <div>
    <Graphin height={800}
             ref={graphinRef}
             edgeStateStyles={edgeStateStyles}
             data={{nodes: nodesList, edges: edgeList}}
             layout={defaultLayout}>
      <DragNodeWithForce autoPin={false}/>
      <Legend bindType="node" sortKey="category">
        <Legend.Node/>
      </Legend>
      <Toolbar direction='vertical'>
        <Toolbar.Item onClick={handleSearch}>
          <SearchOutlined/>
        </Toolbar.Item>
        <Toolbar.Item onClick={handleFocus}><AimOutlined/></Toolbar.Item>
        <Toolbar.Item onClick={handleZoomIn} key='zoomIn'><ZoomInOutlined/></Toolbar.Item>
        <Toolbar.Item onClick={handleZoomOut} key='zoomOut'><ZoomOutOutlined/></Toolbar.Item>
        <Toolbar.Item onClick={handleClear} key='clearCanvas'><DeleteOutlined/></Toolbar.Item>
      </Toolbar>
      <Hoverable/>
      <SampleBehavior id={id}/>
      <ZoomCanvas disabled/>
      <ActivateRelations trigger="click"/>
    </Graphin>
    <Search changeId={changeId} onOk={handleOk} onSelect={handleSelect} onCancel={handleCancel} visible={isModalVisible}/>
  </div>;
}


export default G6Graph;
