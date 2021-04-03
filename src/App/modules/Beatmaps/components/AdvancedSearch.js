import React, { useState, useEffect, useReducer } from 'react';
import { useTheme, createUseStyles } from 'react-jss';

import TextInput from '../../common/TextInput';
import renderIcons from '../../../helpers/renderIcons';
import { useDisclosure, Modal } from '../../common/Modal';
import TwoHandleRangeInput from '../../common/TwoHandleRangeInput';
import Button from '../../common/Button';
import { min } from 'underscore';

const useStyle = createUseStyles({
  AdvancedSearchModal: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '36rem',
    margin: '-0.6rem 0',
    justifyContent: 'space-around',
    '& .fieldContainer': {
      width: '16rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '0.6rem 0',
    },
    '& .sliderContainer': {
      width: '9rem',
      marginRight: '0.32rem',
      '& .valuesDisplay': {
        width: '110%',
        display: 'flex',
        justifyContent: 'space-between',
        marginLeft: '-0.32rem',
        '& p': {
          margin: 0,
        },
      },
    },
    '& .minMaxInputContainer': {
      width: '9.38rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& input': {
        width: '3rem',
      },
    },
    '& button': {
      margin: '0.6rem 0',
      marginLeft: 'auto',
    },
  },
});

const defaultFormValues = Object.freeze({
  //text
  title: null,
  artist: null,
  creator: null,
  tags: null,
  title: null,
  mapset: null,
  difficulty: null,
  //gameRange
  cs: { min: null, max: null },
  ar: { min: null, max: null },
  hp: { min: null, max: null },
  stars: { min: null, max: null },
  drain: { min: null, max: null },
  //f32Range
  bpm: { min: null, max: null },
  length: { min: null, max: null },
  favcount: { min: null, max: null },
});

const fieldTypes = Object.freeze({
  text: ['title', 'artist', 'creator', 'tags', 'title', 'mapset', 'difficulty'],
  gameRange: ['cs', 'ar', 'hp', 'stars', 'drain'],
  f32Range: ['bpm', 'length', 'favcount'],
});

let formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'RESET':
      return action.value;
    default:
      return state;
  }
};

export const AdvancedSearch = ({ onSubmit, lastSearchValues }) => {
  const modal = useDisclosure();
  const classes = useStyle();
  const theme = useTheme();
  const defaultValues = lastSearchValues || defaultFormValues;

  const [formState, dispatch] = useReducer(formReducer, defaultValues);

  const handleFieldChange = ({ field, value }) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field,
      value,
    });
  };

  const handleMinFieldChange = ({ field, value }) => {
    dispatch({
      type: 'UPDATE_MIN_FIELD',
      field,
      value,
    });
  };
  const handleMaxFieldChange = ({ field, value }) => {
    dispatch({
      type: 'UPDATE_MAX_FIELD',
      field,
      value,
    });
  };

  return (
    <>
      <Button className="btn" color={theme.palette.primary.accent} onClick={() => modal.show()}>
        {renderIcons({ name: 'Settings', style: theme.accentContrast })}
      </Button>
      {modal.isOpen && (
        <Modal
          title="Advanced Search"
          hide={() => {
            modal.hide();
            dispatch({
              type: 'RESET',
              value: defaultValues,
            });
          }}
        >
          <form
            className={classes.AdvancedSearchModal}
            onSubmit={e => {
              e.preventDefault();
              onSubmit(formState);
              modal.hide();
            }}
          >
            {Object.entries(formState).map(([field, value]) => {
              if (fieldTypes.text.includes(field)) {
                return (
                  <div className="fieldContainer" key={'advancedSearchField-' + field}>
                    <label>{field}:</label>
                    <TextInput
                      placeholder={field}
                      name={field}
                      type="text"
                      value={value || ''}
                      onChange={e => handleFieldChange({ field, value: e.target.value })}
                    ></TextInput>
                  </div>
                );
              }
              if (fieldTypes.gameRange.includes(field)) {
                return (
                  <div className="fieldContainer" key={'advancedSearchField-' + field}>
                    <label>{field}:</label>
                    <div className="sliderContainer">
                      <TwoHandleRangeInput
                        value={[value.min ?? 0, value.max ?? 10]}
                        onChange={([min, max]) => handleFieldChange({ field, value: { min, max } })}
                      />
                      <div className="valuesDisplay">
                        <p>{value.min ?? 0}</p>
                        <p>{value.max ?? 10}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              if (fieldTypes.f32Range.includes(field)) {
                return (
                  <div className="fieldContainer" key={'advancedSearchField-' + field}>
                    <label>{field}:</label>
                    <div className="minMaxInputContainer">
                      <input
                        placeholder="min"
                        type="number"
                        value={value.min ?? ''}
                        onChange={e => handleFieldChange({ field, value: { min: e.target.value, max: value.max } })}
                      />
                      <span> - </span>
                      <input
                        placeholder="max"
                        type="number"
                        value={value.max ?? ''}
                        onChange={e => handleFieldChange({ field, value: { min: value.min, max: e.target.value } })}
                      />
                    </div>
                  </div>
                );
              }
              return undefined;
            })}
            <Button type="submit" className="btn" color={theme.palette.primary.accent}>
              Search
            </Button>
          </form>
        </Modal>
      )}
    </>
  );
};
