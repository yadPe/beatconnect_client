import React, { useContext } from 'react';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { Button } from 'react-desktop/windows';

const History = ({ theme }) => {
  const history = useContext(HistoryContext)
  return (
    <React.Fragment>
      <p>History</p>
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={history.clear}
      >
        Clear history
      </Button>
    </React.Fragment>
  );
}

export default History;