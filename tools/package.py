"""Validate and build the Minecraft add-on using Python 3 and Node.js."""
from pathlib import Path
import hashlib,json,re,subprocess,sys,zipfile
ROOT=Path(__file__).resolve().parents[1]
PACKS=['Jagsbys_Cauldron_BP','Jagsbys_Cauldron_RP']
def parse_jsonc(text):
 text=re.sub(r'"(?:\\.|[^"\\])*"|//[^\n]*|/\*[\s\S]*?\*/',lambda m:'' if m[0].startswith('/') else m[0],text)
 return json.loads(re.sub(r',\s*([}\]])',r'\1',text))
for pack in PACKS:
 for p in (ROOT/pack).rglob('*.json'):parse_jsonc(p.read_text(encoding='utf-8-sig'))
 for p in (ROOT/pack/'scripts').rglob('*.js'):
  subprocess.run(['node','--input-type=module','--check'],input=p.read_text(),text=True,check=True,capture_output=True)
  for match in re.findall(r'from\s+[\'"](\.[^\'"]+)|import\s+[\'"](\.[^\'"]+)',p.read_text()):
   assert (p.parent/next(v for v in match if v)).is_file(),(p,match)
bp=json.loads((ROOT/PACKS[0]/'manifest.json').read_text());rp=json.loads((ROOT/PACKS[1]/'manifest.json').read_text())
assert any(d.get('uuid')==rp['header']['uuid'] and d['version']==rp['header']['version'] for d in bp['dependencies'])
subprocess.run(['node',str(ROOT/'tests/modules.test.mjs')],check=True)
subprocess.run([sys.executable,str(ROOT/'tests/conquest_commerce.test.py')],check=True)
version='.'.join(map(str,bp['header']['version']))
out=ROOT/'downloads'/f'Jagsbys_Cauldron_v{version}.mcaddon'
out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for pack in PACKS:
  for p in sorted((ROOT/pack).rglob('*')):
   if p.is_file():
    info=zipfile.ZipInfo(p.relative_to(ROOT).as_posix(),date_time=(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
    z.writestr(info,p.read_bytes())
with zipfile.ZipFile(out) as z:
 assert z.testzip() is None
 print(f'Validated archive: {len(z.namelist())} files')
digest=hashlib.sha256(out.read_bytes()).hexdigest()
(out.parent/(out.name+'.sha256')).write_text(f'{digest}  {out.name}\n')
print(out);print('SHA256:',digest)
