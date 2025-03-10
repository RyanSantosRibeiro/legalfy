import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { Process } from '@/types/database';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

// Process-related queries

/**
 * Get all processes for the logged-in lawyer
 * @param supabase SupabaseClient instance
 * @param userId The ID of the logged-in user (lawyer)
 * @returns Array of processes or null if error
 */
export const getLawyerProcesses = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data: processes, error } = await supabase
    .from('processes')
    .select('*')
    .eq('lawyer_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching processes:', error);
    return null;
  }

  return processes;
});

/**
 * Get a specific process by its process key
 * @param supabase SupabaseClient instance
 * @param processKey The unique process key
 * @param userId The ID of the logged-in user (lawyer)
 * @returns The process or null if not found or error
 */
export const getProcessByKey = cache(async (
  supabase: SupabaseClient, 
  processKey: string, 
  userId: string
) => {
  const { data: process, error } = await supabase
    .from('processes')
    .select('*')
    .eq('process_key', processKey)
    .eq('lawyer_id', userId)
    .single();

  if (error) {
    console.error('Error fetching process:', error);
    return null;
  }

  return process;
});

/**
 * Create a new process
 * @param supabase SupabaseClient instance
 * @param processData The process data to insert
 * @returns The created process or null if error
 */
export const createProcess = async (
  supabase: SupabaseClient,
  processData: Omit<Process, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data: process, error } = await supabase
    .from('processes')
    .insert(processData)
    .select()
    .single();

  if (error) {
    console.error('Error creating process:', error);
    return null;
  }

  return process;
};

/**
 * Update an existing process
 * @param supabase SupabaseClient instance
 * @param processKey The unique process key
 * @param userId The ID of the logged-in user (lawyer)
 * @param updateData The data to update
 * @returns The updated process or null if error
 */
export const updateProcess = async (
  supabase: SupabaseClient,
  processKey: string,
  userId: string,
  updateData: Partial<Omit<Process, 'id' | 'process_key' | 'lawyer_id' | 'created_at' | 'updated_at'>>
) => {
  // Add updated_at timestamp
  const dataWithTimestamp = {
    ...updateData,
    updated_at: new Date().toISOString()
  };

  const { data: process, error } = await supabase
    .from('processes')
    .update(dataWithTimestamp)
    .eq('process_key', processKey)
    .eq('lawyer_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating process:', error);
    return null;
  }

  return process;
};

/**
 * Delete a process
 * @param supabase SupabaseClient instance
 * @param processKey The unique process key
 * @param userId The ID of the logged-in user (lawyer)
 * @returns True if successful, false if error
 */
export const deleteProcess = async (
  supabase: SupabaseClient,
  processKey: string,
  userId: string
) => {
  const { error } = await supabase
    .from('processes')
    .delete()
    .eq('process_key', processKey)
    .eq('lawyer_id', userId);

  if (error) {
    console.error('Error deleting process:', error);
    return false;
  }

  return true;
};

/**
 * Get a specific process by its process key (public view)
 * This function doesn't require authentication and returns only basic information
 * @param supabase SupabaseClient instance
 * @param processKey The unique process key
 * @returns The process with basic information or null if not found or error
 */
export const getPublicProcessByKey = cache(async (
  supabase: SupabaseClient, 
  processKey: string
) => {
  const { data: process, error } = await supabase
    .from('processes')
    .select('process_key, title, status, process_type, court, case_number, filing_date, created_at, updated_at')
    .eq('process_key', processKey)
    .single();

  if (error) {
    console.error('Error fetching public process:', error);
    return null;
  }

  return process;
});
