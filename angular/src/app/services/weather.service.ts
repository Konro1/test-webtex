import {Injectable} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";

@Injectable()
export class WeatherService {

    private _weatherUrl = 'http://localhost:3000/api/getWeather'; //@todo move to config

    constructor(private _http: Http) {}

    public getWeather(lat, lon) {

        var params: URLSearchParams = new URLSearchParams();
        params.set('lat', lat);
        params.set('lon', lon);

        return new Promise((resolve, reject) => {

            this._http.get(this._weatherUrl, {search: params}).subscribe((response) => {
                if (!response.ok) {
                    console.error(response.statusText);
                    reject();
                }
                var body = response.json();
                resolve(body.response);
            }, (error) => {
                reject(error);
            });
        })
    }

}
