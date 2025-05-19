import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxLineChartsModule } from 'ngx-simple-charts/line';
import { ChartPoints } from 'ngx-simple-charts/line';

@Component({
  selector: 'app-trends-chart',
  standalone: true,
  imports: [NgxLineChartsModule],
  templateUrl: './trends-chart.component.html',
  styleUrls: ['./trends-chart.component.scss']
})
export class TrendsChartComponent implements OnInit, AfterViewInit {

  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  // Simulated retail sales index over 12 months for four sectors
  chartPoints: ChartPoints[] = [
    {
      name: 'Computer & Telecom',
      yScaleWidth: 0,
      xScaleHeight: 0,
      chartPointList: [
        { x: new Date(2025, 0, 31), y: 105 },
        { x: new Date(2025, 1, 28), y: 110 },
        { x: new Date(2025, 2, 31), y: 115 },
        { x: new Date(2025, 3, 30), y: 120 },
        { x: new Date(2025, 4, 31), y: 118 },
        { x: new Date(2025, 5, 30), y: 122 },
        { x: new Date(2025, 6, 31), y: 130 },
        { x: new Date(2025, 7, 31), y: 135 },
        { x: new Date(2025, 8, 30), y: 140 },
        { x: new Date(2025, 9, 31), y: 138 },
        { x: new Date(2025, 10, 30), y: 142 },
        { x: new Date(2025, 11, 31), y: 145 },
      ]
    },
    {
      name: 'Food Stores',
      yScaleWidth: 0,
      xScaleHeight: 0,
      chartPointList: [
        { x: new Date(2025, 0, 31), y: 98 },
        { x: new Date(2025, 1, 28), y: 100 },
        { x: new Date(2025, 2, 31), y: 102 },
        { x: new Date(2025, 3, 30), y: 105 },
        { x: new Date(2025, 4, 31), y: 108 },
        { x: new Date(2025, 5, 30), y: 110 },
        { x: new Date(2025, 6, 31), y: 112 },
        { x: new Date(2025, 7, 31), y: 115 },
        { x: new Date(2025, 8, 30), y: 117 },
        { x: new Date(2025, 9, 31), y: 118 },
        { x: new Date(2025, 10, 30), y: 120 },
        { x: new Date(2025, 11, 31), y: 123 },
      ]
    },
    {
      name: 'Cosmetics',
      yScaleWidth: 0,
      xScaleHeight: 0,
      chartPointList: [
        { x: new Date(2025, 0, 31), y: 75 },
        { x: new Date(2025, 1, 28), y: 78 },
        { x: new Date(2025, 2, 31), y: 80 },
        { x: new Date(2025, 3, 30), y: 82 },
        { x: new Date(2025, 4, 31), y: 85 },
        { x: new Date(2025, 5, 30), y: 88 },
        { x: new Date(2025, 6, 31), y: 90 },
        { x: new Date(2025, 7, 31), y: 92 },
        { x: new Date(2025, 8, 30), y: 95 },
        { x: new Date(2025, 9, 31), y: 97 },
        { x: new Date(2025, 10, 30), y: 100 },
        { x: new Date(2025, 11, 31), y: 102 },
      ]
    },
    {
      name: 'Clothing',
      yScaleWidth: 0,
      xScaleHeight: 0,
      chartPointList: [
        { x: new Date(2025, 0, 31), y: 88 },
        { x: new Date(2025, 1, 28), y: 90 },
        { x: new Date(2025, 2, 31), y: 92 },
        { x: new Date(2025, 3, 30), y: 94 },
        { x: new Date(2025, 4, 31), y: 96 },
        { x: new Date(2025, 5, 30), y: 98 },
        { x: new Date(2025, 6, 31), y: 100 },
        { x: new Date(2025, 7, 31), y: 102 },
        { x: new Date(2025, 8, 30), y: 104 },
        { x: new Date(2025, 9, 31), y: 106 },
        { x: new Date(2025, 10, 30), y: 108 },
        { x: new Date(2025, 11, 31), y: 110 },
      ]
    }
  ];

}
