# adb-mobile-controller

## Getting Started

### Prerequisites

Make sure you have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/liorelisberg/adb-mobile-controller.git
   cd adb-mobile-controller

2. **Install dependencies:**
   ```bash
   npm install

3. **Create a `proxy-config.json', under `src\managers`, to configurate your proxy settings.\n
   should contain the following json format:**
   ```bash
   {
       "proxy": "my_proxy",
       "port": "my_port",
       "authToken": "my_auth-token",
       "password": "my_password"
   }

### Building the Project

3. **Building the Project:**
   ```bash
   npm run build

### Run the project
4. **Start an Android device: Fire up your favorite Android emulator.**

5. **Running the Project:**
   ```bash
   npm run start

## Contributing
Feel free to contribute to this project! Fork the repository, make your changes, and submit a pull request.
