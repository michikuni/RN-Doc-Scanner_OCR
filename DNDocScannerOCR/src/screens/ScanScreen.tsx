import React, {useState} from 'react';
import {View, Text, Button, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin';
import { useNavigation } from '@react-navigation/native';

export default function ScanScreen() {
  const nav = useNavigation<any>();
  const [image, setImage] = useState<string | null>(null);

  const scan = async () => {
    try {
      const res = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
        croppedImageQuality: 100,
        responseType: ResponseType.ImageFilePath,
        letUserAdjustCrop: true,      // cho phép chỉnh thủ công sau auto-detect
        noGrayScale: false,           // bật enhance
        useBase64: false,
      });

      if (res?.scannedImages?.length) {
        const path = res.scannedImages[0];
        setImage(path);
      } else {
        Alert.alert('Không có ảnh nào được quét');
      }
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
          <Image source={{uri: `file://${image}`}} style={styles.preview}/>
          <Button title="Nhận diện văn bản (OCR)" onPress={() => nav.navigate('OcrScreen', { imagePath: image })}/>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  preview: { width: '100%', height: 360, resizeMode: 'contain', borderRadius: 8 }
});
