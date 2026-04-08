// components/admin/ServicesTab.tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Barber, Service } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from './ImageUpload';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/admin.css';

const DEFAULT_SERVICE_FORM = {
  name: '',
  description: '',
  duration_minutes: 45,
  reward_points: 10,
  image_url: '',
};

interface BarberServiceLink {
  barber_id: string;
  service_id: string;
}

interface ServicesTabProps {
  services: Service[];
  barbers: Barber[];
  barberServices: BarberServiceLink[];
  onUpdate: () => void;
  onScrollToTop: () => void;
  onScrollToSection: (el: HTMLElement | null) => void;
}

export function ServicesTab({ services, barbers: allBarbers, barberServices, onUpdate, onScrollToTop, onScrollToSection }: ServicesTabProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE_FORM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBarberIds, setSelectedBarberIds] = useState<string[]>([]);

  useEffect(() => {
    if (editingService) {
      const timer = setTimeout(() => onScrollToSection(formRef.current), 150);
      return () => clearTimeout(timer);
    }
  }, [editingService]);

  useEffect(() => {
    if (editingService) {
      supabase
        .from('barber_services')
        .select('barber_id')
        .eq('service_id', editingService.id)
        .then(({ data }) => setSelectedBarberIds((data || []).map((r) => r.barber_id)));
    }
  }, [editingService]);

  const toggleBarber = (barberId: string) => {
    setSelectedBarberIds((prev) =>
      prev.includes(barberId) ? prev.filter((id) => id !== barberId) : [...prev, barberId]
    );
  };

  const handleCancel = () => {
    setEditingService(null);
    setServiceForm(DEFAULT_SERVICE_FORM);
    setSelectedBarberIds([]);
    onScrollToTop();
  };

  const handleEdit = (service: Service) => {
    setShowAddForm(false);
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || '',
      duration_minutes: service.duration_minutes,
      reward_points: service.reward_points,
      image_url: service.image_url || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let serviceId: string;

      if (editingService) {
        const { error } = await supabase.from('services').update(serviceForm).eq('id', editingService.id);
        if (error) throw error;
        serviceId = editingService.id;
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([{ ...serviceForm, base_price: 0 }])
          .select('id')
          .single();
        if (error) throw error;
        serviceId = data.id;
      }

      // Sync barber assignments
      await supabase.from('barber_services').delete().eq('service_id', serviceId);
      if (selectedBarberIds.length > 0) {
        const { error: linkError } = await supabase.from('barber_services').insert(
          selectedBarberIds.map((barber_id) => ({ barber_id, service_id: serviceId }))
        );
        if (linkError) throw linkError;
      }

      setServiceForm(DEFAULT_SERVICE_FORM);
      setSelectedBarberIds([]);
      setEditingService(null);
      setShowAddForm(false);
      onScrollToTop();
      onUpdate();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This will also delete all pricing for this service. This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      // alert('Service deleted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  return (
    <View className={styles.section}>
      <div className={styles.adminSplitLayout}>
        {/* Current services list */}
        <div className={styles.adminLeftColumn}>
          <div className={styles.cardList}>
          {services.map((service) => (
            <View key={service.id} className={styles.barberCard}>
              <View className={styles.barberInfo}>
                <Text className={styles.barberName}>{service.name}</Text>
                {(() => {
                  const assignedIds = new Set(
                    barberServices.filter((bs) => bs.service_id === service.id).map((bs) => bs.barber_id)
                  );
                  const names = allBarbers
                    .filter((b) => assignedIds.has(b.id))
                    .map((b) => b.name);
                  return names.length > 0
                    ? <Text className={styles.barberDetail}>{names.join(' • ')}</Text>
                    : null;
                })()}
                <Text className={styles.barberDetail}>
                  {service.duration_minutes} minutes • {service.reward_points} points
                </Text>
                {service.description && (
                  <Text className={styles.barberDetail}>{service.description}</Text>
                )}
              </View>
              <View className={styles.barberActions}>
                <button
                  className={editingService?.id === service.id ? styles.editButtonActive : styles.editButton}
                  onClick={() => {
                    if (editingService?.id === service.id) {
                      handleCancel();
                    } else {
                      handleEdit(service);
                    }
                  }}
                >
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(service.id)}>
                  Delete
                </button>
              </View>
            </View>
          ))}
          </div>
        </div>

        {/* Add / Edit form */}
        <div ref={formRef} className={styles.adminRightColumn}>
          <View className={styles.sectionHeader}>
            {editingService ? (
              <Text className={styles.sectionTitle}>Edit Service</Text>
            ) : (
              <button
                type="button"
                className={styles.addToggleButton}
                onClick={() => setShowAddForm((v) => !v)}
              >
                + Add Service
                <ChevronDown
                  size={20}
                  className={styles.addToggleChevron}
                  style={{ transform: showAddForm ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            )}
          </View>

          {(editingService || showAddForm) && <form onSubmit={handleSubmit} className={styles.form}>
            <View className={styles.formGroup}>
              <label className={styles.label}>Service Name *</label>
              <input
                type="text"
                className={styles.input}
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="Type here..."
                required
              />
            </View>

            {allBarbers.length > 0 && (
              <View className={styles.formGroup}>
                <label className={styles.label}>Offered By</label>
                <View style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...allBarbers].sort((a, b) => a.name.localeCompare(b.name)).map((barber) => (
                    <label
                      key={barber.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selectedBarberIds.includes(barber.id)}
                        onChange={() => toggleBarber(barber.id)}
                      />
                      <span style={{ color: '#fff', fontSize: '18px' }}>{barber.name}</span>
                    </label>
                  ))}
                </View>
              </View>
            )}

            <View className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Type here..."
                rows={2}
              />
            </View>

            <ImageUpload
              currentImageUrl={serviceForm.image_url || undefined}
              onImageChange={(url) => setServiceForm({ ...serviceForm, image_url: url || '' })}
              bucket="service-images"
              label="Service Image"
            />

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Duration (minutes) *</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  className={styles.input}
                  value={serviceForm.duration_minutes}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) })
                  }
                  required
                />
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>Reward Points *</label>
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  value={serviceForm.reward_points}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, reward_points: parseInt(e.target.value) })
                  }
                  required
                />
              </View>
            </View>

            <View className={styles.formActions}>
              {editingService ? (
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
              ) : (
                <button type="button" className={styles.cancelButton} onClick={() => { setServiceForm(DEFAULT_SERVICE_FORM); setSelectedBarberIds([]); }}>
                  Clear
                </button>
              )}
              <button type="submit" className={styles.submitButton}>
                Save
              </button>
            </View>
          </form>}
        </div>
      </div>
    </View>
  );
}
