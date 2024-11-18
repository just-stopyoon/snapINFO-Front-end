import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './src/Main'; // Main 화면 import
import AccountScreen from './src/Account'; // Account1 화면 import

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const loadFonts = async () => {
    await Font.loadAsync({
      'Pretendard-Regular': require('./assets/font/Pretendard-Regular.ttf'),
      'Pretendard-Bold': require('./assets/font/Pretendard-Bold.ttf'),
      'PaytoneOne-Regular': require('./assets/font/PaytoneOne-Regular.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleLogin = () => {
    navigation.navigate('Main');
  };

  const handleSignUp = () => {
    navigation.navigate('Account'); // Account 스크린으로 네비게이트
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/logo_icon.png')} style={styles.logoImage} />
        <Text style={styles.logoText}>SNAPINFO</Text>
      </View>
      <Text style={styles.title}>회원이라면</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={id}
        onChangeText={setId}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.findOptions}>
        <Text style={styles.findText}>아이디 찾기</Text>
        <Text style={styles.findText}> | </Text>
        <Text style={styles.findText}>비밀번호 찾기</Text>
      </View>
      <Text style={styles.subTitle}>아직, 회원이 아니라면</Text>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
        />
        <Stack.Screen 
          name="Account" 
          component={AccountScreen} // Account1 컴포넌트를 Account 스크린으로 등록
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoImage: {
    width: 30,
    height: 38,
    marginRight: 5,
  },
  logoText: {
    fontFamily: 'PaytoneOne-Regular',
    fontSize: 25,
    color: '#28A745',
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 23,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 13,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontFamily: 'Pretendard-Regular',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#28A745',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    fontFamily: 'Pretendard-Bold',
    color: '#fff',
    fontSize: 18,
  },
  findOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  findText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#7a7a7a',
  },
  subTitle: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 23,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#7a7a7a',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontFamily: 'Pretendard-Bold',
    color: '#fff',
    fontSize: 18,
  },
});
