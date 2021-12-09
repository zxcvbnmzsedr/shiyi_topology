import React from "react"
import {graphql} from "gatsby"
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import MarkdownNavbar from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';
import * as style from './blog-post.module.css'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism'
import DefaultLayout from "../components/common/layout";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Mermaid from '../components/mermaid'
import CopyButton from "../components/copybutton";

const Post = ({data}) => {
    const rawMarkdownBody = data.markdownRemark

    return (
        <DefaultLayout>
            <div className={style.markdownBody}>
                <ReactMarkdown
                    className="markdown-body"
                    children={rawMarkdownBody.rawMarkdownBody}
                    plugins={[remarkGfm]}
                    components={{
                        img({alt, ...props}) {
                            return <Zoom>
                                <img {...props} alt={alt}/>
                            </Zoom>
                        },
                        // 重写URL ，让他不用跳来跳去
                        a({node, href, className, children, ...props}) {
                            return (
                                <a href={href.split('.md')[0]} {...props}>{children}</a>
                            )
                        }, code: ({inline, children, className, ...props}) => {
                            const txt = children[0];
                            if (
                                txt &&
                                typeof txt === "string" &&
                                typeof className === "string" &&
                                /^language-mermaid/.test(className.toLocaleLowerCase())
                            ) {
                                return <Mermaid chart={txt}/>;
                            }
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <div style={{
                                    position: "relative",
                                }}>
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={okaidia}
                                        PreTag="div"
                                        {...props}
                                    >
                                    </SyntaxHighlighter>
                                    <CopyButton valueToCopy={txt}/>
                                </div>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                />
            </div>
            <div className={style.navContainer}>
                <MarkdownNavbar declarative={true} source={rawMarkdownBody.rawMarkdownBody}/>
            </div>
        </DefaultLayout>
    )
}
export default Post
export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            rawMarkdownBody
            frontmatter {
                title
            }
        }
        allMarkdownRemark {
            nodes {
                id
                rawMarkdownBody
                fileAbsolutePath
            }
        }
    }

`
