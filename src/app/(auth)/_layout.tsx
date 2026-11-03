import { Stack } from 'expo-router';

export const unstable_settings = {
    anchor: 'welcome',
};

export default function AuthLayout(){
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="welcome"/>
            <Stack.Screen name="login"/>
            <Stack.Screen name="register"/>
            <Stack.Screen name="olvide-contrasenia"/>
            <Stack.Screen name="verificar-codigo"/>
            <Stack.Screen name="nueva-contrasenia"/>
        </Stack>
    );
}