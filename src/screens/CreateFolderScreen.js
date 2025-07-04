// screens/CreateFolderScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

const CreateFolderScreen = ({ route }) => {
    const navigation = useNavigation();
    const [folderName, setFolderName] = useState('');
    const { onFolderCreated } = route.params;

    const handleSaveFolder = async () => {
        if (!folderName.trim()) {
            Alert.alert('Error', 'Folder name cannot be empty.');
            return;
        }

        try {
            const storedFolders = await AsyncStorage.getItem('folders');
            let folders = storedFolders ? JSON.parse(storedFolders) : [];

            const newFolder = {
                id: Date.now().toString(),
                name: folderName.trim(),
                passwordCount: 0,
                passwords: [],
            };

            folders.push(newFolder);
            await AsyncStorage.setItem('folders', JSON.stringify(folders));
            Alert.alert('Success', `Folder "${folderName}" created!`);
            if (onFolderCreated) {
                onFolderCreated();
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving folder:', error);
            Alert.alert('Error', 'Failed to save folder. Please try again.');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.header}>Create New Folder</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Folder Name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={folderName}
                    onChangeText={setFolderName}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveFolder}>
                    <Text style={styles.saveButtonText}>Save Folder</Text>
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
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 30,
    },
    input: {
        width: '90%',
        backgroundColor: COLORS.inputBackground,
        color: COLORS.textPrimary,
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    saveButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateFolderScreen;
