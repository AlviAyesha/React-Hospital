import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-2xl font-bold">🩺 Dr. Dev — Ward Shift</Text>
            <Text className="text-muted mt-1">300 / 1000 Medical XP</Text>
          </View>
          <View className="bg-surface px-4 py-2 rounded-full border border-orange-500/30">
            <Text className="text-orange-400 font-bold">🔥 3 Day Streak</Text>
          </View>
        </View>

        {/* Dr. React Daily Tip Card */}
        <View className="bg-surface p-4 rounded-xl border border-primary/30 mb-6 space-y-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg">👨‍⚕️</Text>
            <Text className="text-primary font-bold">Dr. React Daily Diagnostic Tip</Text>
          </View>
          <Text className="text-white text-xs leading-relaxed">
            &quot;Hydration errors occur when the initial server HTML differs from the client render. Use a mounted \`isClient\` state to synchronize!&quot;
          </Text>
        </View>

        <Text className="text-white text-lg font-bold mb-4">Today&apos;s Micro Missions</Text>

        <TouchableOpacity 
          className="bg-surface p-5 rounded-xl border border-primary/40 mb-4"
          onPress={() => router.push('/lesson/id')}
        >
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-primary font-bold mb-1">Micro Lesson</Text>
              <Text className="text-white text-lg font-bold">React State Master</Text>
            </View>
            <Text className="text-muted">+50 XP</Text>
          </View>
          <Text className="text-muted mt-2">Review 5 core rules about useState, functional updates, and re-renders.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-surface p-5 rounded-xl border border-[#27272a] mb-4"
          onPress={() => router.push('/challenge/id')}
        >
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-purple-400 font-bold mb-1">Diagnosis Drill</Text>
              <Text className="text-white text-lg font-bold">Find the Infinite Loop</Text>
            </View>
            <Text className="text-muted">+100 XP</Text>
          </View>
          <Text className="text-muted mt-2">Can you spot why this useEffect component crashes the browser?</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
