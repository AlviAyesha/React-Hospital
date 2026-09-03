import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login -> redirect to home
    router.replace('/tabs');
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-10">
        <Text className="text-primary text-3xl font-bold tracking-tighter">{"<"}RH_Mobile{"/>"}</Text>
        <Text className="text-muted mt-2 text-center">Your daily Next.js habit builder.</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-surface text-white p-4 rounded-lg border border-[#27272a]"
          placeholder="Email address"
          placeholderTextColor="#a1a1aa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-surface text-white p-4 rounded-lg border border-[#27272a]"
          placeholder="Password"
          placeholderTextColor="#a1a1aa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity 
          className="bg-primary p-4 rounded-lg mt-4 items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
