import React from "react"
import {graphql, Link} from "gatsby"
import MindMap from "../components/mindmap";
import Layout from "../components/common/layout";
import * as styles from './index.module.css'
import Masonry from 'react-masonry-css'
import {navigate} from "gatsby"

export default ({data}) => {

    const nodes = data.allIndexJson.nodes.map(node => {
        return {
            tree: JSON.parse(node.tree)[0],
            name: node.name
        }
    });
    const itemOnClick = (name) => {
        navigate(name)
    }
    return (
        <Layout>
            <Masonry
                breakpointCols={3}
                className={styles.myMasonryGrid}
                columnClassName={styles.myMasonryGrid_column}>
                {
                    nodes.map(node => {
                        return <div onClick={() => itemOnClick(node.name)}>
                            <h3 className={styles.mindTitle}>
                                <Link to={node.name}>{node.name}</Link>
                            </h3>
                            <MindMap root={node.tree}/>
                        </div>
                    })
                }
            </Masonry>
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
