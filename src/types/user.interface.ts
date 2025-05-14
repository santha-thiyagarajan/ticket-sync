export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  currentPassword?: string;
  newPassword?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof UserResponse;
  sortOrder?: 'ASC' | 'DESC';
}

// For authentication
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
}

export interface TokenPayload {
  sub: string; // user id
  email: string;
}