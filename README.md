http://image-resizer-buc-ket.s3-website.ap-south-1.amazonaws.com
# 🖼️ Serverless Image Resizer using AWS Lambda & Amazon S3

## 📌 Project Overview

The **Serverless Image Resizer** is a cloud-based application that automatically resizes images uploaded by users without managing any servers. Users can upload an image through a web interface, select a resize quality (**Low**, **Medium**, or **High**), and the application resizes the image using **AWS Lambda**. Both the original and resized images are stored in **Amazon S3**, and the application displays image details along with download and preview options.

---

# 🎯 Project Objectives

- Upload images using a web interface.
- Automatically resize images using AWS Lambda.
- Store original and resized images in Amazon S3.
- Display image information.
- Allow users to preview and download resized images.
- Build a fully serverless application using AWS.

---

# 🏗️ Architecture

```
                    User

                      │

                      ▼

          Static Website (Amazon S3)

                      │

          Select Image & Resize Option

                      │

                      ▼

                API Gateway

                      │

                      ▼

                AWS Lambda

          ┌───────────┴────────────┐

          │                        │

          ▼                        ▼

 Upload Original Image      Resize Image

          │                        │

          └───────────┬────────────┘

                      ▼

                Amazon S3 Bucket

        original/            resized/

                      │

                      ▼

           Return Image Details

                      │

                      ▼

           Display on Website
```

---

# ☁️ AWS Services Used

- AWS Lambda
- Amazon S3
- Amazon API Gateway
- IAM
- CloudWatch Logs

---

# 💻 Technologies Used

- Python 3.x
- Pillow (PIL)
- HTML5
- CSS3
- JavaScript
- AWS SDK (Boto3)

---

# 📂 Project Structure

```
ServerlessImageResizer/

│
├── lambda_function.py
├── requirements.txt
├── README.md
│
├── website/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── images/
```

---

# 📁 S3 Bucket Structure

```
serverless-image-resizer-bucket/

│
├── original/
│
├── resized/
│
└── website/
```

---

# ⚙️ Working Flow

### Step 1

User opens the website.

---

### Step 2

User selects an image.

---

### Step 3

User chooses the resize quality.

- Low
- Medium
- High

---

### Step 4

The frontend converts the image into Base64.

---

### Step 5

The image is sent to API Gateway.

---

### Step 6

API Gateway invokes AWS Lambda.

---

### Step 7

Lambda decodes the image.

---

### Step 8

Lambda uploads the original image to Amazon S3.

---

### Step 9

Lambda resizes the image using Pillow.

---

### Step 10

Lambda uploads the resized image to Amazon S3.

---

### Step 11

Lambda calculates:

- Original Size
- Resized Size
- Compression Percentage
- Processing Time
- Resolution
- Upload Time

---

### Step 12

Lambda returns the response to the frontend.

---

### Step 13

The website displays:

- Original Image
- Resized Image
- Image Details
- Download Button
- View Full Image

---

# 🚀 Features

- Upload Images
- Automatic Image Resizing
- Three Resize Levels
  - Low
  - Medium
  - High
- Store Original Images
- Store Resized Images
- Image Preview
- Download Resized Image
- View Full Image
- Image Information Card
- Compression Statistics
- Responsive Design
- Fully Serverless Architecture

---

# 📊 Image Details Displayed

The application displays:

- File Name
- Image Format
- Original Resolution
- Resized Resolution
- Original File Size
- Resized File Size
- Saved Size
- Compression Percentage
- Processing Time
- Upload Time
- Resize Quality

---

# 📷 Supported Image Formats

- JPG
- JPEG
- PNG

---

# 📥 API Request

```json
{
  "filename": "nature.jpg",
  "resize": "medium",
  "image": "Base64EncodedImage"
}
```

---

# 📤 API Response

```json
{
  "message": "Image resized successfully",
  "fileName": "nature.jpg",
  "imageFormat": "JPEG",
  "quality": "Medium",
  "originalWidth": 1920,
  "originalHeight": 1080,
  "resizedWidth": 640,
  "resizedHeight": 360,
  "originalSizeKB": 2450.50,
  "resizedSizeKB": 325.40,
  "savedSizeKB": 2125.10,
  "compressionPercentage": 86.73,
  "processingTime": "0.42 Seconds",
  "uploadTime": "17 Jul 2026 03:45 PM",
  "originalImage": "...",
  "resizedImage": "...",
  "downloadURL": "..."
}
```

---

# ▶️ How to Run

### 1. Create an S3 Bucket

Create folders:

```
original/
resized/
website/
```

---

### 2. Create Lambda Function

- Runtime: Python 3.13
- Upload `lambda_function.py`
- Add Pillow Layer (or include Pillow in the deployment package)

---

### 3. Configure IAM Role

Grant permissions for:

- Amazon S3
- CloudWatch Logs

---

### 4. Create HTTP API Gateway

Create:

```
POST /upload
```

Enable CORS.

---

### 5. Upload Frontend

Upload:

- index.html
- style.css
- script.js

to the S3 bucket configured for static website hosting.

---

### 6. Update API URL

Replace the placeholder API URL in `script.js` with your deployed API Gateway endpoint.

---

### 7. Open the Website

Access the S3 Static Website endpoint in your browser.

---

# 📸 Sample Output
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0eb7b4b4-d644-441a-a0d5-00babd1ff6cb" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2f3c0be7-a720-44b1-93e0-46943285346a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/63490c2d-9a18-4618-a36e-48e23ffab954" />



---

# 🔒 IAM Permissions Required

- AmazonS3FullAccess (or least-privilege equivalent)
- AWSLambdaBasicExecutionRole

---

# 📈 Future Enhancements

- Multiple image upload
- Custom width and height
- Crop and rotate images
- Watermark support
- Image filters
- WebP conversion
- Thumbnail generation
- Image history using DynamoDB
- User authentication with Amazon Cognito
- CloudFront CDN integration
- Drag-and-drop image upload

---

# 👨‍💻 Author

**Serverless Image Resizer**

Developed using **AWS Lambda, Amazon S3, API Gateway, Python, Pillow, HTML, CSS, and JavaScript** to demonstrate a fully serverless image processing application.
