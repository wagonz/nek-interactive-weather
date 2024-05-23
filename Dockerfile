# Start your image with a node base image
FROM node:18 

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages, install serve, build the app.
RUN npm install --only=production

COPY . .

# Copy local directories to the current local directory of our docker image (/app)
COPY ./public ./public

EXPOSE 3000

# Command to run the app
CMD ["npm","start"]

