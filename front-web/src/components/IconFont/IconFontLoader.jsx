import fonts from './iconfont.json';
import './iconFont.less';

const iconFrontLoader = () => {
  return {
    fontFamily: 'iconfont',
    glyphs: fonts.glyphs.map((a)=>{
      // eslint-disable-next-line no-param-reassign
      a.name = a.font_class
      return a
    }),
  };
};
export default iconFrontLoader
