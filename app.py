import os
from flask import Flask, render_template, send_from_directory

# Root folder నే Templates & Static Folder గా ఉపయోగిస్తున్నాం
app = Flask(__name__, template_folder='.', static_folder='.')

@app.route('/')
def home():
    return render_template('index.html')

# Static ఫైళ్లు (logo.png.jpg లాంటివి) లోడ్ అవ్వడానికి
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
