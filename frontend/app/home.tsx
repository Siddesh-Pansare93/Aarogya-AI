import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, Stethoscope, Hospital, Bell, Apple } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeatureCard = ({ title, description, icon, colors, onPress }: any) => {
  return (
    <Animated.View style={styles.cardContainer} entering={FadeInDown.delay(300).duration(600)}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ flex: 1 }}>
        <LinearGradient colors={colors} style={styles.card}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const [greeting, setGreeting] = useState('Good morning');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>Siddesh,</Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#3b5998" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: 'https://avatars.githubusercontent.com/u/155179612?v=4' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>How can we help you today?</Text>
        
        <View style={styles.featuresContainer}>
          <FeatureCard
            title="Nutritional Coach"
            description="Get Personalized Nutrition Plans and Daily Diet Tracking"
            icon={<Apple size={30} color="white" />}
            colors={['#a8e063', '#56ab2f']}
            onPress={() => router.push('/(root)/(tabs)/neutrientScanHome')}
          />
          <FeatureCard
            title="Symptom Checker"
            description="Check symptoms & get AI diagnosis"
            icon={<Activity size={30} color="white" />}
            colors={['#FF5F6D', '#FFC371']}
            onPress={() => router.push('/symptoms_analysis/(tabs)/symptomsChecker')}
          />
          <FeatureCard
            title="Telemedicine"
            description="Book doctor consultations online"
            icon={<Stethoscope size={30} color="white" />}
            colors={['#2193b0', '#6dd5ed']}
            onPress={() => router.push('/telemedicine/(tabs)/telemedicine')}
          />
          <FeatureCard
            title="Hospital Tracking"
            description="Find available hospital beds in real-time"
            icon={<Hospital size={30} color="white" />}
            colors={['#834d9b', '#d04ed6']}
            // onPress={() => router.push('/(root)/(tabs)/hospital-beds')}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.recentActivityCard}>
          <Text style={styles.recentActivityTitle}>No recent activity</Text>
          <Text style={styles.recentActivityDescription}>
            Your recent health checks and consultations will appear here
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 89, 152, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: 150,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  recentActivityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  recentActivityTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 5,
  },
  recentActivityDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
});
