import { CedarlumeApiClient } from '../client';
import {
  Application,
  ApplicationSchema,
  CreateApplicationRequest,
  CreateApplicationRequestSchema,
  UpdateApplicationRequest,
  UpdateApplicationRequestSchema,
  PaginatedResponse,
} from '../types';

export class ApplicationService {
  constructor(private client: CedarlumeApiClient) {}

  async getMyApplications(limit = 20, offset = 0): Promise<PaginatedResponse<Application>> {
    const response = await this.client.get<PaginatedResponse<Application>>('/applications/my', {
      limit,
      offset,
    });
    return response;
  }

  async getApplicationById(applicationId: string): Promise<Application> {
    const response = await this.client.get<Application>(`/applications/${applicationId}`);
    return ApplicationSchema.parse(response);
  }

  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    const validatedApplicationData = CreateApplicationRequestSchema.parse(applicationData);
    const response = await this.client.post<Application>('/applications', validatedApplicationData);
    return ApplicationSchema.parse(response);
  }

  async updateApplication(applicationId: string, applicationData: UpdateApplicationRequest): Promise<Application> {
    const validatedApplicationData = UpdateApplicationRequestSchema.parse(applicationData);
    const response = await this.client.patch<Application>(`/applications/${applicationId}`, validatedApplicationData);
    return ApplicationSchema.parse(response);
  }

  async cancelApplication(applicationId: string): Promise<Application> {
    const response = await this.client.patch<Application>(`/applications/${applicationId}`, {
      status: 'cancelled',
    });
    return ApplicationSchema.parse(response);
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await this.client.delete(`/applications/${applicationId}`);
  }

  // Organization admin methods
  async getApplicationsByOrganization(organizationId: string, limit = 20, offset = 0): Promise<PaginatedResponse<Application>> {
    const response = await this.client.get<PaginatedResponse<Application>>(`/organizations/${organizationId}/applications`, {
      limit,
      offset,
    });
    return response;
  }

  async getApplicationsByListing(listingId: string, limit = 20, offset = 0): Promise<PaginatedResponse<Application>> {
    const response = await this.client.get<PaginatedResponse<Application>>(`/listings/${listingId}/applications`, {
      limit,
      offset,
    });
    return response;
  }

  async reviewApplication(applicationId: string, status: 'accepted' | 'rejected', notes?: string): Promise<Application> {
    const response = await this.client.patch<Application>(`/applications/${applicationId}/review`, {
      status,
      notes,
    });
    return ApplicationSchema.parse(response);
  }
}
