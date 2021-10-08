// https://umijs.org/config/
import {defineConfig} from 'umi';
import {join} from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const {REACT_APP_ENV} = process.env;
export default defineConfig({
  metas:[
    {
      name:'title',
      content:'时宜拓扑 - 利用拓扑图组织知识'
    },
    {
      name:'content',
      content:'时宜拓扑，使用拓扑图来组织面试题，提供碎片化的面试题，让你在面试中脱颖而出!'
    },
    {
      name:'keyword',
      content:'时宜,时宜拓扑,时宜Java全站,Java面试题,Java全站'
    },
    {
      name:'viewport',
      content:"viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    }
  ],
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    // 'modal-body-padding': '0px',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  history: { type: 'hash' },
  publicPath: './',
  // Fast Refresh 热更新
  fastRefresh: {},
  outputPath:'dist/public',
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  // chainWebpack(memo, {env, webpack, createCSSRule}) {
  //   memo.module.rule("ts")
  //     .test( '/\.(ts|tsx)$/')
  //     .use('ts-loader').loader('ts-loader').options({
  //     transpileOnly: true,
  //   })
  // }
});
