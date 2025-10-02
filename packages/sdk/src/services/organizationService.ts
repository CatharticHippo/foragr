import { z } from 'zod';
import { CedarlumeApiClient } from '../client';
import {
  Organization,
  OrganizationSchema,
  OrganizationAdmin,
  OrganizationAdminSchema,
  OrganizationStats,
  OrganizationStatsSchema,
  CreateOrganizationRequest,
  CreateOrganizationRequestSchema,
  UpdateOrganizationRequest,
  UpdateOrganizationRequestSchema,
  PaginatedResponse,
} from '../types';

export class OrganizationService {
  constructor(private client: CedarlumeApiClient) {}

  async getOrganizations(limit = 20, offset = 0): Promise<PaginatedResponse<Organization>> {
    const response = await this.client.get<PaginatedResponse<Organization>>('/organizations', {
      limit,
      offset,
    });
    return response;
  }

  async getOrganizationById(organizationId: string): Promise<Organization> {
    const response = await this.client.get<Organization>(`/organizations/${organizationId}`);
    return OrganizationSchema.parse(response);
  }

  async getOrganizationStats(organizationId: string): Promise<OrganizationStats> {
    const response = await this.client.get<OrganizationStats>(`/organizations/${organizationId}/stats`);
    return OrganizationStatsSchema.parse(response);
  }

  async createOrganization(organizationData: CreateOrganizationRequest): Promise<Organization> {
    const validatedOrganizationData = CreateOrganizationRequestSchema.parse(organizationData);
    const response = await this.client.post<Organization>('/organizations', validatedOrganizationData);
    return OrganizationSchema.parse(response);
  }

  async updateOrganization(organizationId: string, organizationData: UpdateOrganizationRequest): Promise<Organization> {
    const validatedOrganizationData = UpdateOrganizationRequestSchema.parse(organizationData);
    const response = await this.client.patch<Organization>(`/organizations/${organizationId}`, validatedOrganizationData);
    return OrganizationSchema.parse(response);
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    await this.client.delete(`/organizations/${organizationId}`);
  }

  // Admin methods
  async getOrganizationAdmins(organizationId: string): Promise<OrganizationAdmin[]> {
    const response = await this.client.get<OrganizationAdmin[]>(`/organizations/${organizationId}/admins`);
    return z.array(OrganizationAdminSchema).parse(response);
  }

  async addOrganizationAdmin(organizationId: string, userId: string, role = 'admin'): Promise<OrganizationAdmin> {
    const response = await this.client.post<OrganizationAdmin>(`/organizations/${organizationId}/admins`, {
      userId,
      role,
    });
    return OrganizationAdminSchema.parse(response);
  }

  async removeOrganizationAdmin(organizationId: string, adminId: string): Promise<void> {
    await this.client.delete(`/organizations/${organizationId}/admins/${adminId}`);
  }

  async updateOrganizationAdminRole(organizationId: string, adminId: string, role: string): Promise<OrganizationAdmin> {
    const response = await this.client.patch<OrganizationAdmin>(`/organizations/${organizationId}/admins/${adminId}`, {
      role,
    });
    return OrganizationAdminSchema.parse(response);
  }

  // Stripe Connect methods
  async createStripeAccountLink(organizationId: string, refreshUrl: string, returnUrl: string): Promise<{ url: string }> {
    const response = await this.client.post<{ url: string }>(`/organizations/${organizationId}/stripe/account-link`, {
      refreshUrl,
      returnUrl,
    });
    return response;
  }

  async getStripeAccountStatus(organizationId: string): Promise<{ verified: boolean; detailsSubmitted: boolean }> {
    const response = await this.client.get<{ verified: boolean; detailsSubmitted: boolean }>(`/organizations/${organizationId}/stripe/status`);
    return response;
  }
}
