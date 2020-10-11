import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import Quagga from 'quagga';
import { BeepService } from './beep.service';
import * as appConstant from './constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title="mishipay";
  errorMessage: string;
  elementType = appConstant.ELEMENT_TYPE;
  updatedForQRCode: string;
  private lastScannedCode: string;
  private lastScannedCodeDate: number;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private beepService: BeepService) {
  }

  ngAfterViewInit(): void {
    if (!navigator.mediaDevices || !(typeof navigator.mediaDevices.getUserMedia === 'function')) {
      this.errorMessage = 'getUserMedia is not supported';
      return;
    }

    Quagga.init({
        inputStream: {
          constraints: {
            facingMode: 'environment'
          },
          area: { 
            top: '40%', 
            right: '0%',
            left: '0%', 
            bottom: '40%'
          },
        },
        locator: {
          halfSample: true,
          patchSize: "medium"
      },
        decoder: {
          readers: [
            {
              format: "code_128_reader",
              config: {}
          }, {
              format: "ean_reader",
              config: {}
          },  
          ], 
          // readers:['ean_reader','code_128_reader'],
          debug: {
            drawBoundingBox: true,
            showFrequency: false,
            drawScanline: true,
            showPattern: true
        },
        },
      },
      (err) => {
        if (err) {
          this.errorMessage = `QuaggaJS could not be initialized, err: ${err}`;
        } else {
          Quagga.start();
          Quagga.onDetected((res) => {
            this.onBarcodeScanned(res.codeResult.code);
          });
        }
      });
  }

  onBarcodeScanned(code):any {
    const now = new Date().getTime();
    if (code === this.lastScannedCode && (now < this.lastScannedCodeDate + 1500)) {
      return;
    }

    this.updatedForQRCode = '';   
    this.lastScannedCode = code;
    this.updatedForQRCode = `${appConstant.PREFIX_QR}|${appConstant.BARCODE_FORMAT_EAN13}|${code.substring(0,12)}`;
    this.lastScannedCodeDate = now;
    // this.beepService.beepNoise();
    this.changeDetectorRef.detectChanges();
  }

  getImage() {
    const aclass = document.querySelector(".aclass") as HTMLElement;
    const canvas = aclass.querySelector('canvas');
    const imageData = canvas.toDataURL("image/jpeg").toString();
    fetch(imageData).then(res => res.blob())
    .then(r => {
      let fileName =this.lastScannedCode;
      const link = document.createElement('a');
      link.download = fileName + '.jpg';
      const blobUrl = URL.createObjectURL(r);
      link.href = blobUrl;
      link.click();
    })
  }
}