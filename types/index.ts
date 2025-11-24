export interface CreatePromotionDTO {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  winners_quantity: number;
  created_by_user: number;
}
