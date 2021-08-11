import { createAsyncThunk } from '@reduxjs/toolkit';
import { actions } from './slice';
import { ActionType } from './common';
import { PageApi } from 'services';
import { IPageRequest } from 'common/interfaces/pages';

const createPage = createAsyncThunk(
  ActionType.CREATE_PAGE,
  async (createPayload: IPageRequest, { dispatch }) => {
    dispatch(actions.toggleSpinner());
    const createPageResponse = await new PageApi().createPage(createPayload);
    dispatch(actions.createPage(createPageResponse));
    dispatch(actions.toggleSpinner());
  },
);

const createVersionPage = createAsyncThunk(
  ActionType.CREATE_VERSION_PAGE,
  async (createVersionPayload: IPageRequest, { dispatch }) => {
    const createVersionPageResponse = await new PageApi().createVersionPage(
      createVersionPayload,
    );
    dispatch(actions.createVersionPage(createVersionPageResponse));
  },
);

const getPagesAsync = createAsyncThunk(
  ActionType.SET_PAGES,
  async (payload: undefined, { dispatch }) => {
    const response = await new PageApi().getPages();
    dispatch(actions.setPages(response));
  },
);

const getPage = createAsyncThunk(
  ActionType.GET_PAGE,
  async (getPayload: string | undefined, { dispatch }) => {
    dispatch(actions.toggleSpinner());
    const createPageResponse = await new PageApi().getPage(getPayload);
    dispatch(actions.getPage(createPageResponse));
    dispatch(actions.toggleSpinner());
  },
);

const setPage = createAsyncThunk(
  ActionType.GET_PAGE,
  async (getPayload: string | undefined, { dispatch }) => {
    const pageResponse = await new PageApi().getPage(getPayload);
    dispatch(actions.getPage(pageResponse));
  },
);

const setCurrentPageFollowed = createAsyncThunk(
  ActionType.SET_CURRENT_PAGE_FOLLOWED,
  async (payload: boolean, { dispatch }) => {
    dispatch(actions.setCurrentPageFollowed(payload));
  },
);

const pagesActions = {
  ...actions,
  createPage,
  createVersionPage,
  getPagesAsync,
  getPage,
  setPage,
  setCurrentPageFollowed,
};

export { pagesActions };
