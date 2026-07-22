from flask import Flask, render_template, request, redirect, url_for, session
import os
import time
import platform
from pdf2image import convert_from_path

app = Flask(__name__)
app.secret_key = 'yuva_galam_secret_key_change_this'  # సెషన్ భద్రత కోసం

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'static/output'

# అడ్మిన్ పాస్‌వర్డ్ (మీకు నచ్చినది మార్చుకోవచ్చు)
ADMIN_PASSWORD = 'admin123'

if platform.system() == 'Windows':
    POPLER_PATH = r'C:\Users\admin\Downloads\Release-26.02.0-0 (2)\poppler-26.02.0\Library\bin'
else:
    POPLER_PATH = None

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def cleanup_old_files():
    folders = [UPLOAD_FOLDER, OUTPUT_FOLDER]
    now = time.time()
    fifteen_days_in_seconds = 15 * 24 * 60 * 60

    for folder in folders:
        if os.path.exists(folder):
            for filename in os.listdir(folder):
                file_path = os.path.join(folder, filename)
                if os.path.isfile(file_path):
                    file_age = now - os.path.getmtime(file_path)
                    if file_age > fifteen_days_in_seconds:
                        try:
                            os.remove(file_path)
                        except Exception as e:
                            print(f"Error: {e}")

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form.get('password') == ADMIN_PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            error = 'తప్పు పాస్‌వర్డ్! మళ్లీ ప్రయత్నించండి.'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('index'))

@app.route('/', methods=['GET', 'POST'])
def index():
    cleanup_old_files()
    
    # ఇప్పటికే సేవ్ చేసిన ఇమేజ్‌ల జాబితా (ఆర్కైవ్స్ / పాత పేపర్లు కోసం)
    all_images = []
    if os.path.exists(OUTPUT_FOLDER):
        all_images = sorted(os.listdir(OUTPUT_FOLDER), reverse=True)

    if request.method == 'POST':
        # లాగిన్ ఉంటేనే అప్‌లోడ్ చేయడానికి అనుమతి
        if not session.get('logged_in'):
            return redirect(url_for('login'))
            
        file = request.files.get('file')
        if file:
            pdf_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(pdf_path)
            
            if POPLER_PATH:
                images = convert_from_path(pdf_path, poppler_path=POPLER_PATH)
            else:
                images = convert_from_path(pdf_path)
                
            saved_images = []
            for i, img in enumerate(images):
                img_name = f'page_{int(time.time())}_{i}.png'
                img.save(os.path.join(OUTPUT_FOLDER, img_name), 'PNG')
                saved_images.append(img_name)
                
            return redirect(url_for('index'))

    return render_template('upload.html', images=all_images, logged_in=session.get('logged_in'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)