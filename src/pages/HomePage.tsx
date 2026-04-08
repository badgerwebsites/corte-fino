// pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Barber, SiteSettings } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/home/HeroSection';
import { BarbersSection } from '../components/home/BarbersSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { HomeFooter } from '../components/home/HomeFooter';

const DEFAULT_HERO_BACKGROUND = '/images/hero-background.webp';

export default function HomePage() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [heroBackground, setHeroBackground] = useState<string>(DEFAULT_HERO_BACKGROUND);
  const [isLoading, setIsLoading] = useState(true);
  const [heroLogoIndex, setHeroLogoIndex] = useState(0);
  const [heroCarouselLogos, setHeroCarouselLogos] = useState<(string | null)[]>([null, null, null]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: barbersData, error: barbersError } = await supabase
          .from('barbers').select('*').eq('is_active', true).order('name');
        if (barbersError) throw barbersError;
        setBarbers(barbersData ?? []);

        const { data: settingsData } = await supabase
          .from('site_settings').select('*').single();

        if (settingsData?.hero_background_url) {
          setHeroBackground(settingsData.hero_background_url);
        }

        setHeroCarouselLogos([
          settingsData?.hero_logo_url || null,
          settingsData?.hero_logo_2_url || null,
          settingsData?.hero_logo_3_url || null,
        ]);

        if (settingsData) setSiteSettings(settingsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const activeHeroLogos = heroCarouselLogos.filter((logo): logo is string => logo !== null);

  useEffect(() => {
    if (activeHeroLogos.length <= 1) return;
    const INTERVAL_MS = 3000;
    const updateIndex = () => {
      setHeroLogoIndex(Math.floor(Date.now() / INTERVAL_MS) % activeHeroLogos.length);
    };
    updateIndex();
    const interval = setInterval(updateIndex, 100);
    return () => clearInterval(interval);
  }, [activeHeroLogos.length]);

  return (
    <>
      <Navigation />
      <HeroSection
        heroBackground={heroBackground}
        isLoading={isLoading}
        activeHeroLogos={activeHeroLogos}
        heroLogoIndex={heroLogoIndex}
        onBook={() => navigate('/book')}
      />
      <BarbersSection
        barbers={barbers}
        merchImageUrl={siteSettings?.merch_image_url}
        merchVisible={siteSettings?.merch_visible ?? false}
      />
      <FeaturesSection />
      <HomeFooter />
    </>
  );
}
