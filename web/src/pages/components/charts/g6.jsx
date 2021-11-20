import React from "react";
import Graphin, {Behaviors, Utils} from '@antv/graphin';
import {Legend, Toolbar,} from '@antv/graphin-components';

const {
    ZoomCanvas,
    DragNodeWithForce,
    ActivateRelations, // 关联高亮
    Hoverable, // Hover操作
} = Behaviors;
const data2 = Utils.mock(8).tree().graphin();
const defaultLayout = {
    type: 'graphin-force',
    preset: {
        type: 'radial',
    },
    animation: true
}
const G6Graph = (props) => {
    return <Graphin height={800}
                    data={data2}
                    layout={defaultLayout}>
        <DragNodeWithForce autoPin={false}/>
        <Legend bindType="node" sortKey="category">
            <Legend.Node/>
        </Legend>
        <Hoverable/>
        <ZoomCanvas disabled/>
        <ActivateRelations trigger="click"/>
    </Graphin>
}
export default G6Graph