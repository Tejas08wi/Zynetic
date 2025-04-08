🛠 Tech Stack
React.js – Frontend framework

Tailwind CSS – Styling utility-first CSS framework

OpenWeatherMap API – Weather and forecast data

React Spinners – Loading animation (react-spinners)

LocalStorage – Recent search + theme persistence

⚙️ Setup Instructions
Clone the repository:

bash
Copy
Edit
git clone https://github.com/your-username/weather-dashboard.git
cd weather-dashboard
Install dependencies:

bash
Copy
Edit
npm install
Add your API key: Create a .env file in the root directory and add your OpenWeatherMap API key:

env
Copy
Edit
VITE_WEATHER_API_KEY=your_api_key_here
Start the development server:

bash
Copy
Edit
npm run dev
Your app will be running at http://localhost:5173 (if using Vite).

🔗 API Integration Details
OpenWeatherMap API
Current Weather API:
https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={API_KEY}

5-Day Forecast API:
https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={API_KEY}

Usage Notes:
API Key Required: You must sign up at openweathermap.org to get a free API key.

Rate Limits (Free Tier):

60 calls per minute

1,000,000 calls/month

Units: We're using metric for Celsius.
