import os
from fpdf import FPDF


class PDFGenerator:

	@staticmethod
	def generate_pdf(logo_path: str, title: str, doctor_report: str, output_path: str, disclaimer: str) -> str:
		pdf = FPDF()
		pdf.add_page()
		
		if os.path.exists(logo_path):
			try:
				pdf.image(logo_path, x=10, y=8, w=25)
			except Exception as e:
				print(f"[WARN] Could not add logo: {e}")
		pdf.set_xy(40, 10)
		pdf.set_font("Helvetica", "B", 16)
		pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
		pdf.set_font("Helvetica", size=10) 
		pdf.ln(4)
		lines = doctor_report.replace('\r\n', '\n').replace('\r', '\n').splitlines()
		
		for line in lines:
			if not line.strip():
				pdf.ln(3)
				continue
			if line.startswith('# '):
				pdf.set_font("Helvetica", "B", 14)
				clean_line = line[2:].strip()
			elif line.startswith('## '):
				pdf.set_font("Helvetica", "B", 12)
				clean_line = line[3:].strip()
			elif line.startswith('**') and line.endswith('**'):
				pdf.set_font("Helvetica", "B", 10)
				clean_line = line[2:-2].strip()
			else:
				pdf.set_font("Helvetica", size=10)
				clean_line = line.strip()
			clean_line = clean_line.encode('latin-1', 'ignore').decode('latin-1')
			max_chars = 90  
			if len(clean_line) > max_chars:
				words = clean_line.split(' ')
				current_line = ""
				
				for word in words:
					if len(current_line + word + " ") <= max_chars:
						current_line += word + " "
					else:
						if current_line.strip():
							pdf.multi_cell(0, 5, current_line.strip())
						current_line = word + " "
				if current_line.strip():
					pdf.multi_cell(0, 5, current_line.strip())
			else:
				pdf.multi_cell(0, 5, clean_line)
		pdf.ln(4)
		pdf.set_font("Helvetica", "I", 9)
		disclaimer_clean = disclaimer.encode('latin-1', 'ignore').decode('latin-1')
		pdf.multi_cell(0, 4, disclaimer_clean)
		
		pdf.output(output_path)
		print(f"[SUCCESS] PDF generated: {output_path}")
		return output_path