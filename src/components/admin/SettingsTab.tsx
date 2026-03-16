import type { SiteSettings } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from './ImageUpload';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/admin.css';

type SiteSettingField =
  | 'hero_background_url'
  | 'hero_logo_url'
  | 'hero_logo_2_url'
  | 'hero_logo_3_url'
  | 'nav_logo_1_url'
  | 'nav_logo_2_url'
  | 'nav_logo_3_url'
  | 'rewards_enabled';

interface SettingsTabProps {
  siteSettings: SiteSettings | null;
  onUpdate: () => void;
}

export function SettingsTab({ siteSettings, onUpdate }: SettingsTabProps) {
  const handleSettingChange = async (field: SiteSettingField, value: string | boolean | null) => {
    try {
      if (siteSettings) {
        const { error } = await supabase.from('site_settings').update({ [field]: value }).eq('id', siteSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{ [field]: value }]);
        if (error) throw error;
      }
      onUpdate();
      if (field !== 'rewards_enabled') {
        const fieldName = field === 'hero_background_url' ? 'Hero background' : 'Hero logo';
        alert(`${fieldName} updated successfully!`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert('Failed to update setting');
    }
  };

  return (
    <View className={styles.section}>
      {/* Navigation Carousel Logos */}
      <View className={styles.formGroup}>
        <View className={styles.sectionHeader}>
          <Text className={styles.subsectionTitle}>Navigation Logos (Carousel)</Text>
        </View>
        <Text className={styles.sectionDescription}>
          These logos rotate in the navigation bar. Refresh the page after making changes to see
          updates in the navigation.
        </Text>

        <View className={styles.logoGrid}>
          <View className={styles.logoGridItem}>
            {siteSettings?.nav_logo_1_url !== 'HIDDEN' && (
              <ImageUpload
                currentImageUrl={
                  siteSettings?.nav_logo_1_url && siteSettings.nav_logo_1_url !== 'HIDDEN'
                    ? siteSettings.nav_logo_1_url
                    : undefined
                }
                onImageChange={(url) => handleSettingChange('nav_logo_1_url', url)}
                bucket="site-images"
                label="Nav Logo 1"
              />
            )}
          </View>

          <View className={styles.logoGridItem}>
            {siteSettings?.nav_logo_2_url !== 'HIDDEN' && (
              <ImageUpload
                currentImageUrl={
                  siteSettings?.nav_logo_2_url && siteSettings.nav_logo_2_url !== 'HIDDEN'
                    ? siteSettings.nav_logo_2_url
                    : undefined
                }
                onImageChange={(url) => handleSettingChange('nav_logo_2_url', url)}
                bucket="site-images"
                label="Nav Logo 2"
              />
            )}
          </View>

          <View className={styles.logoGridItem}>
            {siteSettings?.nav_logo_3_url !== 'HIDDEN' && (
              <ImageUpload
                currentImageUrl={
                  siteSettings?.nav_logo_3_url && siteSettings.nav_logo_3_url !== 'HIDDEN'
                    ? siteSettings.nav_logo_3_url
                    : undefined
                }
                onImageChange={(url) => handleSettingChange('nav_logo_3_url', url)}
                bucket="site-images"
                label="Nav Logo 3"
              />
            )}
          </View>
        </View>
      </View>

      {/* Hero Logos */}
      <View className={styles.formGroup}>
        <View className={styles.sectionHeader}>
          <Text className={styles.subsectionTitle}>Hero Logos (Carousel)</Text>
        </View>
        <Text className={styles.sectionDescription}>
          Add multiple logos to create a rotating carousel on the home page hero section. Upload at
          least 2 logos to enable the carousel.
        </Text>

        <View className={styles.logoGrid}>
          <View className={styles.logoGridItem}>
            <ImageUpload
              currentImageUrl={siteSettings?.hero_logo_url || undefined}
              onImageChange={(url) => handleSettingChange('hero_logo_url', url)}
              bucket="site-images"
              label="Hero Logo 1"
            />
          </View>
          <View className={styles.logoGridItem}>
            <ImageUpload
              currentImageUrl={siteSettings?.hero_logo_2_url || undefined}
              onImageChange={(url) => handleSettingChange('hero_logo_2_url', url)}
              bucket="site-images"
              label="Hero Logo 2"
            />
          </View>
          <View className={styles.logoGridItem}>
            <ImageUpload
              currentImageUrl={siteSettings?.hero_logo_3_url || undefined}
              onImageChange={(url) => handleSettingChange('hero_logo_3_url', url)}
              bucket="site-images"
              label="Hero Logo 3"
            />
          </View>
        </View>
      </View>

      {/* Hero Background */}
      <View className={styles.formGroup}>
        <View className={styles.sectionHeader}>
          <Text className={styles.subsectionTitle}>Hero Background</Text>
        </View>
        <Text className={styles.sectionDescription}>
          The background image that appears behind the logo on the home page.
        </Text>
        <View style={{ marginTop: '1rem' }}>
          <ImageUpload
            currentImageUrl={siteSettings?.hero_background_url || undefined}
            onImageChange={(url) => handleSettingChange('hero_background_url', url)}
            bucket="site-images"
            label="Hero Background"
          />
        </View>
      </View>
    </View>
  );
}
