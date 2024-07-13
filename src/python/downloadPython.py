import requests
import pymongo

# Connexion à MongoDB
myclient = pymongo.MongoClient(
    "mongodb+srv://hadil:hadil@cluster0.k8nl53t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mydb = myclient["test"]
mycol = mydb["devices"]

# Extraction des informations des devices
devices = list(mycol.find({}, {"_id": 0, "deveui": 1, "onoff": 1}))

# Configuration de l'API
TPWAPIURL = "https://api-iot.gnet.tn"
FPort = "2"

# Envoi des requêtes pour chaque device avec onoff
for device in devices:
    if 'onoff' not in device:
        continue  # Ignorer le device si onoff n'existe pas

    DevEUI = device['deveui']
    Payload = device['onoff']

    # Construction de la QueryString pour chaque device
    QueryString = f"DevEUI={DevEUI}&FPort={FPort}&Payload={Payload}"
    
    # Construction de l'URL complète
    SendDownlinkURL = f"{TPWAPIURL}/thingpark/lrc/rest/downlink?{QueryString}"
    
    # Configuration des headers
    SendDownlinkHeaders = {'Content-Type': 'application/x-www-form-urlencoded'}
    
    # Envoi de la requête POST
    SendDownlinkResponse = requests.post(
        SendDownlinkURL,
        headers=SendDownlinkHeaders
    )
    
    # Affichage des détails de la requête et de la réponse
    print("#1 - Send Downlink")
    print("URL:", SendDownlinkURL)
    print("Headers:", SendDownlinkHeaders)
    print("Response:", SendDownlinkResponse)
    print("Response Text:", SendDownlinkResponse.text)
    print("Cookies:", SendDownlinkResponse.cookies)

    # Vérification de l'état de la réponse
    if SendDownlinkResponse.status_code != 200:
        print(f"Erreur d'envoi pour le device {DevEUI}: {SendDownlinkResponse.text}")
    else:
        print(f"Requête envoyée avec succès pour le device {DevEUI}")
