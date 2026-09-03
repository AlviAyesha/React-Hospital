import { Tabs } from 'expo-router';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090b',
          borderTopColor: '#27272a',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#a1a1aa',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: 'AI Tutor',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
