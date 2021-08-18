import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common';
import { UserApi } from 'services';
import { actions } from './slice';
import { RootState } from 'common/types/types';
import { IUserActivity } from 'common/interfaces/user';
import { IPaginated } from 'common/interfaces/common';

const fetchActivities = createAsyncThunk(
  ActionType.FETCH_ACTIVITIES,
  async (_, { dispatch, getState }): Promise<void> => {
    dispatch(actions.toggleIsLoading());

    const state = getState() as RootState;
    const { user } = state.auth;
    const { filter, pagination } = state.activities;
    let result: IPaginated<IUserActivity>;

    if (filter === 'All') {
      result = await new UserApi().getActivities(pagination);
    } else {
      result = await new UserApi().getUserActivities({
        userId: user?.id || '',
        ...pagination,
      });
    }

    dispatch(actions.setActivities(result.items));
    dispatch(actions.updatePagination({ skip: result.items.length }));
    dispatch(actions.updateTotalItems(result.totalItems));
    dispatch(actions.toggleIsLoading());
  },
);

const loadMoreActivities = createAsyncThunk(
  ActionType.LOAD_MORE,
  async (_, { dispatch, getState }): Promise<void> => {
    dispatch(actions.toggleIsLoading());

    const state = getState() as RootState;
    const { user } = state.auth;
    const { filter, pagination } = state.activities;
    let result: IPaginated<IUserActivity>;

    if (filter === 'All') {
      result = await new UserApi().getActivities(pagination);
    } else {
      result = await new UserApi().getUserActivities({
        userId: user?.id || '',
        ...pagination,
      });
    }

    dispatch(actions.updateActivities(result.items));
    dispatch(
      actions.updatePagination({ skip: pagination.skip + result.items.length }),
    );
    dispatch(actions.updateTotalItems(result.totalItems));
    dispatch(actions.toggleIsLoading());
  },
);

const activitiesActions = {
  ...actions,
  fetchActivities,
  loadMoreActivities,
};

export { activitiesActions };
