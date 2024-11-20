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
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

function CategoryRoute({ savedData, category }) {
  const filteredData =
    category === "전체" ? savedData : savedData.filter((item) => item.category === category);

  const placeholderData = [{ key: "placeholder1" }, { key: "placeholder2" }];
  const dataToRender =
    filteredData.length === 1 ? [...filteredData, ...placeholderData] : filteredData;

  return (
    <FlatList
      data={dataToRender}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) =>
        item.key ? (
          <View style={styles.cardPlaceholder} />
        ) : (
          <View style={styles.card}>
            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.cardImage} />}
            <View style={styles.cardHeader}>
              <Text style={styles.cardCategory}>{item.category}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        )
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>아직 아무런 정보도 저장되지 않았어요ㅠㅠ</Text>
        </View>
      }
    />
  );
}

export default function MainScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("운동");
  const [savedData, setSavedData] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = ["운동", "음식점", "쇼핑", "생활꿀팁", "공연,전시"];

  const handleSave = () => {
    if (!inputTitle.trim()) {
      Alert.alert("오류", "제목을 입력해주세요!");
      return;
    }

    setSavedData([
      ...savedData,
      { category: selectedCategory, title: inputTitle, text: inputText, imageUri: imageUri },
    ]);
    setInputTitle("");
    setInputText("");
    setImageUri(null);
    setModalVisible(false);
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 오류", "갤러리 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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
            <Text style={[styles.tabText, selectedCategory === item && styles.tabTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* 갤러리 */}
      <CategoryRoute savedData={savedData} category={selectedCategory} />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>사진 등록하기</Text>
      </TouchableOpacity>

      {/* 모달 */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* 제목 및 카테고리 */}
                <View style={styles.modalHeader}>
                  <TextInput
                    style={styles.modalTitleInput}
                    placeholder="제목을 입력하세요"
                    value={inputTitle}
                    onChangeText={setInputTitle}
                  />
                  <TouchableOpacity
                    style={styles.categoryDropdown}
                    onPress={() => setShowDropdown((prev) => !prev)}
                  >
                    <Text style={styles.categoryDropdownText}>{selectedCategory} ▼</Text>
                  </TouchableOpacity>
                </View>
                {showDropdown && (
                  <View style={styles.dropdownMenu}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setSelectedCategory(category);
                          setShowDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownMenuItemText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* 이미지 미리보기 */}
                <View style={styles.imagePreviewContainer}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.previewImageLarge} />
                  ) : (
                    <Text style={styles.noImageText}>사진이 선택되지 않았습니다</Text>
                  )}
                </View>

                {/* 하단 버튼 */}
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
                    <Text style={styles.galleryButtonText}>사진 선택하기</Text>
                  </TouchableOpacity>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.modalButtonSave} onPress={handleSave}>
                      <Text style={styles.modalButtonText}>정보 추출</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalButtonClose}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>닫기</Text>
                    </TouchableOpacity>
                  </View>
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
    justifyContent: "space-between",
    height: 50,
    paddingHorizontal: 10,
  },
  tabItem: {
    paddingVertical: 10,
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
  cardPlaceholder: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  cardHeader: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#28A745",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    marginBottom: 8,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  cardCategory: {
    fontSize: 15,
    margin:3,
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
    alignItems: "center",
    width: "100%",
  },
  modalTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  categoryDropdown: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryDropdownText: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: "bold",
    color: "#28A745",
  },
  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 0,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    zIndex: 100,
    padding: 10,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  dropdownMenuItemText: {
    fontSize: 16,
    color: "#333",
  },
  imagePreviewContainer: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  previewImageLarge: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "contain",
  },
  noImageText: {
    fontSize: 16,
    color: "#999",
  },
  modalButtonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  galleryButton: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  galleryButtonText: {
    color: "gray",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: "#28A745",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    height: 40,
  },
  modalButtonClose: {
    flex: 1,
    backgroundColor: "#6c757d",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
