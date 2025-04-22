import { FormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import html2pdf from "html2pdf.js";
import { CommonModule } from "@angular/common";

interface IPaper {
  orientaion: string;
  dpiClass: string;
  dpiHeight: number | null;
  dpiWidth: number | null;
  pageHeight: number | null;
  pageWidth: number | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'article-pdf-generator-angular';

  paper: IPaper = {
    orientaion: "portrait",
    dpiClass: "",
    dpiHeight: null,
    dpiWidth: null,
    pageHeight: null,
    pageWidth: null
  }

  orientation: string = "portrait";

  ngOnInit() {
    this._calculateDisplayDpi();
  }

  onChangeOrientation(): void {
    this.paper.orientaion = this.orientation;
  }

  onExportPdf(): void {
    const pageBreak = { mode: 'css', before: '.before', after: '.after', avoid: '.avoid' };
    let options = {
      filename: "",
      image: { type: 'jpeg', quality: 1, margin: 0 },
      html2canvas: { scale: 2, dpi: this.paper.dpiHeight, logging: true, scrollX: 0, scrollY: -window.scrollY },
      pagebreak: pageBreak,
      jsPDF: { format: [this.paper.pageWidth, this.paper.pageHeight], orientation: this.paper.orientaion, putOnlyUsedFonts: true, precision: 1, unit: "px" }
    };

    const element = document.getElementById(`pdf`);;
    options.filename = `PDF_${Math.random() * 10}`;
    const pdf = new html2pdf();

    pdf.set(options).from(element).toPdf().get('pdf').then(function (pdf: any) {
      pdf.setProperties({ title: `Generate PDF` });

      const pdfData = pdf.output('arraybuffer');

      const pdfBlob = new Blob([pdfData], { type: 'application/pdf' });

      const blobURL = URL.createObjectURL(pdfBlob);

      window.open(blobURL, '_blank');
    });
  }

  generatePdf(): void {

    let fileNumber = 1;
    let pageNumber = 1;
    let page = 1;


    const monitorEl = document.getElementById("_monitor");
    if (monitorEl) {
      monitorEl.innerHTML = "";
    }

    let fileEl: any = this._createElement("div", `report_file${fileNumber}`, ["print-area", this.paper.dpiClass]);

    /*
    for (const item of this.data) {
      // data logic for handling page break
    }
    */
  }

  _createElement(tag: string, id: string | null, classList: string[] | null = null, innerHtml: string | null = null): HTMLElement {
    const element = document.createElement(tag);
    if (id) {
      element.id = id;
    }
    if (classList) {
      element.classList.add(...classList);
    }
    if (innerHtml) {
      element.innerHTML = innerHtml;
    }
    return element;
  }

  insertChildrenToNode = (node: any) => (...children: any) => children.forEach((child: any) => node.appendChild(child));

  removeLastChildFromNode = (node: any) => (child: any) => node.removeChild(child);

  _canvasOverflowed(canvas: HTMLElement): boolean {
    let limitHeight;
    switch (this.paper.dpiHeight) {
      case 72:
        if (this.paper.orientaion == "portrait") {
          limitHeight = 842 - 135;
        } else {
          limitHeight = 595 - 135;
        }
        break;
      case 96:
        if (this.paper.orientaion == "portrait") {
          limitHeight = 1123 - 135;
        } else {
          limitHeight = 794 - 135;
        }
        break;
      case 150:
        if (this.paper.orientaion == "portrait") {
          limitHeight = 1754 - 135;
        } else {
          limitHeight = 1240 - 135;
        }
        break;
      case 300:
        if (this.paper.orientaion == "portrait") {
          limitHeight = 3508 - 135;
        } else {
          limitHeight = 2480 - 135;
        }
        break;
      default: return true;
    }
    return canvas.offsetHeight > limitHeight;
  }

  _calculateDisplayDpi() {
    const testDiv = document.getElementById(`testdiv`);
    if (testDiv) {
      const dpi_x = testDiv.offsetWidth;
      const dpi_y = testDiv.offsetHeight;

      switch (dpi_x) {
        case 72:
          this.paper.pageWidth = 595;
          break;
        case 96:
          this.paper.pageWidth = 794;
          break;
        case 150:
          this.paper.pageWidth = 1240;
          break;
        case 300:
          this.paper.pageWidth = 2480;
          break;
      }
      switch (dpi_y) {
        case 72:
          this.paper.pageHeight = 842;
          break;
        case 96:
          this.paper.pageHeight = 1123;
          break;
        case 150:
          this.paper.pageHeight = 1754;
          break;
        case 300:
          this.paper.pageHeight = 3508;
          break;
      }
      this.paper.dpiClass = `${this.paper.orientaion}-${dpi_x}`;
      this.paper.dpiHeight = dpi_y;
      this.paper.dpiWidth = dpi_x;
    }
  }
}
