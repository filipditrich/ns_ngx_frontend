export interface IResponse {
  name: string;
  message?: string;
  status: number;
  success: boolean;
}

export interface ILoginResponse {
  response: IResponse;
  token?: string;
  user?: any;
}
