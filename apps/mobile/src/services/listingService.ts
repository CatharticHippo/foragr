import { apiClient } from '../config/api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  duration: string;
  volunteersNeeded: number;
  organizationId: string;
  organizationName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
  requirements?: string[];
  skills?: string[];
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  search?: string;
  category?: string;
  location?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  skills?: string[];
  xpRange?: {
    min: number;
    max: number;
  };
}

export const listingService = {
  async getListings(filters?: ListingFilters): Promise<Listing[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.skills?.length) params.append('skills', filters.skills.join(','));
      if (filters?.xpRange) {
        params.append('minXp', filters.xpRange.min.toString());
        params.append('maxXp', filters.xpRange.max.toString());
      }

      const response = await apiClient.get(`/listings?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Return mock data for development
      return getMockListings(filters);
    }
  },

  async getFeaturedListings(): Promise<Listing[]> {
    try {
      const response = await apiClient.get('/listings/featured');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      // Return mock data for development
      return getMockListings().slice(0, 3);
    }
  },

  async getListingById(id: string): Promise<Listing> {
    try {
      const response = await apiClient.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      // Return mock data for development
      const mockListings = getMockListings();
      return mockListings.find(listing => listing.id === id) || mockListings[0];
    }
  },

  async createListing(listing: Partial<Listing>): Promise<Listing> {
    try {
      const response = await apiClient.post('/listings', listing);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  async updateListing(id: string, updates: Partial<Listing>): Promise<Listing> {
    try {
      const response = await apiClient.put(`/listings/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  async deleteListing(id: string): Promise<void> {
    try {
      await apiClient.delete(`/listings/${id}`);
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  },

  async rsvpToListing(listingId: string): Promise<void> {
    try {
      await apiClient.post(`/listings/${listingId}/rsvp`);
    } catch (error) {
      console.error('Error RSVPing to listing:', error);
      throw error;
    }
  },

  async cancelRsvp(listingId: string): Promise<void> {
    try {
      await apiClient.delete(`/listings/${listingId}/rsvp`);
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      throw error;
    }
  },
};

// Mock data for development
function getMockListings(filters?: ListingFilters): Listing[] {
  const mockListings: Listing[] = [
    {
      id: '1',
      title: 'Beach Cleanup at Santa Monica',
      description: 'Join us for a community beach cleanup to help keep our oceans clean. We\'ll provide all necessary equipment.',
      category: 'environment',
      location: 'Santa Monica, CA',
      duration: '3 hours',
      volunteersNeeded: 25,
      organizationId: 'org1',
      organizationName: 'Ocean Conservation Society',
      startDate: '2024-01-15T09:00:00Z',
      endDate: '2024-01-15T12:00:00Z',
      isActive: true,
      imageUrl: 'https://example.com/beach-cleanup.jpg',
      requirements: ['Must be 16+', 'Bring water bottle'],
      skills: ['Physical activity', 'Teamwork'],
      xpReward: 150,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Tutoring at Local Elementary School',
      description: 'Help elementary school students with reading and math. No teaching experience required.',
      category: 'education',
      location: 'Los Angeles, CA',
      duration: '2 hours',
      volunteersNeeded: 10,
      organizationId: 'org2',
      organizationName: 'Education First',
      startDate: '2024-01-20T14:00:00Z',
      endDate: '2024-01-20T16:00:00Z',
      isActive: true,
      imageUrl: 'https://example.com/tutoring.jpg',
      requirements: ['Background check required', 'Must be 18+'],
      skills: ['Patience', 'Communication'],
      xpReward: 100,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      title: 'Food Bank Distribution',
      description: 'Help distribute food to families in need at our local food bank.',
      category: 'community',
      location: 'Downtown LA, CA',
      duration: '4 hours',
      volunteersNeeded: 15,
      organizationId: 'org3',
      organizationName: 'Community Food Bank',
      startDate: '2024-01-25T08:00:00Z',
      endDate: '2024-01-25T12:00:00Z',
      isActive: true,
      imageUrl: 'https://example.com/food-bank.jpg',
      requirements: ['Must be 16+', 'Lifting required'],
      skills: ['Physical activity', 'Organization'],
      xpReward: 200,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '4',
      title: 'Animal Shelter Care',
      description: 'Help care for animals at our local shelter. Tasks include feeding, walking, and socializing.',
      category: 'health',
      location: 'Pasadena, CA',
      duration: '3 hours',
      volunteersNeeded: 8,
      organizationId: 'org4',
      organizationName: 'Paws & Hearts Animal Shelter',
      startDate: '2024-01-30T10:00:00Z',
      endDate: '2024-01-30T13:00:00Z',
      isActive: true,
      imageUrl: 'https://example.com/animal-shelter.jpg',
      requirements: ['Must be 18+', 'Animal experience preferred'],
      skills: ['Animal care', 'Compassion'],
      xpReward: 175,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  // Apply filters if provided
  let filteredListings = mockListings;

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredListings = filteredListings.filter(listing =>
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower) ||
      listing.organizationName.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.category && filters.category !== 'all') {
    filteredListings = filteredListings.filter(listing =>
      listing.category === filters.category
    );
  }

  if (filters?.location) {
    const locationLower = filters.location.toLowerCase();
    filteredListings = filteredListings.filter(listing =>
      listing.location.toLowerCase().includes(locationLower)
    );
  }

  return filteredListings;
}
