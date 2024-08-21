import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function FirstRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>아직 아무런 정보도 저장되지 않았어요ㅠㅠ</Text>
      <Text style={styles.noDataText}>사진을 등록해주세요!</Text>
    </View>
  );
}

function SecondRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>운동 관련 정보를 여기에 표시하세요.</Text>
    </View>
  );
}

function ThirdRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>음식점 관련 정보를 여기에 표시하세요.</Text>
    </View>
  );
}

function FourthRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>쇼핑 관련 정보를 여기에 표시하세요.</Text>
    </View>
  );
}

function FifthRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>생활꿀팁 관련 정보를 여기에 표시하세요.</Text>
    </View>
  );
}

function SixthRoute() {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.noDataText}>공연, 전시 관련 정보를 여기에 표시하세요.</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function MainScreen() {
  return (
    <View style={styles.container}>
      {/* 상단 검색바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력해주세요"
          placeholderTextColor="#999"
        />
        <Image
          source={require('../assets/search-normal.png')}
          style={styles.searchIcon}
        />
      </View>

      {/* 탭 네비게이션 */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#28A745',
          tabBarInactiveTintColor: '#666',
          tabBarIndicatorStyle: { backgroundColor: '#28A745' },
          tabBarStyle: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
          tabBarScrollEnabled: true,
          tabBarItemStyle: { width: 80, height:50, },
          tabBarLabelStyle: { fontSize: 14, fontFamily: 'Pretendard-Bold',}, // 탭 글씨 크기 조정
        }}
      >
        <Tab.Screen name="전체" component={FirstRoute} />
        <Tab.Screen name="운동" component={SecondRoute} />
        <Tab.Screen name="음식점" component={ThirdRoute} />
        <Tab.Screen name="쇼핑" component={FourthRoute} />
        <Tab.Screen name="생활꿀팁" component={FifthRoute} />
        <Tab.Screen name="공연,전시" component={SixthRoute} />
      </Tab.Navigator>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>사진 등록하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  addButton: {
    height: 50,
    backgroundColor: '#28A745',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginHorizontal: 16,
  },
  addButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
