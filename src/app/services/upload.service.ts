import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private uploadUrl = 'http://localhost:3000/upload'; // backend URL

  constructor(private httpClient: HttpClient) {}

 /**
 * Uploads an image to the server.
 * Creates a FormData object, appends the image file to it, and sends a POST request to the server.
 * 
 * @param file The image file to upload.
 * @returns An Observable of the HTTP response from the server.
 */
uploadImage(file: any) {
  const formData: FormData = new FormData();
  formData.append('image', file, file.name);

  return this.httpClient.post(this.uploadUrl, formData);
}

}
