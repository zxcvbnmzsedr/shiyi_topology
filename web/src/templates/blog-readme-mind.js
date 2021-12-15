import React from "react"
import {graphql} from "gatsby"
import 'markdown-navbar/dist/navbar.css';
import DefaultLayout from "../components/common/layout";
import 'react-medium-image-zoom/dist/styles.css'
import MindMap from "../components/mindmap";

const BlogReadmeMind = ({data}) => {
    const node = data.allIndexJson.nodes[0]
    const tree = JSON.parse(node.tree)[0];
    const name = node.name
    return (
        <DefaultLayout title={name}>
            <h1 style={{'text-align': 'center'}}>{name}</h1>
            <MindMap isScale={false} root={tree} initialTreeDepth={-1}/>
        </DefaultLayout>
    )
}
export default BlogReadmeMind
export const query = graphql`
    query($name: String!) {
        allIndexJson(filter: { name: { eq: $name } }) {
            nodes{
             tree
             name
            }
        }
    }

`
