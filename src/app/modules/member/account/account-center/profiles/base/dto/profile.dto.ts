export interface ProfileDTO {
  username: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'private';
  birthDate: string;
  districtId: number;
}
