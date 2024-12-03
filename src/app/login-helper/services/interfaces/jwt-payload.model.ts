export interface JwtPayload {
  UserId: string;
  MemberId: string;
  UserAccount: string;
  UserType: string;
  nbf: number;      // Not Before 時間戳
  exp: number;      // Expiration Time 時間戳
  iss: string;      // Issuer 發行者
  aud: string;      // Audience 目標受眾
}
