import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function MainScreen() {
  const [modalVisible, setModalVisible] = useState(false); // 사진 등록 모달 상태
  const [detailModalVisible, setDetailModalVisible] = useState(false); // 상세 정보 모달 상태
  const [inputTitle, setInputTitle] = useState(""); // 제목 입력 상태
  const [selectedCategory, setSelectedCategory] = useState("운동"); // 선택된 카테고리
  const [savedData, setSavedData] = useState([]); // 저장된 데이터
  const [selectedItem, setSelectedItem] = useState(null); // 상세 모달에서 클릭된 데이터
  const [imageUri, setImageUri] = useState(null); // 선택된 이미지 경로
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // 카테고리 드롭다운 상태

  const categories = ["운동", "음식점", "쇼핑", "생활꿀팁", "공연,전시"];

  // 정보 추출 버튼 클릭 시 동작
  const handleExtract = async () => {
    if (!inputTitle.trim()) {
      Alert.alert("오류", "제목을 입력해주세요!");
      return;
    }
  
    if (!imageUri) {
      Alert.alert("오류", "사진을 선택해주세요!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "uploaded_image.jpg",
    });
  
    try {
      const response = await axios.post(
<<<<<<< HEAD
        "http://3.104.223.7:5000/model",
=======
        "http://54.252.214.233:5000/model",
>>>>>>> 5f0372a666ef82d1e9eb09bba7c45a15bffde6bb
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const extractedText = response.data.text; // 백엔드에서 반환된 텍스트
      const newItem = {
        category: selectedCategory,
        title: inputTitle,
        imageUri: imageUri,
        extractedText: extractedText, // 추출된 텍스트 저장
      };
  
      setSavedData([...savedData, newItem]); // 저장된 데이터 업데이트
      setSelectedItem(newItem); // 상세 모달에 표시할 데이터 설정
      setDetailModalVisible(true); // 상세 모달 열기
      setModalVisible(false);
      setInputTitle("");
      setImageUri(null);
    } catch (error) {
      console.error(error);
      Alert.alert("오류", "텍스트 추출 중 문제가 발생했습니다.");
    }
  };  

  // 갤러리에서 이미지 선택
  // 갤러리에서 이미지 선택 및 크롭
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 오류", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // 드래그 가능한 크롭 활성화
      aspect: [1, 1], // 1:1 비율로 고정 (필요에 따라 변경 가능)
      quality: 1, // 이미지 품질
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // 선택된 이미지 경로 저장
    }
  };


  // 데이터 삭제
  const handleDelete = () => {
    if (selectedItem) {
      setSavedData(savedData.filter((item) => item !== selectedItem));
      setSelectedItem(null);
      setDetailModalVisible(false); // 상세 모달 닫기
    }
  };

  // 필터링된 데이터
  const filteredData =
    selectedCategory === "전체"
      ? savedData
      : savedData.filter((item) => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* 검색 바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력해주세요"
          placeholderTextColor="#999"
        />
      </View>

      {/* 카테고리 네비게이션 */}
      <FlatList
        data={["전체", ...categories]}
        horizontal
        keyExtractor={(item) => item}
        contentContainerStyle={styles.tabContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === item && styles.tabTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 갤러리 */}
      <FlatList
        data={
          filteredData.length % 2 === 0
            ? filteredData
            : [...filteredData, { isPlaceholder: true }]
        }
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.galleryContainer}
        renderItem={({ item }) =>
          item.isPlaceholder ? (
            <View style={styles.cardPlaceholder} />
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedItem(item);
                setDetailModalVisible(true);
              }}
            >
              {item.imageUri && (
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
              )}
              <View style={styles.cardHeader}>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.noDataText}>'사진 등록하기' 버튼을 통해 정보를 추가하세요.</Text>
          </View>
        }
      />

      {/* 사진 등록 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>사진 등록하기</Text>
      </TouchableOpacity>

      {/* 추가 모달 */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* 제목 입력란과 카테고리 선택 */}
              <View style={styles.modalHeader}>
                <TextInput
                  style={styles.modalTitleInput}
                  placeholder="제목을 입력하세요"
                  value={inputTitle}
                  onChangeText={setInputTitle}
                />
                <View style={styles.categoryDropdownContainer}>
                  <TouchableOpacity
                    style={styles.selectedCategoryContainer}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Text style={styles.selectedCategoryText}>{selectedCategory} ▼</Text>
                  </TouchableOpacity>
                  {showCategoryDropdown && (
                    <View style={styles.categoryDropdown}>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            styles.categoryOption,
                            selectedCategory === category && styles.activeCategory,
                          ]}
                          onPress={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.categoryOptionText,
                              selectedCategory === category && styles.activeCategoryText,
                            ]}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* 이미지 선택 */}
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.previewImageLarge} />
              ) : (
                <Text style={styles.noImageText}>사진이 선택되지 않았습니다</Text>
              )}
              <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
                <Text style={styles.galleryButtonText}>사진 선택하기</Text>
              </TouchableOpacity>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={styles.modalButtonSave} onPress={handleExtract}>
                  <Text style={styles.modalButtonText}>정보 추출</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonClose}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

     {/* 상세 모달 */}
      <Modal
        transparent
        visible={detailModalVisible}
        animationType="fade"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customModalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>

            {selectedItem && (
              <>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: selectedItem.imageUri }}
                    style={styles.modalImage}
                  />
                  <Text style={styles.dateText}>2024.09.02</Text>
                </View>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <View style={styles.textContent}>
                  <Text style={styles.modalText}>{selectedItem.extractedText}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>추가 작업</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 5, // 필터와 갤러리 간 간격
    backgroundColor: "#fff",
  },
  tabItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  tabTextActive: {
    color: "#28A745",
    fontWeight: "bold",
  },
  galleryContainer: {
    paddingHorizontal: 10, // 좌우 여백
    marginTop: 10, // 카테고리 필터 바로 아래에 갤러리 배치
    alignItems: "stretch",
    justifyContent: "flex-start",
    height: 550,
  },
  addButton: {
    height: 60,
    backgroundColor: "#28A745",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 30,
    marginBottom: 50,
  },
  addButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    borderRadius: 10,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "lightgray",
    backgroundColor: "#fff",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10,
    marginBottom: 8,
  },
  cardHeader: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#28A745",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  cardPlaceholder: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  cardCategory: {
    fontSize: 15,
    margin: 3,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  modalTitle:{
    fontSize:20,
    fontWeight: "bold",
    marginBottom:10,
  },
  modalTitleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  previewImageLarge: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: "#28A745",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    height: 40,
  },
  modalButtonClose: {
    flex: 1,
    backgroundColor: "#6c757d",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    height: 40,
  },
  modalButtonFix: { //상세 모달
    flex: 1,
    backgroundColor: "#28A745",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    //marginRight: 3,
    height: 40,
  },
  modalButtonDelete: { //상세 모달
    flex: 1,
    backgroundColor: "#FF6F00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    height: 40,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noImageText: {
    fontSize: 16,
    color: "#999",
    marginVertical: 50,
  },
  galleryButton: {
    marginBottom: 5,
    padding: 10,
    borderRadius: 8,
  },
  galleryButtonText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "bold",
  },
  categoryDropdown: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryDropdownText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  dropdownMenu: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    color: "lightgray",
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 5,
    levation: 5,
    marginVertical: 3,
  },
  dropdownMenuItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  dropdownMenuItemText: {
    fontSize: 13,
    color: "gray",
  },
  categoryContainer: {
    marginVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  selectedCategoryContainer: {
    backgroundColor: "#E6F4EA",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  categoryDropdown: {
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 50,
    zIndex: 1000,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 80,
    padding: 10,
  },
  categoryOption: {
    paddingVertical: 10,
    alignItems: "center",
  },
  categoryOptionText: {
    fontSize: 13,
    color: "#333",
  },
  activeCategory: {
    backgroundColor: "#28A745",
    borderRadius: 10,
  },
  activeCategoryText: {
    color: "#FFF",
  },
  extractedText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  extractedText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
    textAlign: "left",
    paddingHorizontal: 10,
    lineHeight: 24, // 가독성을 위한 줄 간격
  },
  textContainer: {
    marginTop: 10,
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  customModalContainer: {
    width: "90%",
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#FFF",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  dateText: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#FFF",
    fontSize: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalTitle: {
    fontSize: 22,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 10,
  },
  textContent: {
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: "100%",
  },
  modalText: {
    fontSize: 16,
    color: "#EAEAEA",
    lineHeight: 24,
    textAlign: "left",
  },
  actionButton: {
    backgroundColor: "#FF6F61",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },  
});