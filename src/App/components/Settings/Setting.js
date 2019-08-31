import React from 'react'
import TextInput from '../common/TextInput';
import injectSheet from 'react-jss';
import Toggle from '../common/Toggle';
import {Button} from 'react-desktop/windows';

const styles = {
  Setting: {
    margin: '0 4vmin',
    paddingTop : '20px' ,
    justifyContent: 'space-evenly',
    '& p': {
      fontSize: '1.05rem',
      textAlign: 'left',
      margin: 0,
      marginLeft: 5
    }
  },
  subCategory: {
    padding: '20px 20px 20px 20px', 
    display: 'flex',
    flex:3,
    flexWrap: 'wrap',
    border: '1px solid #2a2a2a',
    borderRadius: '5px',
    marginTop: '15px',
    '&:hover': {
      backgroundColor : 'rgba(255, 255, 255, 0.04)',
    },
    '& > :last-child': {
      marginRight: '0px',
      order: 1
    },
    '& div': {
      marginRight: '20px',
      '& p' : {
        fontWeight: 'bold',
      }
    }
  },
  Toggle: {
    display: 'inline-flex',
    margin: '0px auto 10px auto',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: '5px',
    borderRadius: '5px',
    // cursor: 'pointer',
    marginRight: '0px !important',
    '& label':{
      margin: 'auto 10px',
    }
  }
};

const Setting = ({ classes, theme, settingCategory }) => {

  const renderFields = () => {
    return Object.keys(settingCategory).map(subCategory => {
      return(
        <div className={classes.subCategory} >
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
                    <div key={item.name} className={classes.Toggle}>
                      <div style={{margin: 'auto auto auto 0'}}>
                      <p>{item.name}</p>
                      <p style={{fontWeight: 100, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)'}}>{item.description}</p>
                      </div>
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
                default: 
                  return <div>{item.name}</div>
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