
import { GoogleGenAI, Modality } from "@google/genai";

// ملاحظة للمطور: يتم جلب المفتاح من بيئة التشغيل (Environment Variables) لضمان الأمان.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * محادثة ذكية مع دعم البحث المباشر من جوجل
 */
export const chatWithGemini = async (message: string, history: any[] = []) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // استخدام نسخة Pro لدعم البحث المتقدم
    contents: {
      role: 'user',
      parts: [{ text: message }]
    },
    config: {
      systemInstruction: "أنت المساعد الرسمي لمنصة Bgbest. وظيفتك مساعدة المستخدمين في العثور على الأفلام والمسلسلات، وتقديم توصيات، والإجابة عن أخبار الفن. استخدم البحث من جوجل دائماً لتقديم معلومات دقيقة عن مواعيد العرض.",
      tools: [{ googleSearch: {} }] // تفعيل ميزة البحث من جوجل
    }
  });

  // استخراج روابط المصادر إذا وجدت
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  let text = response.text || "";
  
  if (sources.length > 0) {
    text += "\n\n**المصادر:**\n";
    sources.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        text += `- [${chunk.web.title || 'رابط المصدر'}](${chunk.web.uri})\n`;
      }
    });
  }

  return text;
};

/**
 * تحليل الصور (مثل بوسترات الأفلام)
 */
export const analyzeImage = async (base64Data: string, prompt: string) => {
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };
  const textPart = {
    text: prompt || "ماذا يوجد في هذه الصورة؟ هل هو ممثل مشهور؟"
  };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, textPart] },
  });
  
  return response.text || '';
};

/**
 * تحويل النص إلى صوت (نظام التنبيهات الصوتية)
 */
export const generateSpeech = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}
