import React, {useContext, useState} from 'react';
import G6 from '@antv/g6';
import {useRequest} from "umi";
import {getData} from "../../services/chart/api";
import {Legend, Toolbar,} from '@antv/graphin-components';
import Graphin, {Behaviors, GraphinContext} from '@antv/graphin';
import {AimOutlined, DeleteOutlined, SearchOutlined, ZoomInOutlined, ZoomOutOutlined} from '@ant-design/icons';
import Search from "./compents/search";
import iconFrontLoader from "../../components/IconFont/IconFontLoader";
// 注册到 Graphin 中
const icons = Graphin.registerFontFamily(iconFrontLoader);

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
  return res;
};

const defaultLayout = {
  type: 'graphin-force',
  preset: {
    type: 'radial',
  },
  animation: true
}
const getIcon = (category) => {
  switch (category) {
    case 'redis':
      return icons.redis;
    case '树':
      return icons.shuzhuangtu;
    case 'java':
      return icons.java;
    case '网络':
      return icons.wangluo;
    case '手撕代码':
      return icons['24gl-code'];
    case '数据结构':
      return icons['relation-full'];
    case '分布式':
      return icons.fenbushi
    default:
      return null;
  }
}
const getNode = ({id, category, title}) => {


  if (id.includes("TODO")) {
    return {
      id,
      category,
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
  return {
    id,
    category,
    style: {
      icon: {
        type: 'font',
        fontFamily: 'iconfont',
        value: getIcon(category),
      },
      label: {
        value: fittingString(title, 80, 12),
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
  const activeState = 'active'
  const inactiveState = 'inactive'
  nodes.forEach((node) => {
    graph.setItemState(node, activeState, false);
    graph.setItemState(node, inactiveState, true);
  })
  edges.forEach((edge) => {
    graph.setItemState(edge, activeState, false);
    graph.setItemState(edge, inactiveState, true);
  })


  graph.setItemState(item, inactiveState, false);
  graph.setItemState(item, activeState, true);

  const rEdges = item.getEdges();
  rEdges.forEach((edge) => {
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
  })
}
const SampleBehavior = (props) => {
  const {id} = props
  const {graph} = useContext(GraphinContext);
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
  const {edges, nodes} = data || {
    edges: [],
    nodes: [],
    combos: []
  };
  const nodesList = nodes.map((node) => {
    return getNode(node)
  })
  const edgeList = edges.map((edge) => {
    return {
      source: edge.source,
      target: edge.target,
      style: {
        label: {
          value: fittingString(edge.label, 80, 12),
          fill: '#000000',
          offset: [0, 0],
        }
      }
    }
  })
  const graphinRef = React.createRef();
  React.useEffect(() => {
    const {
      graph,
    } = graphinRef.current;
    graph.on('node:click', (evt) => {
      changeId(evt.item.getModel().id)
    });
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClear = () => {
    changeId()
  };
  const handleFocus = () => {
    const {graph} = graphinRef.current;
    focusItem(graph, id)
  }
  const zoomIn = () => {
    const {graph, apis} = graphinRef.current;
    const {handleZoomIn} = apis;
    handleZoomIn();
    focusItem(graph, id)
  }
  const zoomOut = () => {
    const {graph, apis} = graphinRef.current;
    const {handleZoomOut} = apis;
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
        <Toolbar.Item onClick={zoomIn} key='zoomIn'><ZoomInOutlined/></Toolbar.Item>
        <Toolbar.Item onClick={zoomOut} key='zoomOut'><ZoomOutOutlined/></Toolbar.Item>
        <Toolbar.Item onClick={handleClear} key='clearCanvas'><DeleteOutlined/></Toolbar.Item>
      </Toolbar>
      <Hoverable/>
      <SampleBehavior id={id}/>
      <ZoomCanvas disabled/>
      <ActivateRelations trigger="click"/>
    </Graphin>
    <Search changeId={changeId} onOk={handleOk} onSelect={handleSelect} onCancel={handleCancel}
            visible={isModalVisible}/>
  </div>;
}


export default G6Graph;
