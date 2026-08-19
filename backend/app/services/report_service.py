import os
import hashlib
import io
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import qrcode
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

# Report store dictionary for verification (Report ID -> Data)
REPORT_REGISTRY: Dict[str, Dict[str, Any]] = {}


class ReportService:
    """Generates PDF demo verification reports with SHA-256 integrity hashes and verification links."""

    @staticmethod
    def generate_pdf_report(
        report_id: str,
        parcel: Dict[str, Any],
        verification: Dict[str, Any],
        base_url: str = "http://localhost:3000"
    ) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Heading1"],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor("#0F172A"),
        )
        subtitle_style = ParagraphStyle(
            "SubTitleStyle",
            parent=styles["Normal"],
            fontSize=10,
            textColor=colors.HexColor("#475569"),
        )
        disclaimer_style = ParagraphStyle(
            "DisclaimerStyle",
            parent=styles["Normal"],
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#B91C1C"),
            backColor=colors.HexColor("#FEF2F2"),
            borderPadding=8,
        )

        elements = []

        # Header Title
        elements.append(Paragraph("<b>BhoomiVerify</b> Land Verification Report", title_style))
        elements.append(Paragraph("Mapping Land. Connecting Records. Improving Transparency.", subtitle_style))
        elements.append(Spacer(1, 10))

        # Demo Disclaimer Banner
        disclaimer_text = (
            "<b>DEMO / SYNTHETIC DATA NOTICE:</b> This report is generated using synthetic demonstration data "
            "for prototype evaluation. It DOES NOT establish legal ownership, land title, registration status, or "
            "encumbrance of any real property."
        )
        elements.append(Paragraph(disclaimer_text, disclaimer_style))
        elements.append(Spacer(1, 15))

        # Report Metadata & QR Code
        verify_url = f"{base_url}/verify-report/{report_id}"
        qr = qrcode.QRCode(box_size=3, border=1)
        qr.add_data(verify_url)
        qr.make(fit=True)
        qr_img_buffer = io.BytesIO()
        qr_img = qr.make_image(fill_color="black", back_color="white")
        qr_img.save(qr_img_buffer, format="PNG")
        qr_img_buffer.seek(0)

        meta_data = [
            [
                Paragraph(f"<b>Report ID:</b> {report_id}<br/>"
                          f"<b>Generated At:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}<br/>"
                          f"<b>Parcel UID:</b> {parcel['parcel_uid']}<br/>"
                          f"<b>Location:</b> {parcel['village']}, {parcel['tehsil']}, {parcel['district']}, {parcel['state']}", styles["Normal"]),
                Image(qr_img_buffer, width=70, height=70),
            ]
        ]
        meta_table = Table(meta_data, colWidths=[440, 100])
        meta_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LINEBELOW', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 15))

        # Score & Status Box
        score = verification.get("score", 0)
        status_text = verification.get("status", "UNKNOWN")
        status_color = colors.HexColor("#166534") if score >= 80 else colors.HexColor("#991B1B")

        score_data = [
            [
                Paragraph("<b>Consistency Score</b>", styles["Heading3"]),
                Paragraph("<b>Verification Status</b>", styles["Heading3"]),
            ],
            [
                Paragraph(f"<font size=24 color='{status_color.hexval()}'><b>{score} / 100</b></font>", styles["Normal"]),
                Paragraph(f"<font size=14 color='{status_color.hexval()}'><b>{status_text}</b></font>", styles["Normal"]),
            ]
        ]
        score_table = Table(score_data, colWidths=[270, 270])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
            ('PADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(score_table)
        elements.append(Spacer(1, 15))

        # Parcel Details Table
        elements.append(Paragraph("<b>Land Parcel Details</b>", styles["Heading2"]))
        parcel_info = [
            ["State", parcel["state"], "District", parcel["district"]],
            ["Tehsil", parcel["tehsil"], "Village", parcel["village"]],
            ["Survey Number", parcel.get("survey_number") or "N/A", "Khasra Number", parcel.get("khasra_number") or "N/A"],
            ["Plot Number", parcel.get("plot_number") or "N/A", "Khata Number", parcel.get("khata_number") or "N/A"],
            ["Calculated Spatial Area", f"{parcel['area_sq_m']:.2f} sq.m", "Perimeter", f"{parcel['perimeter_m']:.2f} m"],
            ["Land Use", parcel.get("land_use", "Agricultural"), "Geometry Status", "VALID" if parcel.get("is_geometry_valid") else "INVALID"],
        ]
        p_table = Table(parcel_info, colWidths=[135, 135, 135, 135])
        p_table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor("#F1F5F9")),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
        ]))
        elements.append(p_table)
        elements.append(Spacer(1, 15))

        # Verification Findings
        elements.append(Paragraph("<b>Detailed Findings & Risk Explanation</b>", styles["Heading2"]))
        findings = verification.get("findings", [])
        if not findings:
            elements.append(Paragraph("No record discrepancies or anomalies detected in demo data.", styles["Normal"]))
        else:
            finding_rows = [["Category", "Severity", "Message", "Score Impact"]]
            for f in findings:
                finding_rows.append([
                    f.get("category", "GENERAL"),
                    f.get("severity", "INFO"),
                    Paragraph(f.get("message", ""), styles["Normal"]),
                    str(f.get("score_impact", 0)),
                ])
            f_table = Table(finding_rows, colWidths=[100, 80, 280, 80])
            f_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ('PADDING', (0, 0), (-1, -1), 6),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
            ]))
            elements.append(f_table)

        elements.append(Spacer(1, 20))
        elements.append(Paragraph(f"Report Cryptographic Verification Hash (SHA-256):", styles["Heading4"]))

        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        # Compute SHA-256 Hash
        hash_sha256 = hashlib.sha256(pdf_bytes).hexdigest()

        # Save to registry
        REPORT_REGISTRY[report_id] = {
            "report_id": report_id,
            "parcel_uid": parcel["parcel_uid"],
            "generated_at": datetime.now(timezone.utc),
            "verification_status": verification.get("status", "UNKNOWN"),
            "consistency_score": verification.get("score", 0),
            "hash_sha256": hash_sha256,
        }

        return pdf_bytes
