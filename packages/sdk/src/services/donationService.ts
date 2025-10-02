import { CedarlumeApiClient } from '../client';
import {
  Donation,
  DonationSchema,
  Receipt,
  ReceiptSchema,
  CreateDonationCheckoutRequest,
  CreateDonationCheckoutRequestSchema,
  StripeCheckoutSession,
  StripeCheckoutSessionSchema,
  PaginatedResponse,
} from '../types';

export class DonationService {
  constructor(private client: CedarlumeApiClient) {}

  async getMyDonations(limit = 20, offset = 0): Promise<PaginatedResponse<Donation>> {
    const response = await this.client.get<PaginatedResponse<Donation>>('/donations/my', {
      limit,
      offset,
    });
    return response;
  }

  async getDonationById(donationId: string): Promise<Donation> {
    const response = await this.client.get<Donation>(`/donations/${donationId}`);
    return DonationSchema.parse(response);
  }

  async createCheckoutSession(checkoutData: CreateDonationCheckoutRequest): Promise<StripeCheckoutSession> {
    const validatedCheckoutData = CreateDonationCheckoutRequestSchema.parse(checkoutData);
    const response = await this.client.post<StripeCheckoutSession>('/donations/checkout', validatedCheckoutData);
    return StripeCheckoutSessionSchema.parse(response);
  }

  async getReceipts(limit = 20, offset = 0): Promise<PaginatedResponse<Receipt>> {
    const response = await this.client.get<PaginatedResponse<Receipt>>('/donations/receipts', {
      limit,
      offset,
    });
    return response;
  }

  async getReceiptById(receiptId: string): Promise<Receipt> {
    const response = await this.client.get<Receipt>(`/donations/receipts/${receiptId}`);
    return ReceiptSchema.parse(response);
  }

  async downloadReceiptPdf(receiptId: string): Promise<{ url: string }> {
    const response = await this.client.get<{ url: string }>(`/donations/receipts/${receiptId}/pdf`);
    return response;
  }

  // Organization admin methods
  async getDonationsByOrganization(organizationId: string, limit = 20, offset = 0): Promise<PaginatedResponse<Donation>> {
    const response = await this.client.get<PaginatedResponse<Donation>>(`/organizations/${organizationId}/donations`, {
      limit,
      offset,
    });
    return response;
  }

  async getDonationStats(organizationId: string, dateRange?: { startDate: string; endDate: string }): Promise<{
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
    donorCount: number;
  }> {
    const params: any = {};
    if (dateRange) {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    }

    const response = await this.client.get<{
      totalDonations: number;
      totalAmount: number;
      averageDonation: number;
      donorCount: number;
    }>(`/organizations/${organizationId}/donations/stats`, params);
    return response;
  }

  // Webhook methods
  async handleStripeWebhook(payload: any, signature: string): Promise<{ received: boolean }> {
    const response = await this.client.request<{ received: boolean }>({
      method: 'POST',
      path: '/donations/webhook',
      body: payload,
      headers: {
        'stripe-signature': signature,
      },
    });
    return response;
  }
}
