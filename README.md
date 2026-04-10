
```sh
git clone https://github.com/ChitTun1810/Larave-React-CRUD
cd Larave-React-CRUD
```

### 🔹 **Step 2: Install Dependencies**
```sh
composer install
npm install
```

### 🔹 **Step 3: Environment Setup**
```sh
cp .env.example .env
php artisan key:generate
```
Update `.env` with database credentials.

### 🔹 **Step 4: Database Configuration**
```sh
php artisan migrate --seed
```


### 🔹 **Step 6: Run the Application**
```sh

php -S 127.0.0.1:12345 server.php

npm start
```

---


