import React, { useState } from 'react';
import injectSheet from 'react-jss';
import Header from './Header';

const styles = {
  contentContainer: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    display: 'flex',
  },
  contentSubContainer: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
  },
  content: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    padding: '0px',
    background: props => props.background,
    transition: 'background 0ms !important',

    textAlign: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    backgroundColor: ({ theme }) => theme.palette.primary.dark,
    textRendering: 'optimizelegibility',
    fontFamily: 'Open Sans, sans - serif',
    height: 'calc(100vh - 79px)',
    overflow: 'auto',

    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: ({ theme }) => theme.palette.primary.main,
    },
    '&::-webkit-scrollbar-thumb': {
      background: ({ theme }) => theme.palette.primary.accent,
    },
  },
};

const Item = ({
  classes,
  color,
  icon,
  selected,
  title,
  dark,
  padding,
  children,
  background,
  onSelect,
  header,
  theme,
}) => {
  //console.log(children)
  const [headerContent, setHeaderContent] = useState(null);
  // const lastSection = useRef(title);
  // useLayoutEffect(() => {
  //   console.log('==============')
  //   console.log('useLayoutEffect', title, lastSection, headerContent, (lastSection.current !== title))
  //   if (headerContent && lastSection.current !== title) {
  //     console.log('RAN')
  //     setHeaderContent(null);
  //     lastSection.current = null;
  //   }
  //   console.log('==============')
  //   return () => lastSection.current = title;
  // }, [title, headerContent]);

  return (
    <div className={classes.contentContainer}>
      <div className={classes.contentSubContainer}>
        <div>
          {header ? (
            <Header title={title} theme={theme}>
              {headerContent}
            </Header>
          ) : null}
        </div>
        <div className={classes.content}>
          <div id="modal-root" />
          {children(setHeaderContent)}
        </div>
      </div>
    </div>
  );
};

Item.defaultProps = {
  title: '',
  background: '#000',
  padding: 0,
};

export default injectSheet(styles)(Item);
