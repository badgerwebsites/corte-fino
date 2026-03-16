import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';

interface NavLogoCarouselProps {
  containerClassName: string;
  trackClassName: string;
  slideClassName: string;
  imageClassName: string;
}

export function NavLogoCarousel({
  containerClassName,
  trackClassName,
  slideClassName,
  imageClassName,
}: NavLogoCarouselProps) {
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<(string | null)[]>([null, null, null]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('nav_logo_1_url, nav_logo_2_url, nav_logo_3_url')
        .single();

      if (data) {
        const getValue = (val: string | null | undefined): string | null => {
          if (val === 'HIDDEN') return null;
          if (val && val.length > 0) return val;
          return null;
        };
        setCarouselLogos([
          getValue(data.nav_logo_1_url),
          getValue(data.nav_logo_2_url),
          getValue(data.nav_logo_3_url),
        ]);
      }
    };
    load();
  }, []);

  const activeLogos = carouselLogos.filter((logo): logo is string => logo !== null);

  useEffect(() => {
    if (activeLogos.length <= 1) return;
    const INTERVAL_MS = 3000;
    const updateIndex = () => {
      setLogoIndex(Math.floor(Date.now() / INTERVAL_MS) % activeLogos.length);
    };
    updateIndex();
    const interval = setInterval(updateIndex, 100);
    return () => clearInterval(interval);
  }, [activeLogos.length]);

  if (activeLogos.length === 0) return null;

  return (
    <View className={containerClassName}>
      <View
        className={trackClassName}
        style={{ transform: `translateX(-${logoIndex * 100}%)` }}
      >
        {activeLogos.map((src, index) => (
          <View key={index} className={slideClassName}>
            <img src={src} alt={`Logo ${index + 1}`} className={imageClassName} />
          </View>
        ))}
      </View>
    </View>
  );
}
