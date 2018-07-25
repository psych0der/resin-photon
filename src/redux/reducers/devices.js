// @flow

import * as Constants from '../../commons/constants';
import { Object } from 'core-js';
export const FETCH_COMPLETE_DATA_START = 'BULBDATA/FETCH_COMPLETE_DATA_START';
export const FETCH_COMPLETE_DATA_SUCCESS =
  'BULBDATA/FETCH_COMPLETE_DATA_SUCCESS';
export const FETCH_COMPLETE_DATA_FAILED = 'BULBDATA/FETCH_COMPLETE_DATA_FAILED';

type State = {
  +completeData: null | Array<{
    +id: string,
    +name: string,
    +activity: boolean,
    +brightness: number,
  }>,
  +fetchCompleteDataState: string,
  +fetchCompleteDataError: any,
};

const initialState: State = {
  completeData: null,
  fetchCompleteDataState: Constants.IDLE,
  fetchCompleteDataError: null,
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_COMPLETE_DATA_START:
      return {
        ...state,
        fetchCompleteDataState: Constants.IN_PROGRESS,
      };

    case FETCH_COMPLETE_DATA_SUCCESS:
      return Object.assign({}, state, {
        completeData: action.result,
        fetchCompleteDataState: Constants.SUCCESS,
      });

    case FETCH_COMPLETE_DATA_FAILED:
      return {
        ...state,
        fetchCompleteDataState: Constants.FAILED,
        completeData: null,
        fetchCompleteDataError: action.error.toString(),
      };

    default:
      return state;
  }
};

// fetch complete data from server
export const fetchCompleteData = () => (dispatch: Dispatch) => {
  dispatch({
    types: [
      FETCH_COMPLETE_DATA_START,
      FETCH_COMPLETE_DATA_SUCCESS,
      FETCH_COMPLETE_DATA_FAILED,
    ],
    promise: () => {
      return fetch(
        `http://${process.env.REACT_APP_API_HOST}:${
          process.env.REACT_APP_API_PORT
        }/api/v1/device`
      )
        .then(function(response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error(
            'Network response was not ok.: ' + response.statusText
          );
        })
        .then(function(jsonResult) {
          return jsonResult.data;
        });
    },
  });
};
