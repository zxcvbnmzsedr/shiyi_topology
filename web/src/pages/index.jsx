import React, {useState} from "react"
import {graphql} from "gatsby"
import MindMap from "../components/mindmap";
import Layout from "../components/common/layout";

export default ({data, ...rest}) => {

    const nodes = JSON.parse(data.allIndexJson.nodes[0].tree)
    console.log(nodes)

    return (
        <Layout>
            {
                nodes.map(node => {
                    return <MindMap root={node}/>
                })
            }

        </Layout>
    )
}

export const query = graphql`
    query MyQuery {
        allIndexJson {
            nodes {
                tree
            }
        }
    }
`