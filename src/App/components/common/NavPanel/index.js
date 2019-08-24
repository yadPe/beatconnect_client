import React, { useState } from 'react';
import injectSheet from 'react-jss';
import SidePanel from './SidePanel';

const styles = {
  NavPanel: {
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
    flex: '1 1 0%',
  }
};

const NavPanel = ({ classes, panelExpandedLength, panelCompactedLength, defaultIsPanelExpanded, dark, color, children, theme, onExpended }) => {
  const [isExpended, setIsExpended] = useState(defaultIsPanelExpanded);
  return (
    <div className={classes.NavPanel}>
      <SidePanel
        items={children}
        theme={theme}
        expended={isExpended}
        setExpended={(expended) => { setIsExpended(expended); onExpended(expended) }}
        defaultIsPanelExpanded={defaultIsPanelExpanded}
        panelCompactedLength={panelCompactedLength}
        panelExpandedLength={panelExpandedLength}
      />

      {children.filter(child => child.props.selected)}

    </div>
  );
}

NavPanel.defaultProps = {
  panelExpandedLength: 150,
  panelCompactedLength: 48,
  defaultIsPanelExpanded: false
}

export default injectSheet(styles)(NavPanel);
