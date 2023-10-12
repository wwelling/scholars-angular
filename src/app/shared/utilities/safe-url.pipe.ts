import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  pure: true
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(url) {
    return this.sanitized.bypassSecurityTrustResourceUrl(url);
  }
}
