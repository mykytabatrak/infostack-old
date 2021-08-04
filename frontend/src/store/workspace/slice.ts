import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReducerName } from 'common/enums/app/reducer-name.enum';
import { IWorkspaceUser } from 'common/interfaces/workspace';
import { ITeam } from 'common/interfaces/team';
import { ActionType } from './common';

type State = {
  users: IWorkspaceUser[];
  teams: ITeam[];
};

const initialState: State = {
  users: [],
  teams: [],
};

const { reducer, actions } = createSlice({
  name: ReducerName.WORKSPACE,
  initialState,
  reducers: {
    [ActionType.SetUsers]: (state, action: PayloadAction<IWorkspaceUser[]>) => {
      state.users = action.payload;
    },
    [ActionType.SetTeams]: (state, action: PayloadAction<ITeam[]>) => {
      state.teams = action.payload;
    },
  },
});

export { reducer, actions };
