// src/screens/OcrScreen.tsx
import React, {useEffect, useState} from 'react';
import {Text, ScrollView, StyleSheet, Button, Alert} from 'react-native';
import { TextRecognition } from 'react-native-google-ml-kit';
import * as RNFS from 'react-native-fs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OcrScreen'>;

function normalizeViText(s: string) {
  return s.normalize('NFC')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export default function OcrScreen({ route }: Props) {
  const { imagePath } = route.params;
  const [text, setText] = useState('Đang xử lý...');

  useEffect(() => {
    (async () => {
      try {
        const result = await TextRecognition.recognize(imagePath);
        setText(normalizeViText(result?.text ?? ''));
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
  mono: { fontFamily: 'monospace', fontSize: 15, lineHeight: 22 },
});
