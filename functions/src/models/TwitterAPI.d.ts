interface tweet {
  id: string;
  text: string;
}
export interface TwitterAPI {
  data: tweet[];
  meta: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
}
