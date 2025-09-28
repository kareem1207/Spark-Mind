import os
import re
from fpdf import FPDF
from typing import Optional


class PDFGenerator:
	@staticmethod
	def generate_pdf(logo_path: str, title: str, doctor_report: str, output_path: str, disclaimer: str) -> str:
		class StyledPDF(FPDF):
			def header(self):
				if os.path.exists(logo_path):
					try:
						self.image(logo_path, x=15, y=10, w=30)
					except Exception as e:
						print(f"[WARN] Could not add logo: {e}")
				self.set_xy(50, 15)
				self.set_font("Helvetica", "B", 20)
				self.set_text_color(25, 118, 210)  
				self.cell(0, 10, title)
				self.ln(15)
				self.set_draw_color(25, 118, 210)
				self.line(15, 35, 195, 35)
				self.ln(10)

			def footer(self):
				self.set_y(-20)
				self.set_font("Helvetica", "I", 8)
				self.set_text_color(128, 128, 128)
				page_text = f"Page {self.page_no()}"
				self.cell(0, 10, page_text, 0, 0, "C")
		
		pdf = StyledPDF()
		pdf.set_auto_page_break(auto=True, margin=25)
		pdf.add_page()
		pdf.set_left_margin(15)
		pdf.set_right_margin(15)
		
		cleaned_report = PDFGenerator._clean_text_for_pdf(doctor_report)
		lines = cleaned_report.replace('\r\n', '\n').replace('\r', '\n').splitlines()
		
		for line in lines:
			if not line.strip():
				pdf.ln(4)
				continue
				
			clean_line = line.strip()
			if line.startswith('# '):
				PDFGenerator._add_main_heading(pdf, clean_line[2:])
			elif line.startswith('## '):
				PDFGenerator._add_sub_heading(pdf, clean_line[3:])
			elif line.startswith('### '):
				PDFGenerator._add_minor_heading(pdf, clean_line[4:])
			elif line.startswith('**') and line.endswith('**') and len(line) > 4:
				PDFGenerator._add_bold_text(pdf, clean_line[2:-2])
			elif line.startswith('- ') or line.startswith('* '):
				PDFGenerator._add_bullet_point(pdf, clean_line[2:])
			elif line.startswith('[ ] ') or line.startswith('[x] '):
				PDFGenerator._add_checkbox_item(pdf, clean_line[4:])
			elif re.match(r'^\d+\.\s', line):
				PDFGenerator._add_numbered_item(pdf, clean_line)
			else:
				PDFGenerator._add_regular_text(pdf, clean_line)
		pdf.ln(8)
		PDFGenerator._add_separator(pdf)
		pdf.ln(4)
		pdf.set_font("Helvetica", "B", 10)
		pdf.set_text_color(178, 34, 34)  
		pdf.cell(0, 6, "IMPORTANT DISCLAIMER")
		pdf.ln(8)
		
		pdf.set_font("Helvetica", "I", 9)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, PDFGenerator._clean_text_for_pdf(disclaimer), 4)
		
		pdf.output(output_path)
		print(f"[SUCCESS] Professional PDF generated: {output_path}")
		return output_path
	
	@staticmethod
	def _clean_text_for_pdf(text: str) -> str:
		text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  
		text = re.sub(r'\*(.*?)\*', r'\1', text)      
		text = re.sub(r'`(.*?)`', r'\1', text)        
		replacements = {
			'"': '"', '"': '"',  # Smart quotes
			''': "'", ''': "'",  # Smart apostrophes
			'–': '-', '—': '-',  # Em/en dashes
			'…': '...',          # Ellipsis
			'•': '*',            # Bullet point
			'◦': '-',            # White bullet
			'▪': '*',            # Black small square
			'▫': '-',            # White small square
			'☐': '[ ]',          # Checkbox empty
			'☑': '[x]',          # Checkbox checked
			'✓': '[x]',          # Check mark
			'✗': '[x]',          # X mark
			'→': '->',           # Right arrow  
			'←': '<-',           # Left arrow
			'↑': '^',            # Up arrow
			'↓': 'v',            # Down arrow
		}
		
		for old, new in replacements.items():
			text = text.replace(old, new)
		try:
			text.encode('latin-1')
		except UnicodeEncodeError:
			text = text.encode('latin-1', 'ignore').decode('latin-1')
		
		return text
	
	@staticmethod
	def _add_main_heading(pdf: FPDF, text: str):
		pdf.ln(6)
		pdf.set_font("Helvetica", "B", 16)
		pdf.set_text_color(25, 118, 210)  
		PDFGenerator._add_text_with_wrapping(pdf, text, 8)
		pdf.ln(4)
		current_y = pdf.get_y()
		pdf.set_draw_color(25, 118, 210)
		pdf.line(15, current_y - 2, 195, current_y - 2)
		pdf.ln(2)
	
	@staticmethod
	def _add_sub_heading(pdf: FPDF, text: str):
		pdf.ln(5)
		pdf.set_font("Helvetica", "B", 14)
		pdf.set_text_color(33, 150, 243)  # Lighter blue
		PDFGenerator._add_text_with_wrapping(pdf, text, 7)
		pdf.ln(3)
	
	@staticmethod
	def _add_minor_heading(pdf: FPDF, text: str):
		pdf.ln(4)
		pdf.set_font("Helvetica", "B", 12)
		pdf.set_text_color(66, 165, 245)  # Even lighter blue
		PDFGenerator._add_text_with_wrapping(pdf, text, 6)
		pdf.ln(2)
	
	@staticmethod
	def _add_bold_text(pdf: FPDF, text: str):
		"""Add bold text"""
		pdf.set_font("Helvetica", "B", 10)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, text, 5)
		pdf.ln(2)
	
	@staticmethod
	def _add_bullet_point(pdf: FPDF, text: str):
		"""Add a bullet point with proper indentation"""
		pdf.set_font("Helvetica", "", 10)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, f"* {text}", 5, indent=5)
		pdf.ln(1)
	
	@staticmethod
	def _add_checkbox_item(pdf: FPDF, text: str):
		"""Add a checkbox item"""
		pdf.set_font("Helvetica", "", 10)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, f"[ ] {text}", 5, indent=5)
		pdf.ln(1)
	
	@staticmethod
	def _add_numbered_item(pdf: FPDF, text: str):
		"""Add a numbered list item"""
		pdf.set_font("Helvetica", "", 10)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, text, 5, indent=5)
		pdf.ln(1)
	
	@staticmethod
	def _add_regular_text(pdf: FPDF, text: str):
		"""Add regular text with proper spacing"""
		pdf.set_font("Helvetica", "", 10)
		pdf.set_text_color(0, 0, 0)
		PDFGenerator._add_text_with_wrapping(pdf, text, 5)
		pdf.ln(2)
	
	@staticmethod
	def _add_separator(pdf: FPDF):
		"""Add a visual separator line"""
		current_y = pdf.get_y()
		pdf.set_draw_color(200, 200, 200)
		pdf.line(15, current_y, 195, current_y)
	
	@staticmethod
	def _add_text_with_wrapping(pdf: FPDF, text: str, line_height: float, indent: Optional[float] = None):
		"""Add text with proper word wrapping and indentation - handles large data efficiently"""
		if not text.strip():
			return
			
		# Calculate available width (with safety margin to prevent overflow)
		page_width = pdf.w - pdf.l_margin - pdf.r_margin - 5  # 5mm safety margin
		if indent:
			page_width -= indent
		
		# Ensure minimum width
		if page_width < 20:  # Minimum 20mm width
			page_width = 20
			
		# Split text into words
		words = text.split()
		if not words:
			return
		
		current_line = ""
		x_offset = indent if indent else 0
		
		for word in words:
			# Handle very long words that might not fit on a single line
			if len(word) > 50:  # Arbitrary threshold for very long words
				# Split long words at reasonable points
				while len(word) > 50:
					part = word[:50]
					word = word[50:]
					# Process the part as a separate word
					test_line = current_line + (" " if current_line else "") + part
					
					pdf.set_font(pdf.font_family, pdf.font_style, int(pdf.font_size_pt))
					text_width = pdf.get_string_width(test_line)
					
					if text_width <= page_width or not current_line:
						current_line = test_line
					else:
						if current_line:
							pdf.set_x(pdf.l_margin + x_offset)
							pdf.cell(page_width, line_height, current_line, 0, 1)
						current_line = part
			
			# Test if adding this word would exceed the line width
			test_line = current_line + (" " if current_line else "") + word
			
			# Get text width for the test line
			try:
				pdf.set_font(pdf.font_family, pdf.font_style, int(pdf.font_size_pt))
				text_width = pdf.get_string_width(test_line)
			except:
				# Fallback estimation if get_string_width fails
				text_width = len(test_line) * (pdf.font_size_pt * 0.5)
			
			if text_width <= page_width or not current_line:
				# Word fits or it's the first word on the line
				current_line = test_line
			else:
				# Word doesn't fit, print current line and start new one
				if current_line:
					pdf.set_x(pdf.l_margin + x_offset)
					pdf.cell(page_width, line_height, current_line, 0, 1)
				current_line = word
		
		# Print the last line
		if current_line:
			pdf.set_x(pdf.l_margin + x_offset)
			pdf.cell(page_width, line_height, current_line, 0, 1)