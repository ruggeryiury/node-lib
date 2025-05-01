from pathlib import Path
import os

def create_exports_src() -> None:
  source_path = 'src'
  for root, dirs, files in os.walk(source_path):
    if root != source_path:
      continue
    
    for module_name in dirs:
      if module_name == "@types":
        continue
      
      module_folder = Path(f"{root}/{module_name}")
      module_ts_file = Path(f"{root}/{module_name}.ts")
      content = ""
      
      for mod_root, mod_dir, mod_files in os.walk(module_folder):
        mod_files = [a[0:-3] for a in mod_files if a.endswith('.ts')]
        if len(mod_files) == 0:
          continue
        
        for mod_file in mod_files:
          content += "export * from './"
          content += mod_root.replace('\\', '/')[4:]
          content += "/"
          content += mod_file
          content += "'\n"
          
      if len(content) > 0:
        f = open(module_ts_file, 'w')
        f.write(content)
        f.close()
        
        
  # folders = ['./src/config', './src/core', './src/lib']
  # for folder in folders:
  #   folder_path = Path(folder)
  #   folder_path_ts = Path(f"src/{folder_path.name}.ts")
  #   ts = open(folder_path_ts, 'w')
  #   for root, dirs, files in os.walk(folder_path.absolute()):
  #     for file in files:
  #       new_export = file.replace('.ts', '')
  #       ts.write(f"export * from './{folder_path.name}/{new_export}'\n")

  #   ts.close()

  # return

if __name__ == "__main__":
  create_exports_src()
