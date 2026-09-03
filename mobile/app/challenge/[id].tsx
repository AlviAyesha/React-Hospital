import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function ChallengeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const codeSnippet = `
  function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      setInterval(() => {
        setCount(count + 1);
      }, 1000);
    }, []);

    return <Text>{count}</Text>;
  }
  `;

  const options = [
    { id: 1, text: "setInterval is not imported." },
    { id: 2, text: "Stale closure: count remains 0 inside the interval." },
    { id: 3, text: "useEffect needs count in its dependency array to work." },
  ];

  const handleSubmit = () => {
    if (selectedOption === 2) {
      alert(`Correct! Challenge ${id || ''} solved. +100 XP`);
      router.replace('/tabs');
    } else {
      alert("Incorrect. Think about what value 'count' has when the interval is created.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <Text className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2">Code Reading Challenge</Text>
        <Text className="text-white text-2xl font-bold mb-6">Find the Bug</Text>

        <View className="bg-[#1e1e1e] p-4 rounded-xl border border-[#27272a] mb-8">
          <Text className="font-mono text-green-400 text-sm leading-6">
            {codeSnippet}
          </Text>
        </View>

        <Text className="text-white font-bold mb-4 text-lg">What is wrong with this component?</Text>

        {options.map((opt) => (
          <TouchableOpacity 
            key={opt.id}
            className={`p-4 rounded-xl border mb-3 ${selectedOption === opt.id ? 'bg-primary/20 border-primary' : 'bg-surface border-[#27272a]'}`}
            onPress={() => setSelectedOption(opt.id)}
          >
            <Text className="text-white text-base">{opt.text}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          className={`p-4 rounded-xl items-center mt-6 ${selectedOption ? 'bg-primary' : 'bg-surface opacity-50'}`}
          disabled={!selectedOption}
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-lg">Submit Answer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
