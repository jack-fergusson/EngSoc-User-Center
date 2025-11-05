# 1️⃣ Use the Node 18 image as the base
FROM node:18

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy dependency files first and install dependencies
COPY package*.json ./
RUN npm install

# 4️⃣ Copy the rest of your code into the container
COPY . .

# 5️⃣ Expose the port your gateway runs on (for reference)
EXPOSE 4000

# 6️⃣ Define the command to start your gateway
CMD ["npm", "run", "start"]
