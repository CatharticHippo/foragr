import { CedarlumeApiClient } from '../client';
import {
  Attendance,
  AttendanceSchema,
  CheckInRequest,
  CheckInRequestSchema,
  CheckOutRequest,
  CheckOutRequestSchema,
  GenerateQRCodeRequest,
  GenerateQRCodeRequestSchema,
  QRCodeResponse,
  QRCodeResponseSchema,
  PaginatedResponse,
} from '../types';

export class AttendanceService {
  constructor(private client: CedarlumeApiClient) {}

  async getMyAttendance(limit = 20, offset = 0): Promise<PaginatedResponse<Attendance>> {
    const response = await this.client.get<PaginatedResponse<Attendance>>('/attendance', {
      limit,
      offset,
    });
    return response;
  }

  async getAttendanceById(attendanceId: string): Promise<Attendance> {
    const response = await this.client.get<Attendance>(`/attendance/${attendanceId}`);
    return AttendanceSchema.parse(response);
  }

  async checkIn(checkInData: CheckInRequest): Promise<Attendance> {
    const validatedCheckInData = CheckInRequestSchema.parse(checkInData);
    const response = await this.client.post<Attendance>('/attendance/check-in', validatedCheckInData);
    return AttendanceSchema.parse(response);
  }

  async checkOut(checkOutData: CheckOutRequest): Promise<Attendance> {
    const validatedCheckOutData = CheckOutRequestSchema.parse(checkOutData);
    const response = await this.client.post<Attendance>('/attendance/check-out', validatedCheckOutData);
    return AttendanceSchema.parse(response);
  }

  async generateQRCode(request: GenerateQRCodeRequest): Promise<QRCodeResponse> {
    const validatedRequest = GenerateQRCodeRequestSchema.parse(request);
    const response = await this.client.post<QRCodeResponse>('/attendance/qr-code', validatedRequest);
    return QRCodeResponseSchema.parse(response);
  }

  async verifyQRCode(qrCode: string): Promise<{ valid: boolean; shiftId?: string; message?: string }> {
    const response = await this.client.post<{ valid: boolean; shiftId?: string; message?: string }>('/attendance/verify-qr', {
      qrCode,
    });
    return response;
  }

  async updateAttendance(attendanceId: string, updates: Partial<Attendance>): Promise<Attendance> {
    const response = await this.client.patch<Attendance>(`/attendance/${attendanceId}`, updates);
    return AttendanceSchema.parse(response);
  }

  // Organization admin methods
  async getAttendanceByShift(shiftId: string, limit = 20, offset = 0): Promise<PaginatedResponse<Attendance>> {
    const response = await this.client.get<PaginatedResponse<Attendance>>(`/shifts/${shiftId}/attendance`, {
      limit,
      offset,
    });
    return response;
  }

  async verifyAttendance(attendanceId: string, supervisorPin: string): Promise<Attendance> {
    const response = await this.client.patch<Attendance>(`/attendance/${attendanceId}/verify`, {
      supervisorPin,
    });
    return AttendanceSchema.parse(response);
  }

  async getAttendanceStats(shiftId: string): Promise<{
    totalCheckedIn: number;
    totalVerified: number;
    totalHours: number;
  }> {
    const response = await this.client.get<{
      totalCheckedIn: number;
      totalVerified: number;
      totalHours: number;
    }>(`/shifts/${shiftId}/attendance/stats`);
    return response;
  }
}
