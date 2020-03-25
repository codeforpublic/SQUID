import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'

export const checkReact = (_React: any) => {
  alert(
    'check Reaact:' +
      (React === _React) +
      ':' +
      (React.version === _React.version),
  )
  console.log('React.version', React.version, _React.version)
}

export const checkApollo = (apollo: any) => {
  alert(
    'check ApolloProvider:' +
      (ApolloProvider === apollo)
  )  
}