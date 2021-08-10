import { createAsyncThunk } from '@reduxjs/toolkit';
import { actions } from './slice';
import { ActionType } from './common';
import { TagApi } from 'services';

const loadTags = createAsyncThunk(
  ActionType.SetTags,
  async (_, { dispatch }): Promise<void> => {
    const response = await new TagApi().getAll();
    dispatch(actions.setTags(response));
  },
);

const requestUpdate = createAsyncThunk(
  ActionType.UpdateTag,
  async (tag: { id: string; name: string }, { dispatch }): Promise<void> => {
    await new TagApi().update(tag.id, tag.name);
    dispatch(actions.updateTag({ id: tag.id, updatedName: tag.name }));
  },
);

const requestAdd = createAsyncThunk(
  ActionType.AddTag,
  async (name: string, { dispatch }): Promise<void> => {
    const response = await new TagApi().add(name);
    dispatch(actions.addTag(response));
  },
);

const requestDelete = createAsyncThunk(
  ActionType.DeleteTag,
  async (id: string, { dispatch }): Promise<void> => {
    await new TagApi().delete(id);
    dispatch(actions.deleteTag({ id }));
  },
);

const tagActions = {
  ...actions,
  loadTags,
  requestUpdate,
  requestAdd,
  requestDelete,
};

export { tagActions, requestUpdate };