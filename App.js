import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App() {
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
    // 로그인 로직
    alert(`ID: ${id}, Password: ${password}`);
  };

  const handleSignUp = () => {
    // 회원가입 로직
    alert('회원가입 페이지로 이동합니다.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/icon_small.png')} style={styles.logoImage} />
        <Text style={styles.logoText}>SNAPINFO</Text>
      </View>
      <Text style={styles.title}>SNAPINFO 회원이라면</Text>
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
      <Text style={styles.subTitle}>아직, SNAPINFO 회원이 아니시다면</Text>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 80, // 상단에 충분한 공간을 줍니다.
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  logoText: {
    fontFamily: 'PaytoneOne-Regular',
    fontSize: 20,
    color: '#28A745',
  },
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 20,
    alignSelf: 'flex-start', // 왼쪽 정렬
    marginBottom: 10,
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
    justifyContent: 'center', // 가운데 정렬
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
    fontSize: 16,
    alignSelf: 'flex-start', // 왼쪽 정렬
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
