import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function AITutorChat() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="p-4 border-b border-[#27272a]">
        <Text className="text-white text-xl font-bold">CTO Mentor</Text>
        <Text className="text-green-400 text-xs">● Online</Text>
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ justifyContent: 'flex-end', flexGrow: 1 }}>
        <View className="bg-surface self-start p-3 rounded-lg rounded-tl-none border border-[#27272a] mb-4 max-w-[80%]">
          <Text className="text-white text-base">Hey. Got a question about React or Next.js while you&apos;re on the go? Ask away.</Text>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-[#27272a] flex-row items-center space-x-2">
        <TextInput 
          className="flex-1 bg-surface text-white p-3 rounded-full border border-[#27272a]"
          placeholder="Ask a question..."
          placeholderTextColor="#a1a1aa"
        />
        <TouchableOpacity className="bg-primary p-3 rounded-full">
          <Text className="text-white font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
