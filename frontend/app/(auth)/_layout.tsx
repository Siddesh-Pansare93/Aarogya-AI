
import { Stack } from 'expo-router';



// Prevent the splash screen from auto-hiding before asset loading is complete.


export default function authLayout() {

  

 

 

  return (

      <Stack>
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
      </Stack>
     
   
  );
}
