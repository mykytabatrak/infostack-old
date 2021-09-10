import { createPageContent } from '../../../../common/utils';
import * as pages from '../../pages';

const content = [
  `# RTK Query Quick Start
## What You'll Learn
- How to set up and use Redux Toolkit's "RTK Query" data fetching functionality
## Prerequisites
- Understanding of [Redux terms and concepts](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
## Introduction
Welcome to the Redux Toolkit Query tutorial! **This tutorial will briefly introduce you to Redux Toolkit's "RTK Query" data fetching capability and teach you how to start using it correctly**.

RTK Query is an advanced data fetching and caching tool, designed to simplify common cases for loading data in a web application. RTK Query itself is built on top of the Redux Toolkit core, and leverages RTK's APIs like [\`createSlice\`](../api/createSlice.mdx) and [\`createAsyncThunk\`](../api/createAsyncThunk.mdx) to implement its capabilities.

RTK Query is included in the \`@reduxjs/toolkit\` package as an additional addon. You are not required to use the RTK Query APIs when you use Redux Toolkit, but we think many users will benefit from RTK Query's data fetching and caching in their apps.
### How to Read This Tutorial
For this tutorial, we assume that you're using Redux Toolkit with React, but you can also use it with other UI layers as well. The examples are based on [a typical Create-React-App folder structure](https://create-react-app.dev/docs/folder-structure) where all the application code is in a \`src\`, but the patterns can be adapted to whatever project or folder setup you're using.`,
  `## Setting up your store and API service
To see how RTK Query works, let's walk through a basic usage example. For this example, we'll assume you're using React and want to make use of RTK Query's auto-generated React hooks.
### Create an API service
First, we'll create a service definition that queries the publicly available [PokeAPI](https://pokeapi.co/).
\`\`\`
// file: services/types.ts noEmit
export type Pokemon = {}

// file: services/pokemon.ts
// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Pokemon } from './types'

// highlight-start
// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => \`pokemon/\${name}\`,
    }),
  }),
})
//highlight-end

// highlight-start
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi
// highlight-end
\`\`\`
With RTK Query, you usually define your entire API definition in one place. This is most likely different from what you see with other libraries such as \`swr\` or \`react-query\`, and there are several reasons for that. Our perspective is that it's _much_ easier to keep track of how requests, cache invalidation, and general app configuration behave when they're all in one central location in comparison to having X number of custom hooks in different files throughout your application.

Typically, you should only have one API slice per base URL that your application needs to communicate with. For example, if your site fetches data from both \`/api/posts\` and \`/api/users\`, you would have a single API slice with \`/api/\` as the base URL, and separate endpoint definitions for \`posts\` and \`users\`. This allows you to effectively take advantage of [automated re-fetching](./rtk-query/usage/automated-refetching.mdx) by defining [tag](./rtk-query/usage/automated-refetching.mdx#tags) relationships across endpoints.

For maintainability purposes, you may wish to split up endpoint definitions across multiple files, while still maintaining a single API slice which includes all of these endpoints. See [code splitting](./rtk-query/usage/code-splitting.mdx) for how you can use the \`injectEndpoints\` property to inject API endpoints from other files into a single API slice definition.
### Add the service to your store
An RTKQ service generates a "slice reducer" that should be included in the Redux root reducer, and a custom middleware that handles the data fetching. Both need to be added to the Redux store.
\`\`\`ts title="src/store.ts"
// file: services/pokemon.ts noEmit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: string) => \`pokemon/\${name}\`,
    }),
  }),
})

// file: store.ts
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { pokemonApi } from './services/pokemon'

export const store = configureStore({
  reducer: {
    // highlight-start
    // Add the generated reducer as a specific top-level slice
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    // highlight-end
  },
  // highlight-start
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of \`rtk-query\`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  // highlight-end
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see \`setupListeners\` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
\`\`\``,
  `### Wrap your application with the \`Provider\`
If you haven't already done so, follow the standard pattern for providing the Redux store to the rest of your React application component tree:
\`\`\`ts title="src/index.tsx"
// file: App.tsx noEmit
import React from 'react'
export default function App() {
  return <div>...</div>
}

// file: app/store.ts noEmit
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {},
})

// file: index.tsx
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './app/store'

const rootElement = document.getElementById('root')
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
\`\`\``,
  `## Use the query in a component
Once a service has been defined, you can import the hooks to make a request.
\`\`\`ts title="src/App.tsx"
// file: services/pokemon.ts noEmit
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: string) => \`pokemon/\${name}\`,
    }),
  }),
})

export const { useGetPokemonByNameQuery } = pokemonApi

// file: App.tsx
import * as React from 'react'
// highlight-next-line
import { useGetPokemonByNameQuery } from './services/pokemon'

export default function App() {
  // highlight-start
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useGetPokemonByNameQuery('bulbasaur')
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')
  // highlight-end

  return (
    <div className="App">
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>Loading...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null}
    </div>
  )
}
\`\`\`
When making a request, you're able to track the state in several ways. You can always check \`data\`, \`status\`, and \`error\` to determine the right UI to render. In addition, \`useQuery\` also provides utility booleans like \`isLoading\`, \`isFetching\`, \`isSuccess\`, and \`isError\` for the latest request.`,
];

const startDate = new Date('2021-09-06T16:21:19+0000');

export const queryQuickStart = createPageContent(
  content,
  pages.queryQuickStart.id,
  'RTK Query Quick Start',
  startDate,
);