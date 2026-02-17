// components/CustomerSearchInput.tsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Customer } from '../types/database.types';
import * as styles from '../styles/customerSearch.css';

interface CustomerSearchInputProps {
  onSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
  onClear: () => void;
  placeholder?: string;
}

export function CustomerSearchInput({
  onSelect,
  selectedCustomer,
  onClear,
  placeholder = 'Search by name, phone, or email...',
}: CustomerSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const query = searchQuery.trim().toLowerCase();

        // Search by first name, last name, email, or phone
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .or(
            `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`
          )
          .order('last_name', { ascending: true })
          .limit(10);

        if (error) throw error;

        setSearchResults(data || []);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error('Error searching customers:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  // If a customer is selected, show the selected state
  if (selectedCustomer) {
    return (
      <div ref={containerRef} className={styles.searchContainer}>
        <div className={styles.selectedCustomer}>
          <div className={styles.selectedCustomerInfo}>
            <span className={styles.selectedCustomerName}>
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </span>
            <span className={styles.selectedCustomerDetail}>
              {selectedCustomer.phone} &middot; {selectedCustomer.email}
            </span>
          </div>
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            title="Clear selection"
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => {
          if (searchResults.length > 0) {
            setIsDropdownOpen(true);
          }
        }}
      />

      {isDropdownOpen && (
        <div className={styles.searchDropdown}>
          {isLoading ? (
            <div className={styles.searchLoading}>Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className={styles.searchNoResults}>No customers found</div>
          ) : (
            searchResults.map((customer) => (
              <div
                key={customer.id}
                className={styles.searchResultItem}
                onClick={() => handleSelect(customer)}
              >
                <div className={styles.searchResultName}>
                  {customer.first_name} {customer.last_name}
                </div>
                <div className={styles.searchResultDetail}>
                  {customer.phone} &middot; {customer.email}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

