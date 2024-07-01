import { configureStore } from "@reduxjs/toolkit";
import { slice as apiSlice } from "../features/api/slice";
import { slice as authSlice } from "../features/auth/slice";
// import { teamsReducer as teams } from "./teams";
// import { pagesReducer as pages } from "./pages";
// import { commentsReducer as comments } from "./comments";
// import { usersReducer as users } from "./users";
// import { workspacesReducer as workspaces } from "./workspaces";
// import { tagReducer as tags } from "./tags";
// import { skillReducer as skills } from "./skills";
// import { participantsReducer as participants } from "./participants";
// import { activitiesReducer as activities } from "./activities";
// import { notificationsReducer as notifications } from "./notifications";
// import { githubReducer as github } from "./github";
// import { notificationsSettingsReducer as notificationsSettings } from "./notifications-settings";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    // teams,
    // pages,
    // comments,
    // users,
    // workspaces,
    // tags,
    // skills,
    // participants,
    // activities,
    // notifications,
    // github,
    // notificationsSettings,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
