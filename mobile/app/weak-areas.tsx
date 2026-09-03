import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WeakAreasScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-bold">← Back</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-3xl font-bold mb-6">Weak Areas</Text>
        
        <Text className="text-muted mb-6">
          Based on your recent bug fixes and challenges, here is where you should focus next:
        </Text>

        <View className="bg-surface p-5 rounded-xl border border-red-500/30 mb-4">
          <Text className="text-red-400 font-bold mb-1">State Management</Text>
          <Text className="text-white text-sm mb-3">You often miss dependencies in useEffect arrays.</Text>
          <TouchableOpacity className="bg-red-500/20 py-2 rounded items-center">
            <Text className="text-red-400 font-bold">Practice Now</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-surface p-5 rounded-xl border border-yellow-500/30 mb-4">
          <Text className="text-yellow-400 font-bold mb-1">Server Components</Text>
          <Text className="text-white text-sm mb-3">Confusion between when to use &apos;use client&apos;.</Text>
          <TouchableOpacity className="bg-yellow-500/20 py-2 rounded items-center">
            <Text className="text-yellow-400 font-bold">Read Lesson</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
