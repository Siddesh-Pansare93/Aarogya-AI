import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ButtonProps } from '@/types/types'


const getBgVariantStyle = (bgVariant: ButtonProps["bgVariant"]) => {
    switch (bgVariant) {
        case 'secondary':
            return 'bg-gray-500'
            
        case 'danger':
            return 'bg-red-500'
         

        case 'success':
            return 'bg-green-500'
            
        case 'outline' : 
        return 'bg-transparent border-neutral-300 border-[0.5px]'
        default:
            return 'bg-[#0286FF]' ; 
    }
}


const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
        return "text-gray-100";
      case "danger":
        return "text-red-100";
      case "success":
        return "text-green-100";
      default:
        return "text-white";
    }
  };

const CustomButton = ({
    title,
    onPress,
    IconLeft,
    IconRight,
    className,
    bgVariant = 'primary',
    textVariant = 'default',
    ...props
}: ButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress} 
            className={`${className} rounded-full flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 w-full p-3 border border-neutral-200 ${getBgVariantStyle(bgVariant)}`}
        >
            {IconLeft && <IconLeft />}
            <Text className='font-semibold'>{title}</Text>
            {IconRight && <IconRight />}
        </TouchableOpacity>
    )
}

export default CustomButton