from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root.parent / 'tmp/adure-source-review'
target = root / 'dist/assets'
target.mkdir(parents=True, exist_ok=True)
images = {
    'architecture-close': 'profile-p01-image01.png',
    'architecture-waterfront': 'profile-p11-image03.png',
    'architecture-curves': 'profile-p11-image14.png',
    'architecture-detail': 'profile-p11-image16.png',
    'architecture-courtyard': 'profile-p11-image23.png',
    'architecture-city': 'profile-p11-image01.png',
    'architecture-facade': 'profile-p11-image21.png',
    'architecture-windows': 'profile-p11-image09.png',
    'architecture-palms': 'profile-p11-image17.png',
    'architecture-terraces': 'profile-p11-image07.png',
    'architecture-community': 'profile-p11-image19.png',
    'architecture-horizon': 'profile-p11-image05.png',
}
for name, original in images.items():
    image = Image.open(source/original).convert('RGB')
    image.save(target/f'{name}.webp', quality=88, method=6)
    small = image.copy()
    small.thumbnail((600,900))
    small.save(target/f'{name}-small.webp', quality=84, method=6)
    print(name, image.size)
# Retain every supplied vector path. Trim only the oversized artboard, leaving
# an eight-unit margin around the original artwork for consistent clearspace.
logo_source = Path('/Users/designer/E8/ADURE/adurelogosprofileandbrandguidelines/ADURE Logo Acronym with Bilingual Blue SVG.svg')
logo = logo_source.read_text().replace('viewBox="0 0 262.48 222.73"', 'viewBox="82 40 99 142"')
(target/'adure-logo.svg').write_text(logo)
