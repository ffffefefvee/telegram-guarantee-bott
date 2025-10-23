export interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    username?: string;
    first_name?: string;
    language_code?: string;
  };
  text?: string;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    data: string;
    from: TelegramMessage["from"];
  };
}
