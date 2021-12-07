import React, {useState} from "react"
import {graphql} from "gatsby"
import MindMap from "../components/mindmap";
import Layout from "../components/common/layout";

export default ({data, ...rest}) => {

    // const nodes = JSON.parse(data.allIndexJson.nodes[0].tree)
    const nodes = data.allIndexJson.nodes.map(node => {
        return {
            tree: JSON.parse(node.tree)[0],
            name: node.name
        }
    });

    return (
        <Layout>
            {
                nodes.map(node => {
                    console.log(node)
                    return <>
                        <h1>{node.name}</h1>
                        <MindMap root={node.tree}/>
                    </>
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
                name
            }
        }
    }
`