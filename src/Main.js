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
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = ["운동", "음식점", "쇼핑", "생활꿀팁", "공연,전시"];

  const handleSave = () => {
    if (!inputTitle.trim() || !inputText.trim()) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요!");
      return;
    }

    setSavedData([
      ...savedData,
      { category: selectedCategory, title: inputTitle, text: inputText, imageUri: null },
    ]);
    setInputTitle("");
    setInputText("");
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
    backgroundColor: "#fff",
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
    marginTop: 3,
    marginRight: -5,
    fontSize: 15,
    color: "#28A745",
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
    position: "relative",
  },
  modalTitleInput: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 300,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
