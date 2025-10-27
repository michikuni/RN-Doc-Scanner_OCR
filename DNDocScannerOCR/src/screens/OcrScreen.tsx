// src/screens/OcrScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Button, Alert} from 'react-native';
import { TextRecognition } from 'react-native-google-ml-kit';
import * as RNFS from 'react-native-fs';

type Props = { route: { params: { imagePath: string } } };

function normalizeViText(s: string) {
  // Gộp dòng, chuẩn hóa Unicode, fix khoảng trắng thừa
  return s
    .normalize('NFC')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export default function OcrScreen({ route }: Props) {
  const { imagePath } = route.params;
  const [text, setText] = useState<string>('Đang xử lý...');

  useEffect(() => {
    (async () => {
      try {
        // ML Kit hoạt động trực tiếp trên file path
        const result = await TextRecognition.recognize(imagePath, {
          // v2 auto detect Latin; không cần chỉ định ngôn ngữ, nhưng bạn có thể thêm tùy chọn khi lib hỗ trợ
        });

        // result.blocks[].lines[].elements[] … bạn có thể custom gộp theo layout
        const joined = result?.text ?? '';
        setText(normalizeViText(joined));
      } catch (e: any) {
        Alert.alert('Lỗi OCR', e?.message ?? String(e));
        setText('');
      }
    })();
  }, [imagePath]);

  const saveTxt = async () => {
    try {
      const p = `${RNFS.DocumentDirectoryPath}/scan_${Date.now()}.txt`;
      await RNFS.writeFile(p, text, 'utf8');
      Alert.alert('Đã lưu', `File: ${p}`);
    } catch (e: any) {
      Alert.alert('Lỗi lưu file', e?.message ?? String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kết quả OCR</Text>
      <Text style={styles.mono}>{text}</Text>
      <Button title="Lưu .txt" onPress={saveTxt} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  mono: { fontFamily: 'monospace', fontSize: 15, lineHeight: 22 }
});
