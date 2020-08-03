#!/usr/bin/env bash

# Creates an .env from ENV variables for use with react-native-config
if [ "$APPCENTER_BRANCH" == "master" ]; 
then  
  ENV_WHITELIST=${ENV_WHITELIST:-"^RN_"}
  printf "Creating an .env.production file with the following whitelist:\n"
  printf "%s\n" $ENV_WHITELIST
  set | egrep -e $ENV_WHITELIST | sed 's/^RN_//g' > .env.production
fi

printf "\n.env.production created with contents:\n\n"
cat .env.production