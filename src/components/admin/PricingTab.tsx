// components/admin/PricingTab.tsx
import type { Barber, BarberAvailability, BarberService, BarberServicePricing, Service } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/admin.css';
import { PriceInput } from './PriceInput';
import { CalendarX } from 'lucide-react';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface PricingTabProps {
  services: Service[];
  barbers: Barber[];
  barberServices: BarberService[];
  pricing: BarberServicePricing[];
  availability: BarberAvailability[];
  onUpdate: () => void;
}

export function PricingTab({ services, barbers, barberServices, pricing, availability, onUpdate }: PricingTabProps) {
  const isScheduled = (barberId: string, dayOfWeek: number): boolean =>
    availability.some((a) => a.barber_id === barberId && a.day_of_week === dayOfWeek && a.is_available);

  const getPrice = (
    barberId: string,
    serviceId: string,
    timePeriod: 'regular' | 'evening',
    dayOfWeek: number,
  ): number => {
    const entry = pricing.find(
      (p) =>
        p.barber_id === barberId &&
        p.service_id === serviceId &&
        p.time_period === timePeriod &&
        p.day_of_week === dayOfWeek,
    );
    return entry?.price || 0;
  };

  const handlePriceUpdate = async (
    barberId: string,
    serviceId: string,
    timePeriod: 'regular' | 'evening',
    dayOfWeek: number,
    newPrice: number,
  ) => {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('barber_service_pricing')
        .select('id')
        .eq('barber_id', barberId)
        .eq('service_id', serviceId)
        .eq('time_period', timePeriod)
        .eq('day_of_week', dayOfWeek)
        .limit(1);

      if (fetchError) throw fetchError;

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('barber_service_pricing')
          .update({ price: newPrice })
          .eq('id', existing[0].id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('barber_service_pricing')
          .insert({ barber_id: barberId, service_id: serviceId, time_period: timePeriod, day_of_week: dayOfWeek, price: newPrice });
        if (error) throw error;
      }

      onUpdate();
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update price');
    }
  };

  return (
    <View>
      {services.map((service) => (
        <View key={service.id} className={styles.serviceSection}>
          <Text className={styles.serviceSectionTitle}>
            {service.name} ({service.duration_minutes} min)
          </Text>

          <View className={styles.dayPricingContainer}>
            {/* Day headers */}
            <View className={styles.dayPricingHeader}>
              <View className={styles.dayPricingBarberHeader}>Barber</View>
              {DAY_NAMES.map((day, index) => (
                <View key={index} className={styles.dayPricingDayHeader}>
                  <Text className={styles.dayPricingDayName}>{day}</Text>
                  <View className={styles.dayPricingPeriodLabels}>
                    <Text className={styles.dayPricingPeriodLabel}>Reg</Text>
                    <Text className={styles.dayPricingPeriodLabel}>Eve</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Barber rows — only show barbers assigned to this service */}
            {barbers.filter((barber) =>
              barberServices.some((bs) => bs.barber_id === barber.id && bs.service_id === service.id)
            ).map((barber) => (
              <View key={barber.id} className={styles.dayPricingRow}>
                <View className={styles.dayPricingBarberName}>{barber.name}</View>
                {DAY_NAMES.map((_, dayIndex) => (
                  <View key={dayIndex} className={styles.dayPricingCell}>
                    {isScheduled(barber.id, dayIndex) ? (
                      <View className={styles.dayPricingInputGroup}>
                        <PriceInput
                          initialValue={getPrice(barber.id, service.id, 'regular', dayIndex)}
                          onSave={(value) => handlePriceUpdate(barber.id, service.id, 'regular', dayIndex, value)}
                          className={styles.dayPriceInput}
                        />
                        <PriceInput
                          initialValue={getPrice(barber.id, service.id, 'evening', dayIndex)}
                          onSave={(value) => handlePriceUpdate(barber.id, service.id, 'evening', dayIndex, value)}
                          className={styles.dayPriceInput}
                        />
                      </View>
                    ) : (
                      <View className={styles.dayPricingInputGroup}>
                        <span className={styles.unscheduledDay}>
                          <CalendarX size={28} />
                        </span>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
