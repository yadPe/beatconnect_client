import React from 'react';
import injectSheet from 'react-jss';
import Skeleton from '../../../common/Skeleton';

const styles = {
  skeleton: {
    marginRight: '1rem',
    display: 'inline-block',
    position: 'relative',
    height: '180px',
    width: '180px',
    borderRadius: '4px',
    scrollSnapAlign: 'start',
  },
};

const SkeletonPack = ({ classes }) => <Skeleton className={classes.skeleton} />;

export default injectSheet(styles)(SkeletonPack);
