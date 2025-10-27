import React, { useState } from 'react';
import {
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ScanScreen'>;

export default function ScanScreen() {
  const nav = useNavigation<Nav>();
  const [image, setImage] = useState<string | null>(null);

  const scan = async () => {
    try {
      const res = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
        croppedImageQuality: 100,
        responseType: 'imageFilePath', // 👈 dùng string thay vì ResponseType.ImageFilePath
        letUserAdjustCrop: true,
        noGrayScale: false,
        useBase64: false,
      });

      if (res?.scannedImages?.length) setImage(res.scannedImages[0]);
      else Alert.alert('Không có ảnh nào được quét');
    } catch (e: any) {
      Alert.alert('Lỗi scan', e?.message ?? String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Scan tài liệu</Text>
      <Button title="Quét tài liệu" onPress={scan} />
      {image && (
        <>
          <Image source={{ uri: `file://${image}` }} style={styles.preview} />
          <Button
            title="Nhận diện văn bản (OCR)"
            onPress={() => nav.navigate('OcrScreen', { imagePath: image })}
          />
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  preview: {
    width: '100%',
    height: 360,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});
