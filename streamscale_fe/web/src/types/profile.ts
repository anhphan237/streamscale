export interface Profile {
  id: number;
  name: string;
  avatarUrl: string | null;
  isKids: boolean;
}

export interface ProfileRequest {
  name: string;
  avatarUrl?: string;
  isKids: boolean;
}
