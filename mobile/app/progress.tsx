import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProgressScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-primary font-bold">← Back</Text>
        </TouchableOpacity>
        
        <Text className="text-white text-3xl font-bold mb-6">Your Progress</Text>
        
        <View className="bg-surface p-6 rounded-xl border border-[#27272a] mb-4">
          <Text className="text-muted text-center mb-2">Current Streak</Text>
          <Text className="text-orange-400 text-5xl font-bold text-center">3 Days 🔥</Text>
        </View>

        <View className="bg-surface p-6 rounded-xl border border-[#27272a] mb-4">
          <Text className="text-muted text-center mb-2">Total XP</Text>
          <Text className="text-primary text-4xl font-bold text-center">1,450 XP</Text>
        </View>

        <Text className="text-white text-xl font-bold mb-4 mt-4">Recent Achievements</Text>
        <View className="bg-[#1e1e1e] p-4 rounded-xl border border-[#27272a] mb-2 flex-row items-center">
          <Text className="text-2xl mr-3">🐛</Text>
          <View>
            <Text className="text-white font-bold">Bug Squasher</Text>
            <Text className="text-muted text-sm">Fixed 10 bugs</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
