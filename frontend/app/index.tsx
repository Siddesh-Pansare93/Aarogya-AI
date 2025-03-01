import { View, Text } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
import "../global.css"
import { useAuth, useUser } from '@clerk/clerk-expo'

const Home = () => {


  const { isSignedIn  } = useAuth()
  const {user} = useUser()

  if (isSignedIn) {
    // return <Redirect href={'/(boarding)/(tabs)/UserDataform'} />
    return <Redirect href={'/(root)/(tabs)/home'} />
  }

  return (
    <Redirect href="/(auth)/welcome" />
  )
}

export default Home