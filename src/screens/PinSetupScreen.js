// screens/PinSetupScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const PinSetupScreen = ({ route }) => {
    const navigation = useNavigation();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const isReset = route.params?.isReset || false;

    const handleSetPin = async () => {
        if (pin.length !== 4 || confirmPin.length !== 4) {
            Alert.alert('Error', 'PIN must be 4 digits long.');
            return;
        }
        if (pin !== confirmPin) {
            Alert.alert('Error', 'PINs do not match.');
            return;
        }

        try {
            await AsyncStorage.setItem('userPin', pin);

            if (isReset) {
                await AsyncStorage.removeItem('folders');
                Alert.alert('Success', 'New PIN set. All data has been cleared.');
            } else {
                Alert.alert('Success', 'PIN successfully set!');
            }
            navigation.replace('Main');
        } catch (error) {
            console.error('Error setting PIN:', error);
            Alert.alert('Error', 'Failed to set PIN. Please try again.');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.header}>{isReset ? 'Reset PIN' : 'Create PIN'}</Text>

                <View style={styles.pinInputContainer}>
                    <TextInput
                        style={styles.pinInput}
                        placeholder="Enter PIN"
                        placeholderTextColor={COLORS.textSecondary}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        value={pin}
                        onChangeText={setPin}
                    />
                    <TextInput
                        style={styles.pinInput}
                        placeholder="Confirm PIN"
                        placeholderTextColor={COLORS.textSecondary}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                    />
                </View>

                <TouchableOpacity style={styles.setPinButton} onPress={handleSetPin}>
                    <Text style={styles.setPinButtonText}>{isReset ? 'Reset and Create' : 'Set PIN'}</Text>
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
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 40,
        textAlign: 'center',
    },
    pinInputContainer: {
        width: '90%',
        marginBottom: 30,
        alignItems: 'center',
    },
    pinInput: {
        width: '100%',
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
    },
    setPinButton: {
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    setPinButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PinSetupScreen;
