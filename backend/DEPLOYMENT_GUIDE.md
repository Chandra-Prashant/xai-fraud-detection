Deployment Guide (Render + Vercel)

This guide will walk you through deploying your full-stack XAI application.

Prerequisites

GitHub: Your project (the entire fraud-detection-system folder) must be pushed to a GitHub repository.

Accounts: You need a free account on Render and Vercel.

Dockerfile: Make sure the Dockerfile I provided is inside your backend/ folder.

requirements.txt: Make sure your backend/requirements.txt file is up-to-date with all dependencies (including shap).

Part 1: Deploy the Backend to Render

We deploy the backend first, as we'll need its URL for the frontend.

Go to Render: Log in and go to your Dashboard.

Create Service: Click "New +" and select "Web Service".

Connect Repo: Connect your GitHub account and select your fraud-detection-system repository.

Set Service Details:

Name: fraud-api (or anything you like).

Root Directory: ./backend (This is very important! It tells Render to look inside your backend folder).

Runtime: Docker (Render will see your Dockerfile and automatically use it).

Instance Type: Free.

Create Web Service: Click the "Create Web Service" button.

Render will now start building your backend. It may take 5-10 minutes because it has to install shap and scikit-learn.

Once it's finished, it will be live. Render will give you a public URL, something like:
https://fraud-api-xyz.onrender.com

Copy this URL! You'll need it in the next step.

Part 2: Deploy the Frontend to Vercel

Go to Vercel: Log in and go to your Dashboard.

Add New Project: Click "Add New..." and select "Project".

Import Repo: Find your fraud-detection-system repository and click "Import".

Configure Project:

Root Directory: Click "Edit" and change it to frontend. (This tells Vercel to look inside your frontend folder). Vercel will auto-detect that it's a Next.js app.

Environment Variables: This is the most important step.

Click to expand the "Environment Variables" section.

Create one new variable:

Name: NEXT_PUBLIC_API_URL

Value: https://fraud-api-xyz.onrender.com (Paste the URL you got from Render).

Deploy: Click the "Deploy" button.

Vercel will build your Next.js app, which usually takes about 1-2 minutes.

Part 3: Update lib/api.ts

This is a critical last step. Your frontend code has http://127.0.0.1:8000 hard-coded. We need to make it use your new environment variable.

In VS Code, open frontend/lib/api.ts.

Find this line at the top:

const API_URL = "[http://127.0.0.1:8000](http://127.0.0.1:8000)";


Replace it with this line:

const API_URL = process.env.NEXT_PUBLIC_API_URL || "[http://127.0.0.1:8000](http://127.0.0.1:8000)";


(This tells your app: "Try to use the Vercel URL, but if you can't find it, fall back to the local one.")

Commit and push this one-line change to GitHub. Vercel will see the new commit and automatically redeploy your app.

Part 4: You're Done!

Vercel will give you your final, public URL (e.g., https://my-xai-app.vercel.app).

You can now:

Open this URL and test your fully live, deployed application.

Add this live URL to the README.md file in your GitHub project.

Add this project and its live URL to your CV.