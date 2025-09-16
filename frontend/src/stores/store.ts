import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import activitiesSlice from "./activities/activitiesSlice";
import dashboardsSlice from "./dashboards/dashboardsSlice";
import goalsSlice from "./goals/goalsSlice";
import reportsSlice from "./reports/reportsSlice";
import tokensSlice from "./tokens/tokensSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
activities: activitiesSlice,
dashboards: dashboardsSlice,
goals: goalsSlice,
reports: reportsSlice,
tokens: tokensSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
