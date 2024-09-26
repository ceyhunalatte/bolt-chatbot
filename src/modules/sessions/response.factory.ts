import { Session } from 'src/models/session.model';
import { chatHistoryItemProps, LlmService } from 'src/modules/llm/llm.service';

export const questions = [
  'What is your favorite breed of cat, and why?',
  'How do you think cats communicate with their owners?',
  'Have you ever owned a cat? If so, what was their name and personality like?',
  'Why do you think cats love to sleep in small, cozy places?',
  'What’s the funniest or strangest behavior you’ve ever seen a cat do?',
  'Do you prefer cats or kittens, and what’s the reason for your preference?',
  'Why do you think cats are known for being independent animals?',
  'How do you think cats manage to land on their feet when they fall?',
  'What’s your favorite fact or myth about cats?',
  'How would you describe the relationship between humans and cats in three words?',
];

/**
 * ResponseFactory class is responsible for generating responses
 * based on the current session and chat history.
 */
export class ResponseFactory extends LlmService {
  private session: Session;
  private chatHistory: chatHistoryItemProps[];

  constructor(session: Session, chatHistory: chatHistoryItemProps[]) {
    super();

    this.session = session;
    this.chatHistory = chatHistory.map((item) => ({
      role: item.role,
      message: item.message,
    }));
  }

  async generate(): Promise<string> {
    const data = {
      chatHistory: this.chatHistory,
      message: this.generatePrompt(),
    };

    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log(data);
    console.log(
      '---------------------------------------------------------------------------------',
    );

    const response = await this.chat(data);

    console.log(
      '---------------------------------------------------------------------------------',
    );
    console.log(response);
    console.log(
      '---------------------------------------------------------------------------------',
    );

    return response;
  }

  private generatePrompt() {
    const { step } = this.session;
    switch (true) {
      case step === 0:
        return 'Greet the user and briefly explain that you will ask them questions related to cats and  generate a friendly and slightly varied version of this question: "${questions[this.session.step]}" related to cats.';
      case step + 1 === questions.length:
        return 'Say your farewells to user and tell them something cute about cats.';
      default:
        return `Respond to user's last message with a small sentence and generate a friendly and slightly varied version of this question: "${questions[this.session.step]}" related to cats.`;
    }
  }
}
