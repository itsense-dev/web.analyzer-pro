export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  user_creation_date: Date;
  last_updated_date?: string;
  last_updated_user?: string;
  rol_id: number;
  logo?: string;
}
