import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#09090b] items-center justify-between py-12 px-6">
      <StatusBar style="light" />
      
      <View className="items-center mt-10">
        <View className="w-20 h-20 bg-primary/20 rounded-2xl items-center justify-center border border-primary/50 mb-6">
          <Text className="text-primary text-4xl font-bold">{"{ }"}</Text>
        </View>
        <Text className="text-white text-4xl font-bold tracking-tight text-center">
          React <Text className="text-primary">Hospital</Text>
        </Text>
        <Text className="text-muted text-center mt-4 text-lg px-4">
          Master React and Next.js through daily 5-minute debugging missions.
        </Text>
      </View>

      <View className="w-full space-y-4">
        <TouchableOpacity 
          className="bg-primary p-5 rounded-2xl items-center shadow-lg shadow-primary/20"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold text-lg">Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="p-4 items-center"
          onPress={() => router.push('/login')}
        >
          <Text className="text-muted font-medium">Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-muted/50 text-xs text-center">
        Built for developers by the RH Team
      </Text>
    </SafeAreaView>
  );
}
