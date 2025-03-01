import { registerUser } from '@/api';
import * as Linking from 'expo-linking'
import { router } from 'expo-router';

export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/oauth-redirect"), // Placeholder to complete the OAuth flow
    });

    console.log("Created Session:", createdSessionId);
    console.log("Sign-Up Data:", signUp);
    console.log("Redirecting to:", createdSessionId ? "/home" : "/UserDataform")

    if (createdSessionId) {
      // User is logging in
      if (setActive) {
        await setActive({ session: createdSessionId });
        router.push('/(root)/(tabs)/home'); // Navigate to home
        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    } else if (signUp?.createdUserId) {
      // User is registering
      try {
        const response = await registerUser({
          name: `${signUp.firstName} ${signUp.lastName}`,
          email: signUp.emailAddress,
          clerkId: signUp.createdUserId,
        });

        if (response.success) {
          await setActive({ session: response.sessionId });
          router.push('/(boarding)/(tabs)/UserDataform'); // Navigate to UserDataform
          return {
            success: true,
            message: "Registration successful, please complete your profile.",
          };
        } else {
          router.push('/(auth)/signup'); // Registration failure fallback
          return {
            success: false,
            message: "Registration failed. Please try again.",
          };
        }
      } catch (error) {
        console.error("Error during registration:", error);
        return {
          success: false,
          message: "An error occurred while registering the user.",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred during the OAuth process.",
    };
  } catch (err: any) {
    console.error("OAuth error:", err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage || "An error occurred during OAuth flow.",
    };
  }
};



