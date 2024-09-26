import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CohereClient } from 'cohere-ai';
import { ValidationPipe } from '@nestjs/common';

// const cohere = new CohereClient({
//   token: process.env.COHERE_API_SECRET,
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: ['http://localhost:3001'] },
  });
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  await app.listen(3000);

  const questions = [
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

  // const response = await cohere.chat({
  //   model: 'command-r-plus-08-2024',
  //   chatHistory: [
  //     {
  //       role: 'SYSTEM',
  //       message:
  //         'You are a friendly, conversational chatbot asking questions about cats.',
  //     },
  //     {
  //       role: 'USER',
  //       message:
  //         'Generate a friendly and slightly varied version of this question: "${questions[0]}" related to cats.',
  //     },
  //     {
  //       role: 'CHATBOT',
  //       message:
  //         "Do cats have a favorite color? I've always wondered if they have any color preferences when it comes to their toys or even their surroundings. It would be so cute to discover their favorite shade! Any insights from fellow cat lovers?",
  //     },
  //     {
  //       role: 'SYSTEM',
  //       message: `Slightly respond to user's last message and generate a friendly and slightly varied version of this question: "${questions[2]}" related to cats.`,
  //     },
  //   ],
  //   message: `Cat lovers always gonna love cats :)`,
  // });

  // console.log(response);
}
bootstrap();
