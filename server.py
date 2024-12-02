#For creating the server component, I chose to use python. 
#For the AWS SDK connection and queries I used the boto3 depnedency - https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
#I used boto3 to interact with the AWS CloudWatch (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-cloudwatch.html)
#This allows me to get info about computer metrics and specifically about the CPU usage.
#Eventually using flask i "pushed" the data to the frontend website, and also "pulled" the input from it.

import boto3
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

#Load the environment variables from .env file - the aws secret access key.
load_dotenv()

#Initialize the flask app to communicate with the frontend
app = Flask(__name__)
CORS(app)

#Initialize an aws session to avoid code doubling for aws access
session = boto3.Session(
    aws_access_key_id="AKIA6G4NF3L2T332PDFD",
    aws_secret_access_key=os.getenv("aws_secret_access_key"),
    region_name='us-east-1'
)
#Initialize the boto client for cloudwatch
cloudwatch = session.client('cloudwatch')
ec2 = session.client('ec2')

#Get the instance id from the ip adress
def get_instance_id_from_ip(ip_address):
    response = ec2.describe_instances(
        Filters=[{'Name': 'private-ip-address', 'Values': [ip_address]}]
    )
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            return instance['InstanceId']
    return None

#A function to get the CPU usage over time from the cloudwatch 
def get_cpu_usage(ip_address,start_time, end_time, interval):
    instance = get_instance_id_from_ip(ip_address)
    if not instance:
        return {"error": f"No instance found for IP {ip_address}"}
    response = cloudwatch.get_metric_statistics(
    Namespace='AWS/EC2',          
    MetricName='CPUUtilization',  
    Dimensions=[{'Name': 'InstanceId', 'Value': instance}],
    StartTime=start_time,         
    EndTime=end_time,             
    Period=interval,               
    Statistics=['Average'])
    return sorted(response["Datapoints"], key=lambda x: x["Timestamp"])


#API endpoint to communicate with the frontend
@app.route('/get-cpu-usage', methods=['GET'])
def fetch_cpu_usage():
    #get input data from frontend
    ip_address = request.args.get('ip_address')
    start_time = request.args.get('start_time') 
    end_time = request.args.get('end_time')  
    interval = int(request.args.get('interval', 300)) 
    
    
    if not start_time or not end_time:
        return jsonify({"error": "start_time and end_time are required"}), 400
    
    try:
        start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({"error": "Invalid time format"}), 400
    
    data = get_cpu_usage(ip_address, start_time, end_time, interval)
    
    if isinstance(data, list):
        return jsonify(data)
    else:
        return jsonify(data), 400 

if __name__ == '__main__':
    app.run(debug=True)
