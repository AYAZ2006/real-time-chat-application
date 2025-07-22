A full-featured real-time chat platform built with Django and React, allowing authenticated users to connect, manage friend requests, and engage in private, real-time conversations.

🔑 Key Features
• User Authentication – Signup/login with secure token-based access
• Friend Request System – Users must accept requests before chatting
• Private Messaging – One-on-one real-time conversations
• WebSocket Integration – Real-time updates using Django Channels
• State Management – Built-in React state handling
• Clean UI/UX – Intuitive design for easy navigation

🧰 Tech Stack
• Frontend: React, JavaScript, Axios
• Backend: Django, Django REST Framework
• WebSockets: Django Channels
• Authentication: Token-based (DRF Auth / JWT optional)
• Database: SQLite (default), PostgreSQL ready
• Others: CORS, Environment Variables (.env), Routing

⚙️ Getting Started
1.Clone the repository
  git clone https://github.com/AYAZ2006/real-time-chat-application.git
2.Backend Setup (Django)
  cd backend
  pip install -r requirements.txt
  python manage.py migrate
  python manage.py runserver
3.Frontend Setup (React)
  cd frontend
  npm install
  npm start

  
🚀 Future Improvements
• Group chat support
• Message history storage
• Real-time online status indicators
• Push notifications
• Responsive/mobile-first design
