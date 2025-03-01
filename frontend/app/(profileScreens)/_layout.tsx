
import { Stack } from 'expo-router';



// Prevent the splash screen from auto-hiding before asset loading is complete.


export default function authLayout() {

  

 

 

  return (

      <Stack>
        <Stack.Screen name="dailyIntake" options={{ headerShown: false }} />
      </Stack>
     
   
  );
}
