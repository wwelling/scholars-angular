import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, OnChanges, Renderer2, SimpleChanges, ChangeDetectorRef , Component, Inject, Input, PLATFORM_ID } from '@angular/core';

declare var twttr: any;

@Component({
  selector: 'scholars-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss'],
})


export class TwitterComponent implements AfterViewInit, OnChanges  {
  @Input()
  public id: string;

  @Input()
  public height = 350;
  public sanitizedId: string;

  // constructor(@Inject(PLATFORM_ID) private platformId: string) { }

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadScript('https://platform.twitter.com/widgets.js').then(() => {
        this.sanitizedId = this.sanitizeId(this.id);
        console.log('Sanitizeeeeeeeeed ID:', this.sanitizedId);

        setTimeout(() => {
          this.initializeTwitterWidget();
        }, 700); // Delay to ensure DOM is ready
      }).catch((error) => {
        console.error('Error loading Twitter widgets script:', error);
      });
    }
  }

  private initializeTwitterWidget(): void {
    if (typeof twttr !== 'undefined') {

      console.log("idddd");
          console.log(this.id);

      if (this.id) {
        this.sanitizedId = this.sanitizeId(this.id);
        console.log("sanitizedId");
          console.log(this.sanitizedId );
          // const containerElement = document.getElementById('C2_H5'); // Use a hardcoded ID to test

        const containerElement = document.getElementById(this.sanitizedId);
        console.log("containerElement");
          console.log(containerElement);
        if (containerElement) {
          
          twttr.widgets.createTimeline(
            {
              sourceType: 'profile',
              screenName: this.id.replace('@', '')
            },
            containerElement,
            {
              height: this.height,
              theme: 'light'
            }
          ).then((el: any) => {
            console.log('Timeline displayed:', el);
          }).catch((err: any) => {
            console.error('Error displaying timeline:', err);
          });
        } else {
          console.error('Container element not found for sanitized ID:', this.sanitizedId);
        }
      } else {
        console.error('No ID provided for Twitter timeline.');
      }
    } else {
      console.error('Twitter widgets script is not loaded or `twttr` is not defined.');
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById('twitter-wjs');
      if (existingScript) {
        resolve(); // Script already loaded
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = 'twitter-wjs';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (isPlatformBrowser(this.platformId) && changes.id) {
      this.cdr.detectChanges(); // Trigger change detection on ID change
      setTimeout(() => this.loadTimeline(), 100); // Delay to ensure DOM is ready
    }
  }

  private loadTimeline(): void {
    if (typeof twttr !== 'undefined') { // Check if Twitter widgets script is loaded
      if (this.id) {
        this.sanitizedId = this.sanitizeId(this.id);
        console.log("Sanitized ID:", this.sanitizedId); // Debug log for ID
        const containerElement = document.getElementById(this.sanitizedId);
        if (containerElement) {
          console.log("Container element found for ID:", this.sanitizedId);
          twttr.widgets.createTimeline(
            {
              sourceType: 'profile',
              screenName: this.id.replace('@', '') // Remove '@' if present
            },
            containerElement,
            {
              height: this.height,
              theme: 'light' // You can change this to 'dark' if needed
            }
          ).then((el: any) => {
            console.log('Timeline displayed:', el);
          }).catch((err: any) => {
            console.error('Error displaying timeline:', err);
          });
        } else {
          console.error('Container element not found for sanitized ID:', this.sanitizedId);
        }
      } else {
        console.error('No ID provided for Twitter timeline.');
      }
    } else {
      console.error('Twitter widgets script is not loaded or `twttr` is not defined.');
    }
  }

  private sanitizeId(id: string): string {
    return id.replace(/[^a-zA-Z0-9_]/g, '');
  }

  //////////////////


  // ngAfterViewInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     // tslint:disable-next-line: no-string-literal
  //     window['twttr'].widgets.load();
  //   }
  // }
  
}




