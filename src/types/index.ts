export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type Role = 'ADMIN' | 'SUPER_ADMIN'

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  packageId: string
  status: OrderStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Invitation {
  id: string
  orderId: string
  templateId: string
  slug: string
  brideName: string
  groomName: string
  eventDate: Date
  akadTime?: string
  akadVenue?: string
  resepsiTime?: string
  resepsiVenue?: string
  mapsUrl?: string
  musicUrl?: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
  isActive: boolean
  publishedAt?: Date
}

export interface RsvpData {
  guestName: string
  attending: boolean
  guestCount: number
  message?: string
}

export interface WishData {
  name: string
  message: string
}
