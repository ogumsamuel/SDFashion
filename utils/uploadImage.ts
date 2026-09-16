import { supabase } from '../constants/supabase';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

// ── Basic image upload utility ────────────────────────────────────────────────
// This function takes a locally picked image and uploads it to the
// 'product-images' bucket in Supabase, returning the public URL.

export async function pickAndUploadImage(): Promise<string | null> {
  // 1. Ask the user to pick an image from their phone
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    base64: true,        // we need base64 to upload
    quality: 0.7,         // compress slightly to keep file size reasonable
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  if (!asset.base64) return null;

  // 2. Create a unique file name so uploads never overwrite each other
  const fileExt = asset.uri.split('.').pop() ?? 'jpg';
  const fileName = `product-${Date.now()}.${fileExt}`;

  // 3. Upload to Supabase Storage
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, decode(asset.base64), {
      contentType: `image/${fileExt}`,
    });

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  // 4. Get the permanent public URL for the uploaded file
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}