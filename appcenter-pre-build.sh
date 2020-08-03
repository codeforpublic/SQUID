#!/usr/bin/env bash

# Creates an .env from ENV variables for use with react-native-config
if [ "$ENVIRONMENT_VARIABLE" == "production" ]; 
then  
  ENV_WHITELIST=${ENV_WHITELIST:-"^RN_"}
  printf "Creating an .env.production file with the following whitelist:\n"
  printf "%s\n" $ENV_WHITELIST
  set | egrep -e $ENV_WHITELIST | sed 's/^RN_//g' > .env.production
  
  printf "\n.env.production created with contents:\n\n"
  cat .env.production
else 
  printf "\n.env.dev created with contents:\n\n"
  cat .env.dev
fi
