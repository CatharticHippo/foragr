import { z } from 'zod';
import { CedarlumeApiClient } from '../client';
import {
  Listing,
  ListingSchema,
  Shift,
  ShiftSchema,
  CreateListingRequest,
  CreateListingRequestSchema,
  UpdateListingRequest,
  UpdateListingRequestSchema,
  SearchFilters,
  SearchFiltersSchema,
  PaginatedResponse,
} from '../types';

export class ListingService {
  constructor(private client: CedarlumeApiClient) {}

  async getListings(filters?: SearchFilters, limit = 20, offset = 0): Promise<PaginatedResponse<Listing>> {
    const params: any = { limit, offset };
    
    if (filters) {
      const validatedFilters = SearchFiltersSchema.parse(filters);
      Object.assign(params, validatedFilters);
    }

    const response = await this.client.get<PaginatedResponse<Listing>>('/listings', params);
    return response;
  }

  async getListingById(listingId: string): Promise<Listing> {
    const response = await this.client.get<Listing>(`/listings/${listingId}`);
    return ListingSchema.parse(response);
  }

  async getFeaturedListings(): Promise<Listing[]> {
    const response = await this.client.get<Listing[]>('/listings/featured');
    return z.array(ListingSchema).parse(response);
  }

  async getNearbyListings(latitude: number, longitude: number, radius = 25): Promise<Listing[]> {
    const response = await this.client.get<Listing[]>('/listings/nearby', {
      latitude,
      longitude,
      radius,
    });
    return z.array(ListingSchema).parse(response);
  }

  async searchListings(query: string, filters?: Omit<SearchFilters, 'query'>): Promise<PaginatedResponse<Listing>> {
    const searchFilters: SearchFilters = { query, ...filters };
    return this.getListings(searchFilters);
  }

  async createListing(listingData: CreateListingRequest): Promise<Listing> {
    const validatedListingData = CreateListingRequestSchema.parse(listingData);
    const response = await this.client.post<Listing>('/listings', validatedListingData);
    return ListingSchema.parse(response);
  }

  async updateListing(listingId: string, listingData: UpdateListingRequest): Promise<Listing> {
    const validatedListingData = UpdateListingRequestSchema.parse(listingData);
    const response = await this.client.patch<Listing>(`/listings/${listingId}`, validatedListingData);
    return ListingSchema.parse(response);
  }

  async deleteListing(listingId: string): Promise<void> {
    await this.client.delete(`/listings/${listingId}`);
  }

  // Shift methods
  async getShiftsByListingId(listingId: string): Promise<Shift[]> {
    const response = await this.client.get<Shift[]>(`/listings/${listingId}/shifts`);
    return z.array(ShiftSchema).parse(response);
  }

  async createShift(listingId: string, shiftData: any): Promise<Shift> {
    const response = await this.client.post<Shift>(`/listings/${listingId}/shifts`, shiftData);
    return ShiftSchema.parse(response);
  }

  async updateShift(shiftId: string, shiftData: any): Promise<Shift> {
    const response = await this.client.patch<Shift>(`/shifts/${shiftId}`, shiftData);
    return ShiftSchema.parse(response);
  }

  async deleteShift(shiftId: string): Promise<void> {
    await this.client.delete(`/shifts/${shiftId}`);
  }
}
