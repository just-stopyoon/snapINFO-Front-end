import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function AccountScreen() {
  const [allChecked, setAllChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState([false, false, false]);

  const toggleAllChecked = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setTermsChecked([newValue, newValue, newValue]);
  };

  const toggleIndividualChecked = (index) => {
    const newTermsChecked = [...termsChecked];
    newTermsChecked[index] = !newTermsChecked[index];
    setTermsChecked(newTermsChecked);
    setAllChecked(newTermsChecked.every(Boolean));
  };

  const renderCheckbox = (checked) => (
    <View style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SNAPINFO 이용을 위한{"\n"}약관에 동의해주세요</Text>

      <TouchableOpacity
        style={[styles.agreeAllButton, allChecked && styles.agreeAllButtonChecked]}
        onPress={toggleAllChecked}
      >
        <Text style={styles.agreeAllText}>모두 동의하기</Text>
      </TouchableOpacity>

      <View style={styles.termsContainer}>
        {['찰칵티비 이용 약관', '개인정보 수집 및 이용 동의', '암튼 동의하세요'].map((term, index) => (
          <TouchableOpacity
            key={index}
            style={styles.termRow}
            onPress={() => toggleIndividualChecked(index)}
          >
            <Text style={styles.termText}>{term}</Text>
            {renderCheckbox(termsChecked[index])}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>선택 접근 권한</Text>

      <View style={styles.permissionContainer}>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionIcon}>📷</Text>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              카메라 <Text style={styles.required}>(필수)</Text>
            </Text>
            <Text style={styles.permissionDescription}>앨범 속 사진에 접근하기 위해 필요해요</Text>
          </View>
        </View>
        <View style={styles.permissionRow}>
          <Text style={styles.permissionIcon}>🔔</Text>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              알림 <Text style={styles.required}>(필수)</Text>
            </Text>
            <Text style={styles.permissionDescription}>혹시 모를 푸시 알림을 위해 필요해요</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>다음</Text>
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
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontSize: 23,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginBottom: 23,
  },
  agreeAllButton: {
    backgroundColor: '#B8B8B8',
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  agreeAllButtonChecked: {
    backgroundColor: '#28A745',
  },
  agreeAllText: {
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    color: '#FFFFFF',
  },
  termsContainer: {
    marginBottom: 20,
  },
  termRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  termText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 17,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#28A745',
    borderColor: '#28A745',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 23,
    fontFamily: 'Pretendard-Bold',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionContainer: {
    marginBottom: 20,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  permissionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  permissionTextContainer: {
    flex: 1,
    marginVertical: 5
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    fontWeight: 'bold',
  },
  required: {
    color: '#28A745',
    fontSize: 14,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#808080',
    paddingVertical: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
    marginBottom: 10,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
