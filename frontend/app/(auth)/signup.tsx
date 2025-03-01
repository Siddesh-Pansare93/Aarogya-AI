import { View, Text, Image, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/customButton';
import { Link } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import axios from 'axios';
import { registerUser } from '@/api';

const SignIn = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [verification, setVerification] = React.useState({
    status: 'default',
    error: '',
    code: '',
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Ensure name, email, and password are not empty
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return; // Stop the execution if any field is empty
    }

    try {
      // Split name into first and last namel

      // Start sign-up process using email and password provided
      await signUp.create({
        emailAddress: form.email,
        password: form.password, 
      });

     

      // Send email for verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set status to pending for verification
      setVerification({
        ...verification,
        status: 'pending',
      });
    } catch (err: any) {
      console.log(err);
      Alert.alert('Error', err.errors[0]?.message || 'An unknown error occurred.');
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
  
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
  
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, status: 'success' });

        router.replace('/(boarding)/(tabs)/UserDataform'); // Navigate immediately to UserDataform
  
      } else {
        setVerification({ ...verification, status: 'failed', error: 'Verification Failed' });
      }
    } catch (err: any) {
      setVerification({ ...verification, status: 'failed', error: err.errors[0]?.longMessage });
      console.error(err);
    }
  };
  

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="w-full h-[250px]">
          <Image
            source={images.authImage}
            className="w-full h-full object-cover z-0"
          />
          <Text className="text-2xl font-JakartaSemiBold absolute bottom-5 left-5">Create Your Account</Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            icon={icons.person}
            placeholder="Enter your Name"
            value={form.name}
            onChangeText={(value) => { setForm({ ...form, name: value }); }}
          />

          <InputField
            label="Email"
            icon={icons.email}
            placeholder="Enter your Email"
            value={form.email}
            onChangeText={(value) => { setForm({ ...form, email: value }); }}
          />

          <InputField
            label="Password"
            icon={icons.lock}
            placeholder="Enter your password"
            value={form.password}
            secureTextEntry={true}
            onChangeText={(value) => { setForm({ ...form, password: value }); }}
          />

          <View className="flex justify-center w-full items-center">
            <CustomButton
              title="Sign Up"
              onPress={onSignUpPress}
              className="mt-6 w-11/12"
            />
            <OAuth />
            <Link
              href="/signin"
              className="mt-10 text-lg text-center text-general-200"
            >
              <Text>Already have an account? </Text>
              <Text className="text-primary-500 font-semibold">Sign In</Text>
            </Link>
          </View>
        </View>
      </View>

      

      {/* Verification Modal */}
      <Modal
        isVisible={verification.status === 'pending'}
        onModalHide={() => setVerification({ ...verification, status: 'success' })}
      >
        <View className="min-h-[300px] bg-white rounded-2xl p-8">
          <Text className="text-3xl font-JakartaBold">Verification</Text>
          <Text className="text-base font-Jakarta text-gray-400 mb-6">
            We've sent the verification code to {form.email}
          </Text>

          <InputField
            label="Code"
            value={verification.code}
            onChangeText={(code) => setVerification({ ...verification, code })}
            icon={icons.lock}
            keyboardType="numeric"
            placeholder="enter code here"
          />
          {verification.error && (
            <Text className="text-red-500 text-sm mt-1">{verification.error}</Text>
          )}
          <CustomButton
            title="Verify Email"
            bgVariant="success"
            onPress={onVerifyPress}
            className="mt-10"
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SignIn;
