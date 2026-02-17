import datetime
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# --- CONFIGURATION GHOSTMETA ---
# Note: On force les www pour correspondre à l'indexation réelle
SITE_URL = "https://www.ghostmeta.online/"
CREDENTIALS_FILE = "credentials.json"
PAGES_TO_WATCH = [
    "", # Page d'accueil
    "blog/vinted-securite-photo-guide",
    "blog/supprimer-exif-iphone-android",
    "blog/comprendre-donnees-exif-gps",
    "blog/nettoyage-photo-local-vs-cloud",
    "blog/ghostmeta-manifeste-confidentialite"
]

def check_indexing():
    # Vérification de la présence de la clé API avant de commencer
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"\033[91m[CRITICAL ERROR]\033[0m Le fichier '{CREDENTIALS_FILE}' est absent.")
        print("Action requise : Place ton fichier JSON de clé Google dans ce dossier.")
        return

    try:
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, 
            scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )
        service = build('searchconsole', 'v1', credentials=creds)

        print(f"\n[GHOSTMETA MONITOR] --- RAPPORT D'INDEXATION : {datetime.date.today()} ---")
        print(f"Cible : {SITE_URL}\n")
        
        for page in PAGES_TO_WATCH:
            full_url = f"{SITE_URL}{page}"
            request = {
                'inspectionUrl': full_url,
                'siteUrl': SITE_URL,
                'languageCode': 'fr-FR'
            }
            
            try:
                res = service.urlInspection().index().inspect(body=request).execute()
                result = res.get('inspectionResult', {})
                index_status = result.get('indexStatusResult', {})
                
                verdict = index_status.get('verdict', 'UNKNOWN')
                coverage = index_status.get('coverageState', 'NON_INDEXE')
                last_crawl = index_status.get('lastCrawlTime', 'JAMAIS')

                # Code couleur : Vert (PASS) / Rouge (FAIL/PARTIAL)
                color = "\033[92m" if verdict == "PASS" else "\033[91m"
                
                print(f"{color}● [{verdict}]\033[0m {page if page else '/'}")
                if verdict != "PASS":
                    print(f"  └─ État : {coverage}")
                    if last_crawl != 'JAMAIS':
                        print(f"  └─ Dernier passage bot : {last_crawl}")
            except Exception as e:
                 print(f"\033[93m[WARN]\033[0m Erreur sur {page}: {str(e).split('content')[0]}...")

    except Exception as e:
        print(f"\033[91m[FATAL]\033[0m Erreur globale : {e}")

if __name__ == "__main__":
    check_indexing()
