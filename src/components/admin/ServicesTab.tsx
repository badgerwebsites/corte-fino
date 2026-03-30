// components/admin/ServicesTab.tsx
import { useEffect, useRef, useState } from 'react';
import type { Service } from '../../types/database.types';
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

interface ServicesTabProps {
  services: Service[];
  onUpdate: () => void;
}

export function ServicesTab({ services, onUpdate }: ServicesTabProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState(DEFAULT_SERVICE_FORM);

  useEffect(() => {
    if (editingService) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingService]);

  const handleCancel = () => {
    setEditingService(null);
    setServiceForm(DEFAULT_SERVICE_FORM);
  };

  const handleEdit = (service: Service) => {
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
      if (editingService) {
        const { error } = await supabase.from('services').update(serviceForm).eq('id', editingService.id);
        if (error) throw error;
        alert('Service updated successfully!');
      } else {
        const { error } = await supabase.from('services').insert([{ ...serviceForm, base_price: 0 }]);
        if (error) throw error;
        alert('Service added successfully!');
      }
      setServiceForm(DEFAULT_SERVICE_FORM);
      setEditingService(null);
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
      alert('Service deleted successfully!');
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
          {services.map((service) => (
            <View key={service.id} className={styles.barberCard}>
              <View className={styles.barberInfo}>
                <Text className={styles.barberName}>{service.name}</Text>
                <Text className={styles.barberDetail}>
                  {service.duration_minutes} minutes • {service.reward_points} points
                </Text>
                {service.description && (
                  <Text className={styles.barberDetail}>{service.description}</Text>
                )}
              </View>
              <View className={styles.barberActions}>
                <button className={styles.editButton} onClick={() => handleEdit(service)}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(service.id)}>
                  Delete
                </button>
              </View>
            </View>
          ))}
        </div>

        {/* Add / Edit form */}
        <div ref={formRef} className={styles.adminRightColumn}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {editingService ? 'Edit Service' : '+ Add Service'}
            </Text>
          </View>

          <form onSubmit={handleSubmit} className={styles.form}>
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
              <button type="submit" className={styles.submitButton}>
                {editingService ? 'Update' : 'Add Service'}
              </button>
              {editingService && (
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </View>
          </form>
        </div>
      </div>
    </View>
  );
}
