import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Swiper from 'react-native-swiper'
import { images, onboarding  } from '@/constants'
import CustomButton from '@/components/customButton'
import { ImageBackground } from 'react-native'



const welcome = () => {
    const swiperRef = useRef<Swiper>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const isLastScreen = activeIndex === onboarding.length - 1
    console.log(isLastScreen)

    
    return (
        
            <ImageBackground
                source={images.welcomebg} // Use your image here
                style={{ 
                    flex: 1
                 }} // Ensure the background covers the full screen
             >
        <SafeAreaView className={`flex h-full items-center justify-between pb-10  bg-[${images.welcomebg}]`}>

            <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                className='w-full flex justify-end items-end p-5'
            >
                <Text className='text-black text-md font-JakartaBold p-5'>Skip {'>'} </Text>
            </TouchableOpacity >


            <Swiper
                ref={swiperRef}
                loop={false}
                dot={
                    <View className='w-[32px] h-[4px] mx-1 bg-[#E2e8f0] rounded-full' />
                }
                activeDot={
                    <View className='w-[32px] h-[4px] mx-1 bg-[#689adb] rounded-full' />
                }
                onIndexChanged={(index) => setActiveIndex(index)}

            >
                {onboarding.map((item) => (
                    <View key={item.id} className='flex flex-col items-center justify-start h-full w
                -full  '>
                        <Text className='text-4xl  text-black mx-10 text-center font-JakartaExtraBold'>{item.title}</Text>
                        <View>
                            <Text className='text-xl font-JakartaBold text-gray-700 mx-10 my-10 text-center'>{item.description}</Text>
                        </View>
                        <Image
                            source={item.image}
                            className='w-full h-[300px]'
                            resizeMode='contain'
                        />
                    </View>
                ))}
            </Swiper>

            <CustomButton 
            title={isLastScreen ? "Get Started" : "Next"} 
            onPress={() => isLastScreen ? router.push("/(auth)/signup") : swiperRef.current?.scrollBy(1)}
            className='w-1/2 bg-general-300'
            
            />
            <Text className='text-black'>{isLastScreen}</Text>

        </SafeAreaView >
        </ImageBackground>
    )
}

export default welcome