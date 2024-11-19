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

function CategoryRoute({ savedData, category }) {
  const filteredData =
    category === "전체" ? savedData : savedData.filter((item) => item.category === category);

  return (
    <FlatList
      data={filteredData}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={[styles.card, { backgroundColor: getCategoryColor(item.category) }]}>
          {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.cardImage} />}
          <Text style={styles.cardTitle}>{item.text}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.noDataText}>아직 아무런 정보도 저장되지 않았어요ㅠㅠ</Text>
        </View>
      }
    />
  );
}

const getCategoryColor = (category) => {
  switch (category) {
    case "운동":
      return "#E3F2FD";
    case "음식점":
      return "#FFF3E0";
    case "쇼핑":
      return "#E8F5E9";
    case "생활꿀팁":
      return "#F3E5F5";
    case "공연,전시":
      return "#FFEBEE";
    default:
      return "#FFFFFF";
  }
};

export default function MainScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("운동");
  const [savedData, setSavedData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = ["운동", "음식점", "쇼핑", "생활꿀팁", "공연,전시"];

  const handleSave = () => {
    if (!inputText.trim()) {
      Alert.alert("오류", "내용을 입력해주세요!");
      return;
    }

    setSavedData([
      ...savedData,
      { category: selectedCategory, text: inputText, imageUri: null },
    ]);
    setInputText("");
    setSelectedCategory("운동");
    setModalVisible(false);
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

      {/* 탭 네비게이션 */}
      <FlatList
        data={["전체", ...categories]}
        horizontal
        keyExtractor={(item) => item}
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
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>새로운 정보 추가</Text>
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
                <TextInput
                  style={styles.modalInput}
                  placeholder="내용을 입력하세요"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButtonSave} onPress={handleSave}>
                    <Text style={styles.modalButtonText}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonClose}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>닫기</Text>
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
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    height: 50,
    backgroundColor: "#28A745",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    marginBottom: 32,
  },
  addButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
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
    position: "relative",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  categoryDropdown: {
    padding: 10,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
  },
  categoryDropdownText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  dropdownMenuItem: {
    padding: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: "#333",
  },
  modalInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 50,
    marginTop: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  card: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: "#fff",
  },
  cardImage: {
    width: "100%",
    height: "70%",
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardCategory: {
    fontSize: 14,
    color: "#666",
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
});
