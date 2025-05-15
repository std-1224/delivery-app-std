export interface IMerchant {
  id?: string | undefined,
  name: string,
  description: string,
  category: string,
  address: string,
  phone: string,
  email: string,
  logo: string,
  image: string,
  logo_preview_url?: string,
  image_preview_url?: string
};