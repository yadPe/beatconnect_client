import React, { useState } from 'react';
import injectSheet from 'react-jss';
import SidePanel from './SidePanel';
import config from '../../../../shared/config';

const styles = {
  NavPanel: {
    display: 'flex',
    flexWrap: 'nowrap',
    position: 'relative',
    flex: '1 1 0%',
  },
};

const NavPanel = ({
  classes,
  panelExpandedLength,
  panelCompactedLength,
  defaultIsPanelExpanded,
  expendable,
  volume,
  tasks,
  sidePanelBackground,
  children,
  onExpended = () => {},
  autoExpend = false,
  subPanel,
}) => {
  const [isExpended, setIsExpended] = useState(defaultIsPanelExpanded);
  return (
    <div className={classes.NavPanel}>
      <SidePanel
        autoExpend={autoExpend}
        subPanel={subPanel}
        items={children}
        expended={isExpended}
        setExpended={expended => {
          setIsExpended(expended);
          onExpended(expended);
        }}
        defaultIsPanelExpanded={defaultIsPanelExpanded}
        panelCompactedLength={panelCompactedLength}
        panelExpandedLength={panelExpandedLength}
        expendable={expendable}
        background={sidePanelBackground}
        volume={volume}
        tasks={tasks}
      />

      {children.filter(child => child.props.selected)}
    </div>
  );
};

NavPanel.defaultProps = {
  panelExpandedLength: config.display.sidePanelExpandedLength,
  panelCompactedLength: config.display.sidePanelCompactedLength,
  defaultIsPanelExpanded: false,
};

export default injectSheet(styles)(NavPanel);
