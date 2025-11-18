# 1. Use an official Python runtime as a parent image
FROM python:3.10-slim

# 2. Set the working directory in the container
WORKDIR /code

# 3. Install system-level packages.
# build-essential is needed for compiling some of the C dependencies
# in our ML libraries (like numpy or shap)
RUN apt-get update && apt-get install -y build-essential

# 4. Copy the requirements file
COPY ./requirements.txt /code/requirements.txt

# 5. Install Python dependencies
# We use --no-cache-dir to keep the image size smaller
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r /code/requirements.txt

# 6. Copy your application code and AI models
COPY ./app /code/app
COPY ./saved_model /code/saved_model

# 7. Expose the port the app runs on (FastAPI default is 8000)
EXPOSE 8000

# 8. Define the command to run your app
# We use 0.0.0.0 to allow traffic from outside the container
# We don't use --reload in production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]