# Angular Real-time Chat Application

This is a real-time chat application built with **Angular** and integrated with either  **Socket.io**(default) or  **Firebase Firestore(optional)** for messaging. It enables users to send and receive messages instantly with features like typing indicators, timestamps, and message notifications.

## Angular Components

- **MessageInputComponent**: For typing and sending messages  
- **MessageListComponent**: For displaying messages  
- **ChatRoomComponent**: For organizing the chat room view  

## Angular Services

- **SocketService**: Handles Socket.io connections and events  
- **ChatService**: Manages message sending/receiving and typing notifications  
- **AuthService**: Handles user authentication  

## Angular Directives and Pipes

- **ScrollToBottomDirective**: Automatically scrolls to latest messages  
- **TimeAgoPipe**: Formats message timestamps as "time ago"  

## Core Features

- Real-time messaging with Socket.io  
- Timestamp display for messages  
- Typing indicators  
- Desktop notifications for new messages  
- Basic user authentication with username  
- Responsive UI with avatars, message styling, etc.  

## Technology Stack

- **Frontend**: Angular (v16)  
- **Backend**: Node.js with Socket.io  

## Folder Structure

```bash
chat-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chat-room/
│   │   │   ├── message-input/
│   │   │   ├── message-list/
│   │   │   └── auth/
│   │   ├── models/
│   │   ├── services/
│   │   ├── pipes/
│   │   ├── directives/
│   │   ├── guards/
│   │   ├── app.module.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.component.html
│   ├── assets/
│   ├── environments/
│   └── index.html
├── server/
│   ├── index.js
│   └── socket-handler.js
└── package.json
```
## Getting Started
1. Clone the repo
```bash
https://github.com/sachinksamad1/chat-app.git
cd chat-app
```
2. Install dependencies
```bash
npm install
```
3. Run the app
```bash
npm run dev
```
4. Access the application
```bash
http://localhost:4200
```

ADDITIONAL NOTES:

- The client runs on port 4200 (Angular default).
- The server runs on port 3000.
- Make sure both ports are available before running the application.
- For production deployment, update the socketUrl in environment.prod.ts.

## Acknowledgments
- Angular
- Firebase
- Socket.io
