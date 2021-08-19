import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  EntityState,
} from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { ReducerName, RequestStatus } from 'common/enums/enums';
import { ICommentNormalized } from 'common/interfaces/comment';
import { RootState } from 'common/types/types';
import { fetchComments, createComment, deleteComment } from './actions';
import { ActionType } from './common';

const commentsAdapter = createEntityAdapter<ICommentNormalized>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

type State = {
  status: RequestStatus;
  error: string | null;
};

const addComment = (
  state: EntityState<ICommentNormalized> & State,
  action: PayloadAction<ICommentNormalized>,
): void => {
  const comment = action.payload;
  const { id, parentCommentId } = comment;

  if (parentCommentId !== null) {
    const parent = state.entities[parentCommentId] as ICommentNormalized;

    commentsAdapter.updateOne(state, {
      id: parentCommentId,
      changes: {
        children: [id, ...(parent.children || [])],
      },
    });
  }

  commentsAdapter.addOne(state, comment);
};

export const { reducer, actions } = createSlice({
  name: ReducerName.COMMENTS,
  initialState: commentsAdapter.getInitialState<State>({
    status: RequestStatus.IDLE,
    error: null,
  }),
  reducers: {
    [ActionType.ADD_COMMENT]: addComment,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = RequestStatus.LOADING;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = RequestStatus.SUCCEEDED;
        commentsAdapter.removeAll(state);
        if (action.payload) {
          commentsAdapter.upsertMany(state, action.payload);
        }
      })
      .addCase(fetchComments.rejected, (state) => {
        state.status = RequestStatus.FAILED;
        state.error = 'Could not load comments';
      });
    builder
      .addCase(createComment.fulfilled, addComment)
      .addCase(createComment.rejected, (state) => {
        state.error = 'Could not add comment';
      });
    builder
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { id } = action.meta.arg;
        const comment = state.entities[id] as ICommentNormalized;
        if (comment.parentCommentId !== null) {
          const parent = state.entities[
            comment.parentCommentId
          ] as ICommentNormalized;

          commentsAdapter.updateOne(state, {
            id: parent.id,
            changes: {
              children: parent.children?.filter((child) => child !== id),
            },
          });
        }

        commentsAdapter.removeOne(state, id);
      })
      .addCase(deleteComment.rejected, (state) => {
        state.error = 'Could not delete comment';
      });
  },
});

export const commentsSelectors = commentsAdapter.getSelectors(
  (state: RootState) => state.comments,
);

export const selectRootIds = createSelector(
  commentsSelectors.selectAll,
  (comments) =>
    comments
      .filter((comment) => !comment.parentCommentId)
      .map((comment) => comment.id),
);
