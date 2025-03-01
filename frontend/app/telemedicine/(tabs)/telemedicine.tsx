import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Star, Calendar, Clock, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 124,
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
    available: true,
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    rating: 4.7,
    reviews: 98,
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop',
    available: true,
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.8,
    reviews: 156,
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop',
    available: false,
  },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

export default function TelemedicineScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };
  
  const handleConfirmBooking = () => {
    // In a real app, this would send the booking to an API
    setModalVisible(false);
    // Show confirmation or navigate to confirmation screen
  };
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      full: date.toISOString().split('T')[0],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Find a Doctor</Text>
        <Text style={styles.headerSubtitle}>Book a consultation with top specialists</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or specialty..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#3b5998" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Available Doctors</Text>
        
        {doctors.map((doctor, index) => (
          <Animated.View 
            key={doctor.id}
            entering={FadeInDown.delay(300 + index * 200).duration(600)}
            style={styles.doctorCard}
          >
            <View style={styles.doctorInfo}>
              <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
              
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFC107" fill="#FFC107" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                  <Text style={styles.reviewsText}>({doctor.reviews} reviews)</Text>
                </View>
                
                <Text style={styles.experienceText}>{doctor.experience} experience</Text>
              </View>
            </View>
            
            <View style={styles.doctorActions}>
              <View style={[
                styles.availabilityBadge, 
                doctor.available ? styles.availableBadge : styles.unavailableBadge
              ]}>
                <Text style={[
                  styles.availabilityText,
                  doctor.available ? styles.availableText : styles.unavailableText
                ]}>
                  {doctor.available ? 'Available Today' : 'Next Available: Tomorrow'}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[
                  styles.bookButton,
                  !doctor.available && styles.bookButtonDisabled
                ]}
                onPress={() => handleBookAppointment(doctor)}
                disabled={!doctor.available}
              >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Appointment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {selectedDoctor && (
              <View style={styles.selectedDoctorContainer}>
                <Image source={{ uri: selectedDoctor.image }} style={styles.selectedDoctorImage} />
                <View>
                  <Text style={styles.selectedDoctorName}>{selectedDoctor.name}</Text>
                  <Text style={styles.selectedDoctorSpecialty}>{selectedDoctor.specialty}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <Calendar size={20} color="#3b5998" />
                <Text style={styles.datePickerTitle}>Select Date</Text>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesContainer}
              >
                {dates.map((date) => (
                  <TouchableOpacity
                    key={date.full}
                    style={[
                      styles.dateItem,
                      selectedDate === date.full && styles.selectedDateItem
                    ]}
                    onPress={() => setSelectedDate(date.full)}
                  >
                    <Text style={[
                      styles.dateDay,
                      selectedDate === date.full && styles.selectedDateText
                    ]}>
                      {date.day}
                    </Text>
                    <Text style={[
                      styles.dateNumber,
                      selectedDate === date.full && styles.selectedDateText
                    ]}>
                      {date.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timePickerHeader}>
                <Clock size={20} color="#3b5998" />
                <Text style={styles.timePickerTitle}>Select Time</Text>
              </View>
              
              <View style={styles.timeSlotsContainer}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                (!selectedDate || !selectedTime) && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirmBooking}
              disabled={!selectedDate || !selectedTime}
            >
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 89, 152, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 15,
  },
  doctorCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  doctorDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 5,
    marginRight: 5,
  },
  reviewsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  experienceText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  doctorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  availableBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  unavailableBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  availabilityText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#F44336',
  },
  bookButton: {
    backgroundColor: '#3b5998',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  selectedDoctorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDoctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  selectedDoctorName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  selectedDoctorSpecialty: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 10,
  },
  datesContainer: {
    paddingVertical: 10,
  },
  dateItem: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
  },
  selectedDateItem: {
    backgroundColor: '#3b5998',
  },
  dateDay: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 5,
  },
  dateNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  selectedDateText: {
    color: 'white',
  },
  timePickerContainer: {
    marginBottom: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginLeft: 10,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    width: '30%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '3%',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  selectedTimeSlot: {
    backgroundColor: '#3b5998',
  },
  timeSlotText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  confirmButton: {
    backgroundColor: '#3b5998',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
});