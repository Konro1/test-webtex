import {Component, OnInit} from '@angular/core';
import {WeatherService} from "./services/weather.service";
import {Forecast} from "./interfaces/forecast";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'Forecast';
    lat = '38.9936';
    lon = '-77.0224';
    forecast: Forecast[];
    error: string

    constructor(private _weatherService: WeatherService) {}

    ngOnInit(): void {}

    public submitRequest() {
        this.error = '';
        this.forecast = [];
        this._weatherService.getWeather(this.lat, this.lon).then((data:Forecast[]) => {
            this.forecast = data;
        }).catch(error => {
            var json = error.json();
            this.error = json.error;
        });
    }
}
