import React from 'react'
import ReactMarkdown from 'react-markdown'
import {Link, useRequest} from "umi";
import {getContent} from "../../../services/chart/api";
import remarkGfm from 'remark-gfm'
import mermaid from "mermaid";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {okaidia} from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeRaw from 'rehype-raw'

import 'github-markdown-css'
import './questionDetail'

const QuestionDetail = (props) => {
  const {id} = props;

  const {data} = useRequest(() => {
    return getContent(id);
  });
  if (!id) {
    return <div/>
  }

  const {content} = data || {
    content: null
  };
  return (
    <div>
      {/*<Editor content={content}/>*/}
      <ReactMarkdown
        className="markdown-body"
        children={content}
        plugins={[remarkGfm]}
        rehypePlugins={rehypeRaw}
        components={{
          // 重写URL ，让他不用跳来跳去
          a({node, href, className, children, ...props}) {
            return (
              <Link to={href} {...props}>{children}</Link>
            )
          },
          code: ({inline, children, className, ...props}) => {
            const txt = children[0];
            if (
              txt &&
              typeof txt === "string" &&
              typeof className === "string" &&
              /^language-mermaid/.test(className.toLocaleLowerCase())
            ) {
              const svg = mermaid.render('date' + Date.now().toString(32), txt);
              return <code dangerouslySetInnerHTML={{__html: svg}}/>;
            }
            const match = /language-(\w+)/.exec(className || '')

            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={okaidia}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      />
    </div>
  )


}

export default QuestionDetail;
