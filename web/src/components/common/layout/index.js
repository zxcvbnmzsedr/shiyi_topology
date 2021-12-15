import config from '../../../utils/siteConfig'
import React from 'react'
import {Helmet} from 'react-helmet'
import './index.css'
import {Link} from 'gatsby'
import Navigation from '../Navigation'
import {StaticImage} from "gatsby-plugin-image"

const DefaultLayout = ({description , title , keywords , children, bodyClass, isHome}) => {
    title = title ? title + "-" + config.title : config.title
    description = description ? description : config.description
    keywords = keywords ? keywords : config.keywords
    return <>
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={`${description}`}/>
            <meta name='keywords' content={`${keywords}`}/>
            <body className={bodyClass}/>
        </Helmet>
        <div className="viewport">
            <div className="viewport-top">
                {/* The main header section on top of the screen */}
                <header className="site-head"
                        style={{...config.coverImage && {backgroundImage: `url(${config.coverImage})`}}}>
                    <div className="container">
                        <div className="site-mast">
                            <div className="site-mast-left">
                                <Link to="/">
                                    <img className="site-logo" src={config.logo} alt={config.title}/>
                                </Link>
                            </div>
                            <div className="site-mast-right">
                                {config.github && <a href={config.github} className="site-nav-item" target="_blank"
                                                     rel="noopener noreferrer">
                                    <img className="site-nav-icon"
                                         src="/images/icons/github-log.png"
                                         alt="Twitter"/>
                                </a>}
                                <a className="site-nav-item"
                                   href={`https://feedly.com/i/subscription/feed/${config.siteUrl}/rss/`}
                                   target="_blank" rel="noopener noreferrer">
                                    <StaticImage className="site-nav-icon"
                                                 src="/images/icons/rss.svg"
                                                 alt="RSS Feed"/>
                                </a>
                            </div>
                        </div>
                        {isHome ?
                            <div className="site-banner">
                                <h1 className="site-banner-title">{config.title}</h1>
                                <p className="site-banner-desc">{config.description}</p>
                            </div> :
                            null}
                        <nav className="site-nav">
                            <div className="site-nav-left">
                                {/* The navigation items as setup in Ghost */}
                                <Navigation data={config.navigation} navClass="site-nav-item"/>
                            </div>
                            <div className="site-nav-right">
                                <Link className="site-nav-button" to="/about">About</Link>
                            </div>
                        </nav>
                    </div>
                </header>

                <main className="site-main">
                    {/* All the main content gets inserted here, index.js, post.js */}
                    {children}
                </main>

            </div>

            <div className="viewport-bottom">
                {/* The footer at the very bottom of the screen */}
                <footer className="site-foot">
                    <div className="site-foot-nav container">
                        <div className="site-foot-nav-left">
                            <Link to="/">{config.title}</Link> © 2021 &mdash;  苏ICP备16037388号
                        </div>
                        <div className="site-foot-nav-right">
                            <Navigation data={config.navigation} navClass="site-foot-nav-item"/>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    </>
}
export default DefaultLayout
