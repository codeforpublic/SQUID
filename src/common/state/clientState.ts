import * as UserInfo from './userInfo.state'
import * as Application from './application.state'

interface State {
  initialState?: Object
  Mutation?: Object
  Query?: Object
  migrate?: Function
}

const extractMigrate = (states: State[]): Function[] => {
  return states.map(state => state.migrate).filter(Boolean)
}

const resolveState = (states: State[]) => {  
  let defaults = {}
  let resolvers = {
    Query: {},
    Mutation: {},
  }
  for (let state of states) {    
    if (state.initialState) {
      defaults = { ...defaults, ...state.initialState }
    }
    if (state.Query) {
      resolvers.Query = {
        ...resolvers.Query,
        ...state.Query,
      }
    }
    if (state.Mutation) {
      resolvers.Mutation = {
        ...resolvers.Mutation,
        ...state.Mutation,
      }
    }
  }
  return {
    defaults,
    resolvers,
  }
}

export const clientState = resolveState([
  UserInfo.apolloState,
  Application.apolloState,
])

export const migrateState = async (props: any) => {
  const fns = extractMigrate([
    UserInfo.apolloState,
    Application.apolloState,
  ])
  for (let fn of fns) {
    await fn(props)
  }
}