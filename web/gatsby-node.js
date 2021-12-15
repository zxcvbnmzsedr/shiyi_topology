const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({node, getNode, basePath: `pages`})
        createNodeField({
            node,
            name: `slug`,
            value: slug,
        })
    }
}

exports.createPages = async ({graphql, actions}) => {
    await createMind({graphql, actions})
    await createPost({graphql, actions})
}
const createPost = async ({graphql, actions}) => {

    const {createPage} = actions
    const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

    result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/blog-post.js`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.fields.slug,
            },
        })
    })
}

const createMind = async ({graphql, actions}) => {
    const {createPage} = actions
    const result = await graphql(`
    query MyQuery {
        allIndexJson {
            nodes {
                tree
                name
            }
        }
    }
  `)

    result.data.allIndexJson.nodes.forEach(({name}) => {
        createPage({
            path: name,
            component: path.resolve(`./src/templates/blog-readme-mind.js`),
            context: {
                name: name,
            },
        })
    })
}
