export type IResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type StatisticsData = {
  original_url: string;
  encoded_url: string;
  encoding_count: number;
  status: "ACTIVE" | "INACTIVE";
  last_accessed: string;
};
