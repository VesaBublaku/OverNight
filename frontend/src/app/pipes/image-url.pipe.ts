import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  // Base URL for images in public folder
  private baseUrl = '/images/';

  transform(value: string): string {
    if (!value) {
      // Return a default image if none provided
      return '/images/default-hotel.jpg';
    }

    // If it's already a full URL (starts with http:// or https://)
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // If it starts with a slash, it's already a root-relative URL
    if (value.startsWith('/')) {
      return value;
    }

    // If it's just a filename like "b354_ho_00_p_1024x768.jpg"
    // or "diamond.jpg", prepend the base URL
    return this.baseUrl + value;
  }
}
