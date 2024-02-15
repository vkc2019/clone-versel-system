import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'autodeploy';
  slug: string = ''
  url: string = ''
  isRequested: boolean = false;
  status: string = ''
  constructor(private _http: HttpClient) {

  }

  onDeploy() {
    this._http.post(`http://localhost:9200`, {
      url: this.url
    }).subscribe((data: any) => {
      console.log(`Request sent and waiting for response`);
      this.isRequested = true;
      this.slug = data.slug;
      this.status = data.status;
      this.pollForStatus();
    })
  }



  pollForStatus() {
    setTimeout(() => {
      this._http.get(`http://localhost:9200/${this.slug}`).subscribe((data: any) => {
        this.status = data.status;
        if (this.status == 'deployed') {
          console.log(`COmpleted`);
        } else {
          this.pollForStatus();
        }
      })
    }, 5000);
  }
}
