import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, FlatList, TouchableWithoutFeedback } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { launchImageLibrary } from 'react-native-image-picker';

function CategoryRoute({ savedData, category }) {
  const filteredData = savedData.filter(item => item.category === category);
  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.listItemImage} /> : null}
          <Text style={styles.listItemText}>{item.text}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.contentContainer}>
          <Text style={styles.noDataText}>아직 아무런 정보도 저장되지 않았어요ㅠㅠ</Text>
          <Text style={styles.noDataText}>사진을 등록해주세요!</Text>
        </View>
      }
    />
  );
}

const Tab = createMaterialTopTabNavigator();

export default function MainScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('운동');
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [editableTitle, setEditableTitle] = useState('다이어트 방법');
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['운동', '음식점', '쇼핑', '생활꿀팁', '공연,전시'];

  const handleSave = () => {
    setSavedData([...savedData, { category: selectedCategory, text: inputText, imageUri: selectedImage?.uri }]);
    setInputText('');
    setSelectedImage(null);
    setEditableTitle('다이어트 방법');
    setIsEditing(false);
    setModalVisible(false);
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setDropdownVisible(false);
  };

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
          tabBarItemStyle: { width: 100, height: 50 },
          tabBarLabelStyle: { fontSize: 14, fontFamily: 'Pretendard-Bold' },
        }}
      >
        <Tab.Screen name="전체" component={() => <CategoryRoute savedData={savedData} category="전체" />} />
        <Tab.Screen name="운동" component={() => <CategoryRoute savedData={savedData} category="운동" />} />
        <Tab.Screen name="음식점" component={() => <CategoryRoute savedData={savedData} category="음식점" />} />
        <Tab.Screen name="쇼핑" component={() => <CategoryRoute savedData={savedData} category="쇼핑" />} />
        <Tab.Screen name="생활꿀팁" component={() => <CategoryRoute savedData={savedData} category="생활꿀팁" />} />
        <Tab.Screen name="공연,전시" component={() => <CategoryRoute savedData={savedData} category="공연,전시" />} />
      </Tab.Navigator>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>사진 등록하기</Text>
      </TouchableOpacity>

      {/* Modal for text input and image selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <View style={styles.modalTitleRow}>
                  {isEditing ? (
                    <TextInput
                      style={styles.modalTitleInput}
                      value={editableTitle}
                      onChangeText={setEditableTitle}
                      placeholder="제목을 입력하세요"
                    />
                  ) : (
                    <Text style={styles.modalTitle}>{editableTitle}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <Text style={styles.dropdownText}>{selectedCategory}</Text>
                    <Image
                      source={require('../assets/dropdown-arrow.png')}
                      style={styles.dropdownIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                {dropdownVisible && (
                  <View style={styles.dropdownList}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={styles.dropdownItem}
                        onPress={() => handleCategorySelect(category)}
                      >
                        <Text style={styles.dropdownItemText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {isEditing ? (
                  <TextInput
                    style={styles.modalInputMultiline}
                    placeholder="내용을 입력하세요"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline={true}
                  />
                ) : (
                  <Text style={styles.modalContentText}>{inputText}</Text>
                )}
                {selectedImage && (
                  <Image source={{ uri: selectedImage.uri }} style={styles.selectedImagePreview} />
                )}
                <TouchableOpacity style={styles.imageEditButton} onPress={handleImagePicker}>
                  <Text style={styles.imageEditButtonText}>사진 수정</Text>
                </TouchableOpacity>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButtonEdit} onPress={handleEditToggle}>
                    <Text style={styles.modalButtonText}>{isEditing ? "수정 완료" : "내용 수정"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButtonDelete}>
                    <Text style={styles.modalButtonText}>정보 삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
    marginRight: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    marginRight: 4,
  },
  dropdownIcon: {
    width: 12,
    height: 12,
  },
  dropdownList: {
    position: 'absolute',
    top: 40,
    right: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalInputMultiline: {
    width: '100%',
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  modalContentText: {
    width: '100%',
    height: 100,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  selectedImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  imageEditButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  imageEditButtonText: {
    color: '#007BFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonEdit: {
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  modalButtonDelete: {
    padding: 10,
    backgroundColor: '#FF4500',
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  listItemText: {
    fontSize: 16,
    flex: 1,
  },
});

