// components/dashboard/EditProfileModal.tsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { View } from '../../ui/View';
import * as authStyles from '../../styles/auth.css';
import * as dashStyles from '../../styles/dashboard.css';
import type { Customer } from '../../types/database.types';

interface EditProfileModalProps {
  customer: Customer;
  onClose: () => void;
  onSaved: () => void;
  onAccountDeleted: () => void;
}

export function EditProfileModal({ customer, onClose, onSaved, onAccountDeleted }: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(customer.first_name || '');
  const [lastName, setLastName] = useState(customer.last_name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() })
        .eq('id', customer.id);
      if (error) throw error;
      onSaved();
    } catch {
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setDeleting(true);
    try {
      await supabase.from('bookings').delete().eq('customer_id', customer.id);
      await supabase.from('customers').delete().eq('id', customer.id);
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
      onAccountDeleted();
    } catch {
      setError('Failed to delete account. Please contact support.');
      setDeleting(false);
    }
  };

  return (
    <View className={authStyles.modalOverlay} onClick={onClose}>
      <div className={authStyles.formCard} onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>

        {!confirmDelete ? (
          <>
          {/* Delete account link — top right */}
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                position: 'absolute', top: 14, right: 16,
                background: 'none', border: 'none',
                color: '#ef4444', fontSize: 16, cursor: 'pointer',
                padding: 0, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Delete Account
            </button>
            
            <p style={{ color: '#f5f5f5', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 20, marginTop: 28 }}>
              Edit Profile
            </p>

            <div className={authStyles.form}>
              {error && (
                <div className={authStyles.error}>{error}</div>
              )}

              <div className={authStyles.inputRow}>
                <div className={authStyles.inputGroup}>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={authStyles.input}
                    placeholder="First Name"
                  />
                </div>
                <div className={authStyles.inputGroup}>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={authStyles.input}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className={authStyles.inputGroup}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={authStyles.input}
                  placeholder="Phone Number"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <button
                  onClick={onClose}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '12px 16px', fontSize: 16, fontWeight: 600,
                    backgroundColor: 'transparent', color: '#ef4444',
                    border: '2px solid #ef4444', borderRadius: 10, cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '12px 16px', fontSize: 16, fontWeight: 600,
                    backgroundColor: 'transparent', color: '#96cfe0',
                    border: '2px solid #96cfe0', borderRadius: 10, cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(150,207,224,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: '#ef4444', fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8, marginTop: 4 }}>
              Delete Account?
            </p>
            <p style={{ color: '#b0b0b0', fontSize: 15, textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>
              This will permanently delete your account, all bookings, and your data. This cannot be undone.
            </p>

            {error && (
              <div className={authStyles.error} style={{ marginBottom: 12 }}>{error}</div>
            )}

            <View className={dashStyles.modalActions}>
              <button className={dashStyles.modalKeepButton} onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Go Back
              </button>
              <button className={dashStyles.modalCancelButton} onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </View>
          </>
        )}
      </div>
    </View>
  );
}
