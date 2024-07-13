from kafka import KafkaConsumer
import pymongo
import json
from datetime import datetime

# Connect to MongoDB
myclient = pymongo.MongoClient("mongodb+srv://hadil:hadil@cluster0.k8nl53t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mydb = myclient["test"]
mycol1 = mydb["IoT"]

# Set up Kafka consumer to listen to specific topics
consumer = KafkaConsumer('AS.SUPCOM.v1', 'AS.topic.v1', bootstrap_servers='kafka.treetronix.com:9095')

# Process messages from Kafka
for msg in consumer:
    # Decode message value from bytes to string
    msg_value = msg.value.decode('utf-8')
    
    # Load JSON data from the message
    data = json.loads(msg_value)
    
    # Extract 'DevEUI_uplink' data
    deveui_uplink = data.get("DevEUI_uplink", {})
    
    # Decode the payload_hex field
    payload_hex = deveui_uplink.get('payload_hex', '')
    
    # Extract temperature and humidity from the payload bytes
    raw_temp = payload_hex[0:4]
    raw_humid = payload_hex[4:8]
    
    # Convert raw temperature and humidity to integers
    temperature = (int(raw_temp, 16))/100
    humidity = (int(raw_humid, 16))/100
    
    # Extract DevEUI
    deveui = deveui_uplink.get('DevEUI', '')
    
    # Extract date and time
    time_value = deveui_uplink.get('Time', '')
    time_dt = datetime.strptime(time_value, '%Y-%m-%dT%H:%M:%S.%f+00:00')
    
    # Add decoded values to the MongoDB document
    document_to_insert = {
        "DevEUI": deveui,
        "Temperature": temperature,
        "Humidity": humidity,
        "DateTime": time_dt.strftime('%Y-%m-%d %H:%M:%S')  # Format date and time
    }
    
    # Insert the document into the 'IoT' collection
    insert_result = mycol1.insert_one(document_to_insert)
    
    # Print the inserted document's ID (for debugging purposes)
    print(f"Inserted document ID: {insert_result.inserted_id}")
