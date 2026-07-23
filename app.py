from flask import Flask, render_template, request, url_for, send_from_directory
import os
import urllib.parse
import urllib.request
from pdf2image import convert_from_path

# 1. టెంప్లేట్స్ ఫోల్డర్ సరిగ్గా సెట్ చేయడం (_file_ తో)
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
app = Flask(__name__, template_folder=template_dir)

# 2. Poppler ఫోల్డర్ పాత్ (మీ సిస్టమ్‌లోని పాత్)
POPPLER_PATH = r'C:\Users\admin\Downloads\Release-26.02.0-0 (1)\poppler-26.02.0\Library\bin'

UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_file_id(drive_url):
    if "id=" in drive_url:
        parsed_url = urllib.parse.urlparse(drive_url)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        return query_params.get('id', [None])[0]
    elif "/d/" in drive_url:
        parts = drive_url.split("/d/")
        if len(parts) > 1:
            return parts[1].split("/")[0]
    return drive_url

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    password = request.form.get('password')
    # ప్రస్తుతం డిఫాల్ట్ పాస్‌వర్డ్ '1234' గా పెట్టాం, అవసరమైతే మార్చుకోవచ్చు
    if password == '1234':
        return render_template('upload.html')
    else:
        return render_template('login.html', error="తప్పు పాస్‌వర్డ్! మరలా ప్రయత్నించండి.")

@app.route('/upload-page')
def upload_page():
    return render_template('upload.html')

@app.route('/process-url', methods=['GET', 'POST'])
def process_url():
    if request.method == 'POST':
        drive_url = request.form.get('drive_url')
    else:
        drive_url = request.args.get('url')

    if not drive_url:
        return "దయచేసి గూగుల్ డ్రైవ్ లింక్ ఇవ్వండి!", 400

    file_id = extract_file_id(drive_url.strip())
    if not file_id:
        return "ఇచ్చిన గూగుల్ డ్రైవ్ లింక్ సరైనది కాదు.", 400

    download_url = f'https://drive.google.com/uc?export=download&id={file_id}'
    pdf_path = os.path.join(UPLOAD_FOLDER, 'downloaded_paper.pdf')

    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        req = urllib.request.Request(download_url, headers=headers)
        
        with urllib.request.urlopen(req) as response:
            content = response.read()
            if b'download_warning' in content:
                download_url = f'https://drive.google.com/uc?export=download&confirm=t&id={file_id}'
                req = urllib.request.Request(download_url, headers=headers)
                with urllib.request.urlopen(req) as resp2:
                    content = resp2.read()

        with open(pdf_path, 'wb') as out_file:
            out_file.write(content)

        # PDF పేజీలను ఇమేజ్‌లుగా మార్చడం
        images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)

        image_filenames = []
        for i, image in enumerate(images):
            image_filename = f'page_{i+1}.jpg'
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            image.save(image_path, 'JPEG')
            image_filenames.append(image_filename)

        # మొదటి పేజీ ఫ్రంట్ పేజీ థంబ్‌నెయిల్ అవుతుంది
        front_page = image_filenames[0] if image_filenames else ''

        return render_template('view_paper.html', images=image_filenames, front_page=front_page)

    except Exception as e:
        error_msg = str(e)
        return f"""
        <div style="font-family: Arial; padding: 20px; text-align: center;">
            <h2 style="color: red;">సమస్య ఎదురైంది!</h2>
            <p><b>సాంకేతిక వివరాలు:</b> {error_msg}</p>
            <p>గూగుల్ డ్రైవ్ ఫైల్‌కి <b>'Anyone with the link'</b> పర్మిషన్ ఉందో లేదో చెక్ చేయండి.</p>
        </div>
        """, 500

@app.route('/send-all-whatsapp', methods=['POST'])
def send_all_whatsapp():
    target = request.form.get('whatsapp_target')
    # ఈ-పేపర్ వెబ్‌సైట్ పేజీ లింక్
    paper_url = request.host_url + "process-url?url=latest"
    message = f"📰 యువగళం దినపత్రిక - ఈరోజు తాజా సంచిక\n\nఈరోజు పూర్తి ఈ-పేపర్ చదవడానికి మరియు వార్తలను క్రాప్ చేయడానికి క్రింది లింక్ క్లిక్ చేయండి:\n👇👇\n{paper_url}"
    encoded_message = urllib.parse.quote(message)

    if target:
        whatsapp_url = f"https://wa.me/{target}?text={encoded_message}"
    else:
        whatsapp_url = f"https://api.whatsapp.com/send?text={encoded_message}"

    return f"""
    <div style="font-family: Arial; padding: 40px; text-align: center;">
        <h2 style="color: green;">🎉 ఈ-పేపర్ వాట్సాప్ లింక్ సిద్ధంగా ఉంది!</h2>
        <br>
        <a href="{whatsapp_url}" target="_blank" style="padding: 15px 30px; background: #25D366; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 18px;">📱 వాట్సాప్‌లో ఓపెన్ చేసి పంపు</a>
        <br><br><br>
        <a href="/upload-page" style="color: #007bff; text-decoration: none; font-size: 16px;">🏠 హోమ్ / అప్‌లోడ్ పేజీకి వెళ్ళండి</a>
    </div>
    """

if __name__ == '__main__':
    app.run(debug=True)