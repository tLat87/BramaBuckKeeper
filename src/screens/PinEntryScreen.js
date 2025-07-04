// screens/PinEntryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const PinEntryScreen = () => { // Removed {navigation} from props, using useNavigation hook
    const navigation = useNavigation(); // Initialize navigation hook
    const [pin, setPin] = useState('');
    const [storedPin, setStoredPin] = useState(null);

    useEffect(() => {
        const checkPinExists = async () => {
            try {
                const userPin = await AsyncStorage.getItem('userPin');
                setStoredPin(userPin);
                if (!userPin) {
                    navigation.replace('PinSetup');
                }
            } catch (error) {
                console.error('Error checking PIN:', error);
                Alert.alert('Error', 'Failed to load data. Please try restarting the app.');
            }
        };
        checkPinExists();
    }, []);

    const handlePinSubmit = () => {
        if (pin === storedPin) {
            navigation.replace('Main');
        } else {
            Alert.alert('Error', 'Incorrect PIN. Please try again.');
            setPin('');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Forgot PIN?',
            'If you reset your PIN, all your saved folders and passwords will be deleted. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset PIN',
                    onPress: () => navigation.replace('PinSetup', { isReset: true }),
                    style: 'destructive'
                }
            ]
        );
    };

    if (storedPin === null) {
        return (
            <ImageBackground
                source={require('../assets/img/Passwordscreen.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.header}>Enter PIN</Text>

                <TextInput
                    style={styles.pinInput}
                    placeholder="****"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={pin}
                    onChangeText={setPin}
                    onSubmitEditing={handlePinSubmit}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handlePinSubmit}>
                    <Text style={styles.submitButtonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot PIN?</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: COLORS.textPrimary,
        fontSize: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 40,
        textAlign: 'center',
    },
    pinInput: {
        width: '60%',
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        padding: 15,
        borderRadius: 10,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 20,
    },
    submitButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        padding: 10,
    },
    forgotPasswordText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default PinEntryScreen;
