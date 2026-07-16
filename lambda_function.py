import json
import boto3
import base64
import uuid
import time
from io import BytesIO
from datetime import datetime
from PIL import Image

# ==========================
# AWS Client
# ==========================

s3 = boto3.client("s3")

# ==========================
# Configuration
# ==========================

BUCKET_NAME = "image-resizer-buc-ket"

# ==========================
# Response Function
# ==========================

def response(status, body):

    return {

        "statusCode": status,

        "headers": {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": "*",

            "Access-Control-Allow-Headers": "*",

            "Access-Control-Allow-Methods": "*"

        },

        "body": json.dumps(body)

    }


# ==========================
# Lambda Handler
# ==========================

def lambda_handler(event, context):

    start_time = time.time()

    try:

        # Handle OPTIONS Request

        if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":

            return response(200, {"message": "CORS OK"})

        body = json.loads(event["body"])

        filename = body["filename"]

        resize = body["resize"].lower()

        image_base64 = body["image"]

        # Remove Base64 Header

        if "," in image_base64:

            image_base64 = image_base64.split(",")[1]

        image_bytes = base64.b64decode(image_base64)

        image = Image.open(BytesIO(image_bytes))

        # ==========================
        # Original Image Details
        # ==========================

        original_width, original_height = image.size

        image_format = image.format

        if image_format is None:

            image_format = "JPEG"

        original_size = round(len(image_bytes) / 1024, 2)

        extension = filename.split(".")[-1]

        unique_name = str(uuid.uuid4()) + "." + extension

        original_key = "original/" + unique_name

        s3.put_object(

            Bucket=BUCKET_NAME,

            Key=original_key,

            Body=image_bytes,

            ContentType=f"image/{extension.lower()}"

        )

        print("Original Image Uploaded")

                # ==========================
        # Resize Image
        # ==========================

        if resize == "low":

            width = 320
            height = 240

        elif resize == "medium":

            width = 640
            height = 480

        elif resize == "high":

            width = 1280
            height = 720

        else:

            return response(

                400,

                {

                    "error": "Resize option must be low, medium or high."

                }

            )

        # Copy Original Image

        resized_image = image.copy()

        # Preserve Aspect Ratio

        resized_image.thumbnail(

            (width, height),

            Image.Resampling.LANCZOS

        )

        # Resized Image Dimensions

        resized_width, resized_height = resized_image.size

        # Save Resized Image to Memory

        output = BytesIO()

        if image_format.upper() == "PNG":

            resized_image.save(

                output,

                format="PNG"

            )

            content_type = "image/png"

        else:

            if resized_image.mode in ("RGBA", "P"):

                resized_image = resized_image.convert("RGB")

            resized_image.save(

                output,

                format="JPEG",

                quality=90

            )

            content_type = "image/jpeg"

        output.seek(0)

        # ==========================
        # Resized Image Statistics
        # ==========================

        resized_size = round(

            len(output.getvalue()) / 1024,

            2

        )

        saved_size = round(

            original_size - resized_size,

            2

        )

        if original_size > 0:

            compression = round(

                (saved_size / original_size) * 100,

                2

            )

        else:

            compression = 0

        # Upload Time

        upload_time = datetime.now().strftime(

            "%d %b %Y %I:%M:%S %p"

        )

        # Upload Resized Image

        resized_key = (

            "resized/"

            + resize

            + "_"

            + unique_name

        )

        s3.put_object(

            Bucket=BUCKET_NAME,

            Key=resized_key,

            Body=output.getvalue(),

            ContentType=content_type

        )

        print("Resized Image Uploaded")

        # Processing Time

        processing_time = round(

            time.time() - start_time,

            3

        )

        # Generate URLs

        original_url = (

            f"https://{BUCKET_NAME}.s3.amazonaws.com/{original_key}"

        )

        resized_url = (

            f"https://{BUCKET_NAME}.s3.amazonaws.com/{resized_key}"

        )

        download_url = resized_url

                # ==========================
        # Success Response
        # ==========================

        return response(

            200,

            {

                "message": "Image resized successfully",

                "fileName": filename,

                "imageFormat": image_format,

                "quality": resize.capitalize(),

                "originalWidth": original_width,

                "originalHeight": original_height,

                "resizedWidth": resized_width,

                "resizedHeight": resized_height,

                "originalSizeKB": original_size,

                "resizedSizeKB": resized_size,

                "savedSizeKB": saved_size,

                "compressionPercentage": compression,

                "processingTime": f"{processing_time} Seconds",

                "uploadTime": upload_time,

                "originalImage": original_url,

                "resizedImage": resized_url,

                "downloadURL": download_url,

                "originalKey": original_key,

                "resizedKey": resized_key

            }

        )

    except Exception as e:

        print("ERROR :", str(e))

        return response(

            500,

            {

                "message": "Image Resize Failed",

                "error": str(e)

            }

        )