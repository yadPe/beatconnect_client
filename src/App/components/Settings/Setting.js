import React from 'react'
import TextInput from '../common/TextInput';
import injectSheet from 'react-jss';
import Toggle from '../common/Toggle';
import {Button} from 'react-desktop/windows';

const styles = {
  Setting: {
    width: '80%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-evenly',
    '& p': {
      fontSize: '50%',
      textAlign: 'left',
      margin: 0,
      marginLeft: 5
    }
  },
  subCategory: {
    border: '2px solid black'
  }
};

const Setting = ({ classes, theme, settingCategory }) => {

  const renderFields = () => {
    return Object.keys(settingCategory).map(subCategory => {
      return(
        <div className={classes.subCategory} >
          <p>{subCategory}</p>
          {
            settingCategory[subCategory].map(item => {
              switch (item.type) {
                case String:
                  return (
                    <div key={item.name} className={classes[item.name.replace(/ /g, '')]}>
                      <p>{item.name}</p>
                      <TextInput
                        theme={theme.style}
                        color={theme.color}
                        placeholder={item.name}
                        value={item.value}
                        type={item.pass ? 'password' : null}
                        onChange={e => item.action(e.target.value)}
                      />
                    </div>
                  )
                case Boolean:
                  return (
                    <div key={item.name}>
                      <p>{item.name}</p>
                      <Toggle
                        theme={theme}
                        checked={item.value}
                        onChange={e => item.action(e.target.checked)}
                      />
                    </div>
                  )
                case 'Button':
                  return(
                    <Button
                    className='btn'
                    push
                    color={theme.color}
                    onClick={item.action}
                  >
                    Clear history
                  </Button>
                  )
              }
            })
          }
        </div>
      )
    })
    
  }

  return (
    <div className={classes.Setting}>
      {renderFields()}
    </div>
  );
}

export default injectSheet(styles)(Setting);