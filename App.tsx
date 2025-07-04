import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FolderScreen from "./src/screens/FolderScreen";
import PasswordGeneratorScreen from "./src/screens/PasswordGeneratorScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CreateFolderScreen from "./src/screens/CreateFolderScreen";
import {COLORS} from "./src/constants";
import FolderContent from "./src/screens/FolderContent";
import PinSetupScreen from "./src/screens/PinSetupScreen";
import PinEntryScreen from "./src/screens/PinEntryScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ }) => {
                    let iconSource;

                    if (route.name === 'Folders') {
                        iconSource = require('./src/assets/img/FolderWithFiles.png')
                    } else if (route.name === 'Generate') {
                        iconSource = require('./src/assets/img/LockPassword.png')
                    } else if (route.name === 'Settings') {
                        iconSource = require('./src/assets/img/Frame.png')
                    }

                    return <Image source={iconSource} style={styles.tabIcon} />;
                },
                tabBarActiveTintColor: COLORS.buttonRed,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarStyle: {
                    backgroundColor:'rgba(159,28,32,0.6)',
                    position: 'absolute',
                    bottom: 30,
                    paddingTop: 20,
                    width: '80%',
                    marginLeft: '10%',
                    borderTopWidth: 0,
                    borderRadius: 30,
                },
                headerShown: false,
                tabBarLabel: ''
            })}
        >
            <Tab.Screen name="Folders" component={FolderScreen} />
            <Tab.Screen name="Generate" component={PasswordGeneratorScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const App = () => {
    const [initialRoute, setInitialRoute] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkPinStatus = async () => {
            try {
                const userPin = await AsyncStorage.getItem('userPin');
                if (userPin) {
                    setInitialRoute('PinEntry'); // If PIN exists, go to PIN entry screen
                } else {
                    setInitialRoute('PinSetup'); // If no PIN, go to PIN setup screen
                }
            } catch (error) {
                console.error('Ошибка при проверке статуса PIN:', error);
                setInitialRoute('PinSetup'); // Fallback in case of error
            } finally {
                setIsLoading(false);
            }
        };

        checkPinStatus();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.buttonRed} />
                <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="PinSetup" component={PinSetupScreen} />
                <Stack.Screen name="PinEntry" component={PinEntryScreen} />

                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="CreateFolder" component={CreateFolderScreen} />
                <Stack.Screen name="FolderContent" component={FolderContent} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabIcon: {
        width: 24,
        height: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.darkBackground, // Or your desired background color
    },
    loadingText: {
        marginTop: 10,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
});

export default App;
