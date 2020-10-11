import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AppComponent } from './app.component';
import { BeepService } from './beep.service';
import * as appConstants from './constant';

describe('AppComponent', () => {
  let component: AppComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxQRCodeModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance; // The component instantiation 
    element = fixture.nativeElement; // The HTML reference
  });
  afterEach(() => {
    fixture.destroy();
    component = null;
    element = null;
  });
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'mishipay'`, () => {
    expect(component.title).toEqual('mishipay');
  });

  it('should render Barcode Scanner', () => {
    expect(element.querySelector('p').textContent).toContain('Barcode Scanner');
  });
  // it('should  call onBarcodeScanned',()=>{
  //   spyOn(component,'onBarcodeScanned')
  //   // expect(component.onBarcodeScanned).toHaveBeenCalledWith(1234567890123);
  // })
  it('should call download QR',fakeAsync(()=> {
      const value = `${appConstants.PREFIX_QR}|${appConstants.BARCODE_FORMAT_EAN13}|${890600962030}`
      component.updatedForQRCode = value;
      fixture.detectChanges();
      spyOn(component,'getImage');
      // expect(element.querySelector('.download').textContent).toContain('Download QR');
      let el = fixture.debugElement.query(By.css('.download'));
      el.triggerEventHandler('click',null);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.getImage).toHaveBeenCalled();
      });
  }));
});

describe('BeepService', () => {
  let service: BeepService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeepService],
    });
    service = TestBed.get(BeepService); // * inject service instance
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
