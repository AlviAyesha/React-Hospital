import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

const mockFlashcards = [
  { id: 1, front: "What hook is used to perform side effects in functional components?", back: "useEffect" },
  { id: 2, front: "True or False: State updates in React are synchronous.", back: "False. They are asynchronous and batched." }
];

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const handleNext = () => {
    if (currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowBack(false);
    } else {
      alert(`Lesson ${id || ''} Complete! +50 XP`);
      router.replace('/tabs');
    }
  };

  const card = mockFlashcards[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-background justify-center p-6">
      <View className="mb-8">
        <Text className="text-white text-center text-sm font-bold tracking-widest text-muted uppercase">
          Card {currentIndex + 1} of {mockFlashcards.length}
        </Text>
      </View>

      <TouchableOpacity 
        className="bg-surface border border-primary/30 rounded-3xl p-8 min-h-[300px] justify-center items-center shadow-lg"
        onPress={() => setShowBack(!showBack)}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl text-center font-medium leading-relaxed">
          {showBack ? card.back : card.front}
        </Text>
        {!showBack && (
          <Text className="text-primary mt-8 font-bold">Tap to flip</Text>
        )}
      </TouchableOpacity>

      <View className="mt-12">
        <TouchableOpacity 
          className={`p-4 rounded-xl items-center ${showBack ? 'bg-primary' : 'bg-surface border border-[#27272a]'}`}
          onPress={showBack ? handleNext : () => setShowBack(true)}
        >
          <Text className={`font-bold text-lg ${showBack ? 'text-white' : 'text-muted'}`}>
            {showBack ? (currentIndex === mockFlashcards.length - 1 ? "Finish" : "Next") : "Show Answer"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
