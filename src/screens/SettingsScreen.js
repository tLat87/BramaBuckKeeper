// screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ImageBackground, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const handleSecurityTips = () => {
        Alert.alert(
            'Security Tips',
            '1. Use long and complex passwords.\n' +
            '2. Do not reuse passwords across different services.\n' +
            '3. Change passwords regularly.\n' +
            '4. Use two-factor authentication where possible.\n' +
            '5. Beware of phishing attacks.'
        );
    };

    const handleResetAllData = () => {
        Alert.alert(
            'Reset All Data?',
            'Are you sure you want to delete all folders and passwords? This action is irreversible.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('folders');
                            await AsyncStorage.removeItem('userPin');
                            Alert.alert('Success', 'All data successfully deleted.');
                            navigation.replace('PinSetup');
                        } catch (error) {
                            console.error('Error resetting data:', error);
                            Alert.alert('Error', 'Failed to reset all data.');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const handlePrivacyPolicy = () => {
        const privacyPolicyURL = 'https://www.yourwebsite.com/privacy-policy'; // Replace with your Privacy Policy URL
        Linking.openURL(privacyPolicyURL).catch(err =>
            Alert.alert('Error', 'Failed to open privacy policy.')
        );
    };

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.header}>Settings</Text>

                <TouchableOpacity style={styles.settingItem} onPress={handleSecurityTips}>
                    <Text style={styles.settingText}>Security Tips</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handleResetAllData}>
                    <Text style={styles.settingText}>Reset All Data</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={handlePrivacyPolicy}>
                    <Text style={styles.settingText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 30,
        textAlign: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    settingText: {
        color: COLORS.textPrimary,
        fontSize: 18,
    },
});

export default SettingsScreen;
