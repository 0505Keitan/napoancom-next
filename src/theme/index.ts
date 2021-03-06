import { extendTheme } from '@chakra-ui/react';

import { createBreakpoints } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';
export const themeColor = '#4579E1';
export const globalLayout = {
  navHeight: 56,
  asideWidth: 300,

  // WordPressで650pxだったのでこれがちょうどいいと思う
  mainWidth: 650,
  layoutPadding: 70,
  maxW: 0,
  ogp: {
    w: 1300,
    h: 650,
  },
};

globalLayout.maxW = globalLayout.asideWidth + globalLayout.mainWidth + globalLayout.layoutPadding;

// ブレークポイントを柔軟に切り替える
export const customBreakPoints = createBreakpoints({
  sm: '30em',
  //md: "48em",
  md: `${globalLayout.mainWidth / 16}em`,
  lg: `${globalLayout.maxW / 16}em`,
  xl: '80em',
  '2xl': '96em',
});

// Do not name this 'theme' since this must be 'extended' with 'extendTheme'
const globalTheme = {
  breakpoints: customBreakPoints,
  textStyles: {
    h1: {
      fontSize: ['28px', '36px'],
      fontWeight: 'bold',
      lineHeight: '110%',
      letterSpacing: '-2%',
    },
    h2: {
      fontSize: ['26px', '34px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h3: {
      fontSize: ['24px', '32px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h4: {
      fontSize: ['22px', '24px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h5: {
      fontSize: ['20px', '28px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
    h6: {
      fontSize: ['11px', '14px'],
      fontWeight: 'semibold',
      lineHeight: '110%',
      letterSpacing: '-1%',
    },
  },
  styles: {
    global: (props: any) => ({
      '.mdrenderWrapper': {
        h1: {
          fontSize: ['28px', '36px'],
          fontWeight: 'bold',
          lineHeight: '110%',
          letterSpacing: '-2%',
        },
        h2: {
          fontSize: ['26px', '34px'],
          fontWeight: 'semibold',
          lineHeight: '110%',
          letterSpacing: '-1%',
        },
        h3: {
          fontSize: ['24px', '32px'],
          fontWeight: 'semibold',
          lineHeight: '110%',
          letterSpacing: '-1%',
        },
        h4: {
          fontSize: ['22px', '24px'],
          fontWeight: 'semibold',
          lineHeight: '110%',
          letterSpacing: '-1%',
        },
        h5: {
          fontSize: ['20px', '28px'],
          fontWeight: 'semibold',
          lineHeight: '110%',
          letterSpacing: '-1%',
        },
        h6: {
          fontSize: ['11px', '14px'],
          fontWeight: 'semibold',
          lineHeight: '110%',
          letterSpacing: '-1%',
        },
        p: {
          margin: '0.6rem 0 2.4rem',
        },
        'h1,h2,h3,h4,h5,h6': {
          position: 'relative',
          marginTop: '2.5rem',
          marginBottom: '1.4rem',
          paddingLeft: '0.4rem',
        },
        'h1:before,h2:before,h3:before,h4:before,h5:before,h6:before': {
          content: "''",
          display: 'block',
          height: '100%',
          left: 0,
          top: 0,
          position: 'absolute',
          borderLeft: 'solid 2px',
          borderColor: 'gray.500',
        },
        a: {
          color: 'blue.600',
        },
        'a:hover': {
          color: 'purple',
        },
        'b, span, em, i': {
          // 昔の記事のインラインスタイルは、全部黒白にする。読みづらいから！！！
          color: mode('black!important', 'white!important')(props),
          background: mode('', 'transparent!important')(props),
        },
        strong: {
          fontWeight: 'bold',
          background: mode(
            'linear-gradient(rgba(0, 0, 0, 0) 80%, #ffff66 75%)',
            'linear-gradient(rgba(0, 0, 0, 0) 80%, #a58900 75%)',
          )(props),
        },
        'img,video': {
          objectFit: 'cover',
          height: 'auto',
          margin: '0.2rem 0',
        },
        dl: {
          marginTop: '2rem',
          paddingBottom: '1rem',
          border: 'solid 2px #555',
        },
        dt: {
          position: 'relative',
          display: 'inline-block',
          background: mode('white', 'black')(props),
          top: '-0.8rem',
          left: '0.5rem',
          padding: '0 0.4rem',
        },
        dd: {
          position: 'relative',
          margin: 0,
          top: 0,
          paddingLeft: '1rem',
        },
        kbd: {
          borderTop: '1px solid #F5F5F5',
          display: 'inline-block',
          position: 'relative',
          verticalAlign: 'middle',
          padding: '0.3rem 0.7rem',
          background: '#eee',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          margin: '0.2rem 0.5rem',
          boxShadow: '0px 4px 0px 0px #999',
        },
        blockquote: {
          margin: '1em 0.5em 1em',
          padding: '1em',
          background: '#eee',
          borderRadius: '8px',
        },
        'th,td': {
          border: 'solid 1px #eee',
        },
        'ul, ol': {
          margin: '0.5em 0 0.5em 2em',
        },
        'ul li, ol li': {
          margin: '0.3em 0',
        },
        iframe: {
          maxWidth: '100%',
          overflow: 'hidden',
        },

        // 以下、独自
        '.youtube-box': {
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
        },
        '.youtube-box iframe': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        },
        'b.command': {
          fontSize: '1.1em',
          display: 'inline-block',
          margin: '3px 2px 3px',
          padding: '3px',
          borderRadius: '3px',
          fontWeight: 'bold',
          background: mode('#dbdbdb', '#333')(props),
          wordBreak: 'break-word',
          color: mode('black', 'white')(props),
        },
        '.command-highlight': {
          display: 'inline-block',
          padding: '2px 5px',
          margin: '0px 2px',
          background: mode('#ececec', '#333')(props),
          borderRadius: '3px',
          border: 'solid 1px #ccc',
          wordBreak: 'break-all',
        },
        '.black-highlight': {
          display: 'inline-block',
          padding: '2px 5px',
          margin: '0px 2px',
          background: '#222',
          color: '#fff!important',
          borderRadius: '3px',
        },
        '.code': {
          fontFamily: "Consolas, 'Courier New', Courier, Monaco, monospace, Noto Sans",
        },
        '.strong-notice': {
          margin: '10px 6px',
          padding: '10px',
          border: 'solid 2px red',
          background: mode('#fdd', '#f22')(props),
          boxShadow: '0px 3px 0px rgba(250, 100, 100, 0.3)',
        },

        'a.back-button': {
          marginLeft: 'auto',
          display: 'table',
          padding: '0.5em',
          textDecoration: 'none',
          borderRadius: '5px',
          background: themeColor,
          color: '#fff !important',
          fontSize: '1.1em',
          fontWeight: 'bold',
        },
      },
    }),
  },
};

export const theme = extendTheme(globalTheme);
