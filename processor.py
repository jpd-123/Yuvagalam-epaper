from PIL import Image

# ఒక కొత్త ఖాళీ ఇమేజ్‌ని క్రియేట్ చేయడం
img = Image.new('RGB', (800, 400), color = (73, 109, 137))

# దీన్ని 'test_image.png' పేరుతో సేవ్ చేయడం
img.save('test_image.png')

print("ఇమేజ్ విజయవంతంగా క్రియేట్ అయ్యింది!")