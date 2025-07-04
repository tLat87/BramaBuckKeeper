// screens/PasswordGeneratorScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Clipboard, Alert, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants';

const PasswordGeneratorScreen = () => {
    const navigation = useNavigation();
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const generatePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        const passwordLength = 16; // Customizable length
        let password = '';

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        setGeneratedPassword(password);
        setCopiedToClipboard(false);
    };

    const copyToClipboard = () => {
        Clipboard.setString(generatedPassword);
        setCopiedToClipboard(true);
    };

    const handleSaveToFolder = () => {
        if (!generatedPassword) {
            Alert.alert('Error', 'Please generate a password first.');
            return;
        }
        navigation.navigate('Folders', {
            generatedPassword: generatedPassword,
        });
    };

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.dropdownPlaceholder}>
                    <Text style={styles.dropdownText}>Password Settings</Text>
                    {/*<Image source={require('../assets/icons/chevron_down_icon.png')} style={styles.dropdownIcon} />*/}
                </View>

                <Text style={styles.header}>Password Generator</Text>

                <View style={styles.passwordInputContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={generatedPassword}
                        placeholder="Generated password"
                        placeholderTextColor={COLORS.textSecondary}
                        editable={false}
                    />
                    <TouchableOpacity onPress={copyToClipboard} style={styles.copyIcon}>
                        {/*<Image source={require('../assets/icons/copy_icon.png')} style={styles.copyIconImage} />*/}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
                    <Text style={styles.buttonText}>Generate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveToFolder}>
                    <Text style={styles.buttonText}>Save to Folder</Text>
                </TouchableOpacity>

                {copiedToClipboard && (
                    <View style={styles.copiedMessageContainer}>
                        <Text style={styles.copiedMessageText}>Copied to clipboard!</Text>
                    </View>
                )}
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
    },
    dropdownPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
    },
    dropdownText: {
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    dropdownIcon: {
        width: 24,
        height: 24,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 30,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        width: '90%',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 30,
    },
    passwordInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 18,
        paddingVertical: 15,
    },
    copyIcon: {
        padding: 10,
    },
    copyIconImage: {
        width: 24,
        height: 24,
    },
    generateButton: {
        backgroundColor: COLORS.buttonYellow,
        width: '90%',
        paddingVertical: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: COLORS.buttonRed,
        width: '90%',
        paddingVertical: 18,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    copiedMessageContainer: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    copiedMessageText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PasswordGeneratorScreen;
