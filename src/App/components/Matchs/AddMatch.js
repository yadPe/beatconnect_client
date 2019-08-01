import React, { useState } from 'react';
import { Button, Text } from 'react-desktop/windows';
import TextInput from '../common/TextInput'

const AddMatch = ({ bot, theme }) => {
  const [ reqMatchId, setReqMatchId ] = useState('');
  const test = /^[0-9]{4,10}$/g;
  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Match ID'
        value={reqMatchId}
        onChange={ e => setReqMatchId(e.target.value)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        hidden={!bot.joinMatch}
        onClick={() => bot.joinMatch(reqMatchId)}
      >
        <Text color='fff'>Join</Text>
      </Button>
    </React.Fragment>
  );
}

export default AddMatch;