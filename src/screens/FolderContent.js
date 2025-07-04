// screens/FolderContentScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Image, Alert, Clipboard } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants';

const FolderContentScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    const { folder, onPasswordUpdated } = route.params;
    const [currentFolder, setCurrentFolder] = useState(folder);

    useEffect(() => {
        if (isFocused) {
            loadFolderPasswords();
        }
    }, [isFocused, currentFolder.id]); // Added currentFolder.id to dependency array for robustness

    const loadFolderPasswords = async () => {
        try {
            const storedFolders = await AsyncStorage.getItem('folders');
            if (storedFolders) {
                const folders = JSON.parse(storedFolders);
                const updatedFolder = folders.find(f => f.id === currentFolder.id);
                if (updatedFolder) {
                    setCurrentFolder(updatedFolder);
                }
            }
        } catch (error) {
            console.error('Error loading folder passwords:', error);
        }
    };

    const handleAddPassword = () => {
        Alert.alert(
            'Add Password',
            'This will be functionality to add a new password to this folder. For example, navigating to the generator screen with an option to save to the current folder.'
        );
        // Example: navigation.navigate('PasswordGenerator', { folderId: currentFolder.id, onPasswordAdded: loadFolderPasswords });
    };

    const copyPassword = (password) => {
        Clipboard.setString(password);
        Alert.alert('Copied', 'Password copied to clipboard!');
    };

    const handleDeletePassword = async (passwordToDelete) => {
        Alert.alert(
            'Delete Password',
            `Are you sure you want to delete the password "${passwordToDelete.name || 'unnamed'}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const storedFolders = await AsyncStorage.getItem('folders');
                            let folders = storedFolders ? JSON.parse(storedFolders) : [];

                            const folderIndex = folders.findIndex(f => f.id === currentFolder.id);
                            if (folderIndex !== -1) {
                                folders[folderIndex].passwords = folders[folderIndex].passwords.filter(
                                    p => p.id !== passwordToDelete.id
                                );
                                folders[folderIndex].passwordCount = folders[folderIndex].passwords.length;
                                await AsyncStorage.setItem('folders', JSON.stringify(folders));
                                setCurrentFolder(folders[folderIndex]);
                                if (onPasswordUpdated) {
                                    onPasswordUpdated();
                                }
                                Alert.alert('Success', 'Password deleted.');
                            }
                        } catch (error) {
                            console.error('Error deleting password:', error);
                            Alert.alert('Error', 'Failed to delete password.');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const renderPasswordItem = ({ item }) => (
        <View style={styles.passwordItem}>
            <View style={styles.passwordInfo}>
                <Text style={styles.passwordName}>{item.name || 'Unnamed'}</Text>
                <Text style={styles.passwordValue}>{item.value}</Text>
            </View>
            <TouchableOpacity onPress={() => copyPassword(item.value)} style={styles.passwordActionButton}>
                <Image source={require('../assets/img/Copy.png')} style={styles.passwordActionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePassword(item)} style={styles.passwordActionButton}>
                <Text style={{color:'red', fontWeight: 'bold'}}>
                    Delete
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{color:'#fff', fontWeight: 'bold'}}>
                        Go Back
                    </Text>
                </TouchableOpacity>
                <Text style={styles.header}>{currentFolder.name}</Text>
            </View>

            <View style={styles.container}>
                {currentFolder.passwords && currentFolder.passwords.length > 0 ? (
                    <FlatList
                        data={currentFolder.passwords}
                        renderItem={renderPasswordItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.passwordList}
                    />
                ) : (
                    <View style={styles.noPasswordsContainer}>
                        <Text style={styles.noPasswordsText}>No Passwords Yet</Text>
                        <Text style={styles.noPasswordsSubText}>Add new passwords to this folder to keep them organized.</Text>
                    </View>
                )}

                {/*<TouchableOpacity style={styles.addPasswordButton} onPress={handleAddPassword}>*/}
                {/* <Image source={require('../assets/img/Frame.png')} style={styles.addPasswordIconImage} />*/}
                {/* <Text style={styles.addPasswordButtonText}>Add Password</Text>*/}
                {/*</TouchableOpacity>*/}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    backIconImage: {
        width: 24,
        height: 24,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    noPasswordsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noPasswordsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    noPasswordsSubText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    passwordList: {
        paddingBottom: 80,
    },
    passwordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    passwordInfo: {
        flex: 1,
    },
    passwordName: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    passwordValue: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    passwordActionButton: {
        padding: 8,
        marginLeft: 10,
    },
    passwordActionIcon: {
        width: 20,
        height: 20,
    },
    addPasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    addPasswordIconImage: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    addPasswordButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FolderContentScreen;
