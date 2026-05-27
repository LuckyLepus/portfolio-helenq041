import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_pptx(file_path):
    try:
        z = zipfile.ZipFile(file_path)
        slides = [f for f in z.namelist() if f.startswith('ppt/slides/slide')]
        texts = []
        for s in slides:
            root = ET.fromstring(z.read(s))
            for elem in root.iter():
                if elem.tag.endswith('}t') and elem.text:
                    texts.append(elem.text)
        print('\n'.join(texts))
    except Exception as e:
        print(f"Error: {e}")

extract_pptx(r"C:\Users\Blood\OneDrive\桌面\失败案例复盘.pptx")
