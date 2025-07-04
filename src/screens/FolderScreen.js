// screens/FolderScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../constants';

const FolderScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const route = useRoute();
    const [folders, setFolders] = useState([]);
    const [incomingPassword, setIncomingPassword] = useState(null);

    useEffect(() => {
        if (isFocused) {
            loadFolders();
            if (route.params?.generatedPassword) {
                setIncomingPassword(route.params.generatedPassword);
                navigation.setParams({ generatedPassword: undefined });
            }
        }
    }, [isFocused, route.params?.generatedPassword]);

    const loadFolders = async () => {
        try {
            const storedFolders = await AsyncStorage.getItem('folders');
            if (storedFolders) {
                setFolders(JSON.parse(storedFolders));
            } else {
                setFolders([]);
            }
        } catch (error) {
            console.error('Error loading folders:', error);
        }
    };

    const handleCreateFolder = () => {
        navigation.navigate('CreateFolder', { onFolderCreated: loadFolders });
    };

    const handleFolderPress = (folder) => {
        if (incomingPassword) {
            Alert.alert(
                'Save Password',
                `Save "${incomingPassword}" to folder "${folder.name}"?`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => setIncomingPassword(null) },
                    {
                        text: 'Save',
                        onPress: () => savePasswordToFolder(folder.id, incomingPassword),
                    },
                ]
            );
        } else {
            navigation.navigate('FolderContent', { folder: folder, onPasswordUpdated: loadFolders });
        }
    };

    const savePasswordToFolder = async (folderId, passwordValue) => {
        try {
            const storedFolders = await AsyncStorage.getItem('folders');
            let folders = storedFolders ? JSON.parse(storedFolders) : [];

            const folderIndex = folders.findIndex(f => f.id === folderId);

            if (folderIndex !== -1) {
                const newPassword = {
                    id: Date.now().toString(),
                    name: 'Generated Password',
                    value: passwordValue,
                };
                folders[folderIndex].passwords.push(newPassword);
                folders[folderIndex].passwordCount = folders[folderIndex].passwords.length;

                await AsyncStorage.setItem('folders', JSON.stringify(folders));
                Alert.alert('Success', `Password saved to "${folders[folderIndex].name}".`);
                setIncomingPassword(null);
                loadFolders();
            } else {
                Alert.alert('Error', 'Folder not found.');
            }
        } catch (error) {
            console.error('Error saving password to folder:', error);
            Alert.alert('Error', 'Failed to save password. Please try again.');
        }
    };

    const renderNoFoldersYet = () => (
        <View style={styles.noFoldersContainer}>
            <ImageBackground source={require('../assets/img/357b7c591a1528cbffeeeb8bc3d4f72f844ab536.png')} style={styles.deerImage} resizeMode="contain">
            </ImageBackground>
            <Text style={styles.noFoldersText}>No Folders Yet</Text>
            <Text style={styles.noFoldersSubText}>Organize your passwords by creating folders. Keep your accounts sorted and easy to find.</Text>
            <TouchableOpacity style={styles.createFirstFolderButton} onPress={handleCreateFolder}>
                <Text style={styles.createFirstFolderButtonText}>Create First Folder</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFolderItem = ({ item }) => (
        <TouchableOpacity style={styles.folderItem} onPress={() => handleFolderPress(item)}>
            <Image source={require('../assets/img/FolderWithFiles.png')} style={styles.folderIconImage} />
            <Text style={styles.folderName}>{item.name} ({item.passwordCount || 0})</Text>
            {/*<TouchableOpacity style={styles.editIconContainer} onPress={() => console.log('Edit folder', item.id)}>*/}
            {/*    <Image source={require('../assets/img/LockPassword.png')} style={styles.editIconImage} />*/}
            {/*</TouchableOpacity>*/}
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../assets/img/Passwordscreen.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.header}>My Folders</Text>
                {incomingPassword && (
                    <View style={styles.savePromptContainer}>
                        <Text style={styles.savePromptText}>
                            Select a folder to save the password:
                        </Text>
                        <Text style={styles.generatedPasswordPreview}>{incomingPassword}</Text>
                        <TouchableOpacity onPress={() => setIncomingPassword(null)} style={styles.cancelSaveButton}>
                            <Text style={styles.cancelSaveButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {folders.length === 0 ? (
                    renderNoFoldersYet()
                ) : (
                    <>
                        <FlatList
                            data={folders}
                            renderItem={renderFolderItem}
                            keyExtractor={item => item.id}
                            contentContainerStyle={styles.folderList}
                        />
                        <TouchableOpacity style={styles.addFolderButton} onPress={handleCreateFolder}>
                            <Image source={require('../assets/img/Frame.png')} style={styles.addFolderIconImage} />
                            <Text style={styles.addFolderButtonText}>Add Folder</Text>
                        </TouchableOpacity>
                    </>
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
        paddingTop: 60,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    savePromptContainer: {
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    savePromptText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'center',
    },
    generatedPasswordPreview: {
        color: COLORS.buttonYellow,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    cancelSaveButton: {
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    cancelSaveButtonText: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    noFoldersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    deerImage: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        resizeMode: 'contain',
    },
    noFoldersText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    noFoldersSubText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    createFirstFolderButton: {
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    createFirstFolderButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    folderList: {
        paddingBottom: 80,
    },
    folderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    folderIconImage: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    folderName: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 18,
    },
    editIconContainer: {
        padding: 5,
    },
    editIconImage: {
        width: 20,
        height: 20,
    },
    addFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.buttonRed,
        paddingVertical: 15,
        borderRadius: 10,
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
    },
    addFolderIconImage: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    addFolderButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default FolderScreen;
