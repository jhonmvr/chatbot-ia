export interface ChatCompletionPort {
  streamAnswer(opts: {
    prompt: string;
    system?: string;
    onToken: (t: string) => void;
  }): Promise<void>;
}
