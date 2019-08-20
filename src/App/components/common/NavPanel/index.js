import React, { useState } from 'react';
import injectSheet from 'react-jss';
import SidePanel from './SidePanel';
import store from '../../../../store';

const styles = {
  NavPanel: {
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
    flex: '1 1 0%',
  },
  contentContainer: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 0,
    display: 'flex',
  },
  contentSubContainer: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
  },
  header: {
    position: 'relative',
    color: 'rgb(0, 0, 0)',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    // font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif,
    fontSize: '15px',
    textTransform: 'uppercase',
    padding: '0px 24px',
    overflow: 'hidden',
    cursor: 'default',
    userSelect: 'none',
    color: props => props.theme.dark ? '#fff' : '#000'
  },
  content: {
    display: 'flex',
    flex: '1 1 0%',
    flexDirection: 'column',
    padding: '0px',
    background: props => props.background,
  }
};

const NavPanel = ({ classes, panelExpandedLength, panelCompactedLength, defaultIsPanelExpanded, dark, color, children, theme, onExpended }) => {
  const [isExpended, setIsExpended] = useState(defaultIsPanelExpanded)
  console.log(children)
  return (
    <div className={classes.NavPanel}>
      <SidePanel items={children} theme={theme} expended={isExpended} setExpended={(expended) => {setIsExpended(expended); onExpended(expended)}} defaultIsPanelExpanded={defaultIsPanelExpanded} panelCompactedLength={panelCompactedLength} panelExpandedLength={panelExpandedLength} />
      <div className={classes.contentContainer}>
        <div className={classes.contentSubContainer}>
          <div>
            <div className={classes.header}>
              <span data-radium="true">{children.filter(child => child.props.selected)[0].props.title}</span>
            </div>
          </div>
          <div className={classes.content}>
      	    {children.filter(child => child.props.selected)}
          </div>
        </div>
      </div>
    </div>
  );
}

NavPanel.defaultProps = {
  panelExpandedLength: 150,
  panelCompactedLength: 48,
  defaultIsPanelExpanded: true
}

export default injectSheet(styles)(NavPanel);
