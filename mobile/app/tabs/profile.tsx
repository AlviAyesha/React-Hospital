import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [plan] = useState<'free' | 'pro'>('free');

  const handleUpgradeWeb = () => {
    Linking.openURL('http://localhost:3000/pricing').catch(() => {
      alert('Open http://localhost:3000/pricing in your web browser to manage subscriptions.');
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <View className="items-center mb-8 mt-4">
          <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border-2 border-primary mb-4">
            <Text className="text-4xl">👨‍💻</Text>
          </View>
          <Text className="text-white text-2xl font-bold">Dev_Student</Text>
          <Text className="text-muted">React Novice</Text>
          <View className="mt-2 bg-surface px-3 py-1 rounded-full border border-[#27272a]">
            <Text className="text-xs text-primary font-bold uppercase">
              {plan === 'pro' ? '⭐ Pro Plan' : 'Free Starter'}
            </Text>
          </View>
        </View>

        {plan === 'free' && (
          <TouchableOpacity 
            className="bg-primary/20 border border-primary p-4 rounded-xl items-center mb-6"
            onPress={handleUpgradeWeb}
          >
            <Text className="text-primary font-bold text-base">⚡ Upgrade to Pro on Web</Text>
            <Text className="text-muted text-xs mt-1">Unlock all bug cases & unlimited AI mentor</Text>
          </TouchableOpacity>
        )}

        <Text className="text-white font-bold mb-4">Your Journey</Text>

        <TouchableOpacity 
          className="bg-surface p-4 rounded-xl border border-[#27272a] flex-row justify-between items-center mb-3"
          onPress={() => router.push('/progress')}
        >
          <Text className="text-white text-base">📈 XP & Progress</Text>
          <Text className="text-muted">{">"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-surface p-4 rounded-xl border border-[#27272a] flex-row justify-between items-center mb-8"
          onPress={() => router.push('/weak-areas')}
        >
          <Text className="text-white text-base">🎯 Weak Areas</Text>
          <Text className="text-muted">{">"}</Text>
        </TouchableOpacity>

        <Text className="text-white font-bold mb-4">Settings</Text>

        <TouchableOpacity className="bg-surface p-4 rounded-xl border border-[#27272a] flex-row justify-between items-center mb-3">
          <Text className="text-white text-base">⚙️ App Settings</Text>
          <Text className="text-muted">{">"}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-4 rounded-xl items-center mt-4"
          onPress={() => router.replace('/login')}
        >
          <Text className="text-red-400 font-bold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
