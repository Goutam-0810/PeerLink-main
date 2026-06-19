## 6. Execution Commands 
### 6.1 Run locally
1. **Start Backend**:
   Ensure Java JDK 17 is installed. Run Maven commands from the root directory:
   ```bash
   mvn clean package
   java -jar target/peerlink-1.0-SNAPSHOT.jar
   ```
2. **Start Frontend**:
   Navigate to the `ui` folder, install Node packages, and run the Next.js development server:
   ```bash
   cd ui
   npm run build
   npm start
   ```
   Access the application at `http://localhost:3000`.
### 6.2 Run via Docker Compose (Recommended)
    before running check docker-compose file
1. **Build and Start Containers**:
   ```bash
   docker-compose up -d --build
   ```
2. **Stop and Cleanup Containers**:
   ```bash
   docker-compose down
