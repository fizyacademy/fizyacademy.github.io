import random
import re
from slugify import slugify

# توليد كود فريد للفيديو
def generate_unique_video_code():
    from models import Video
    while True:
        code = "#" + ''.join([str(random.randint(0, 9)) for _ in range(15)])
        if not Video.query.filter_by(video_code=code).first():
            return code

# تحويل عربي إلى فرانكو
def arabic_to_franco(text):
    replacements = {
        "أ": "a", "ا": "a", "ب": "b", "ت": "t", "ث": "th", "ج": "g", "ح": "7", "خ": "5",
        "د": "d", "ذ": "z", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s",
        "ض": "d", "ط": "t", "ظ": "z", "ع": "3", "غ": "gh", "ف": "f", "ق": "2",
        "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "w", "ي": "y",
        "ء": "", "ئ": "y", "ؤ": "w", "ى": "a", "ة": "a"
    }

    for arabic, latin in replacements.items():
        text = text.replace(arabic, latin)

    return re.sub(r"[^\w\s-]", "", text).lower()

# توليد slug من العنوان + المحاضرة + القسم + رقم عشوائي
def generate_video_slug(title, lecture_name="", section_name=""):
    slug_lecture = slugify(arabic_to_franco(lecture_name))
    slug_section = slugify(arabic_to_franco(section_name))
    slug_title = slugify(arabic_to_franco(title))
    rand_suffix = str(random.randint(100, 999))

    parts = [slug_lecture, slug_section, f"{slug_title}-{rand_suffix}"]
    return "/".join(filter(None, parts))
