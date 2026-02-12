export interface Customer {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  stripe_customer_id?: string;
  reward_points: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Barber {
  id: string;
  name: string;
  bio?: string;
  phone?: string;
  instagram_handle?: string;
  facebook_url?: string;
  tiktok_handle?: string;
  image_url?: string;
  base_price_multiplier: number;
  is_active: boolean;
  regular_hours_start: string;
  regular_hours_end: string;
  evening_hours_start: string;
  evening_hours_end: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  duration_minutes: number;
  reward_points: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  price_multiplier: number;
  days_of_week: number[];
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type RecurrencePattern =
  | 'weekly'
  | 'biweekly'
  | 'every_3_weeks'
  | 'monthly'
  | 'every_5_weeks'
  | 'every_6_weeks';

export const RECURRENCE_DAYS: Record<RecurrencePattern, number> = {
  'weekly': 7,
  'biweekly': 14,
  'every_3_weeks': 21,
  'monthly': 28,
  'every_5_weeks': 35,
  'every_6_weeks': 42,
};

export const RECURRENCE_LABELS: Record<RecurrencePattern, string> = {
  'weekly': 'Weekly',
  'biweekly': 'Bi-weekly',
  'every_3_weeks': 'Every 3 weeks',
  'monthly': 'Monthly',
  'every_5_weeks': 'Every 5 weeks',
  'every_6_weeks': 'Every 6 weeks',
};

export interface Booking {
  id: string;
  customer_id?: string;
  barber_id?: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: BookingStatus;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  cancellation_fee_charged: boolean;
  cancellation_reason?: string;
  cancelled_at?: string;
  reminder_sent: boolean;
  review_request_sent: boolean;
  // Guest booking fields
  guest_first_name?: string;
  guest_last_name?: string;
  guest_phone?: string;
  is_guest: boolean;
  // Recurring booking fields
  recurrence_group_id?: string;
  recurrence_pattern?: RecurrencePattern;
  recurrence_index?: number;
  created_by_admin?: boolean;
  created_at: string;
  updated_at: string;
}

export type RewardType = 'product' | 'service' | 'merchandise';

export interface Reward {
  id: string;
  name: string;
  description?: string;
  points_required: number;
  reward_type: RewardType;
  item_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RewardRedemption {
  id: string;
  customer_id: string;
  reward_id: string;
  points_spent: number;
  redeemed_at: string;
  fulfilled: boolean;
  redemption_code: string;
  fulfilled_at?: string;
}

export interface RewardRedemptionWithDetails extends RewardRedemption {
  customer?: Customer;
  reward?: Reward;
}

export interface ShopSettings {
  id: string;
  business_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  google_maps_url?: string;
  cancellation_hours: number;
  cancellation_fee_percentage: number;
  regular_hours_start: string;
  regular_hours_end: string;
  evening_hours_start: string;
  evening_hours_end: string;
  last_rotation_barber_id?: string;
  created_at: string;
  updated_at: string;
}

// Extended types with joined data
export interface BookingWithDetails extends Booking {
  customer?: Customer;
  barber?: Barber;
  service?: Service;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  barberId?: string;
}

export type TimePeriod = 'regular' | 'evening';

export interface BarberServicePricing {
  id: string;
  barber_id: string;
  service_id: string;
  time_period: TimePeriod;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface BarberAvailability {
  id: string;
  barber_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface BarberTimeOff {
  id: string;
  barber_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  hero_background_url?: string;
  hero_logo_url?: string;
  hero_logo_2_url?: string;
  hero_logo_3_url?: string;
  nav_logo_1_url?: string;
  nav_logo_2_url?: string;
  nav_logo_3_url?: string;
  rewards_enabled?: boolean;
  created_at: string;
  updated_at: string;
}
