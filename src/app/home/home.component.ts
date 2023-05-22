import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AuthService } from '../services/auth.service';
import { ChartService } from '../services/chart.service';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Browser } from '../models/Browser';
import { MatTableDataSource } from '@angular/material/table';
import { JobEmployment } from '../models/JobEmployment';
import { RainTimeline } from '../models/RainTimeline';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isAnyLoaded() {
    if (this.isBrowserLoading || this.isJobLoading || this.isRainDataLoading) {
      return true;
    }
    return false;
  }

  isBrowserLoading = true;
  isJobLoading = true;
  isRainDataLoading = true;
  BrowserArray: Browser[];
  JobEmploymentArray: JobEmployment[];
  RainTimelineArray: RainTimeline[];

  pieColumns: string[] = ['id', 'name', 'share'];
  pieDataSource: any;
  lineColumns: string[] = [
    'category',
    'developers',
    'manufacturing',
    'sales',
    'operations',
    'other',
  ];
  lineDataSource: any;
  barColumns: string[] = ['category', 'tokyo', 'newYork', 'london', 'berlin'];
  barDataSource: any;
  pieData: any = [];
  lineData: any = [];
  barData: any = [];
  pieOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'Browser market shares in May, 2020',
      align: 'center',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
        showInLegend: true,
      },
    },
    series: [
      {
        colorByPoint: true,
        type: 'pie',
      },
    ],
  };
  lineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    title: {
      text: 'U.S Solar Employment Growth by Job Category, 2010-2020',
      align: 'center',
    },
    yAxis: {
      title: {
        text: 'Number of Employees',
      },
    },
    xAxis: {
      accessibility: {
        rangeDescription: 'Range: 2010 to 2020',
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },
    series: [],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        },
      ],
    },
  };
  barOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      type: 'column',
    },
    title: {
      text: 'Monthly Average Rainfall',
    },
    subtitle: {
      text: 'Source: WorldClimate.com',
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Rainfall (mm)',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [],
  };
  numData: Array<Array<number>>;
  barArrayData: Array<Array<number>>;
  constructor(
    private authService: AuthService,
    private chartService: ChartService
  ) {}
  ngOnInit(): void {
    this.chartService
      .getBrowsers()
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        data.forEach((v, i) => {
          this.pieData.push({
            name: v.name,
            y: v.share,
          });
        });
        this.pieOptions.series = [
          {
            name: '',
            type: 'pie',
            data: this.pieData,
          },
        ];
        this.isBrowserLoading = false;
        this.BrowserArray = data;
        this.pieDataSource = new MatTableDataSource<Browser>(this.BrowserArray);
      });
    this.chartService
      .getJobEmployments()
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.numData = new Array<Array<number>>();
        this.numData.push(data.map((e) => e.category));
        this.numData.push(data.map((e) => e.developers));
        this.numData.push(data.map((e) => e.manufacturing));
        this.numData.push(data.map((e) => e.sales));
        this.numData.push(data.map((e) => e.operations));
        this.numData.push(data.map((e) => e.other));

        this.lineColumns.forEach((e, i) => {
          this.lineData.push({
            name: e,
            type: 'line',
            data: this.numData.at(i),
          });
        });
        this.lineOptions.series = this.lineData;
        this.isJobLoading = false;
        this.JobEmploymentArray = data;
        this.lineDataSource = new MatTableDataSource<JobEmployment>(data);
      });
    this.chartService
      .getRainTimelines()
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.barArrayData = new Array<Array<number>>();
        this.barArrayData.push(data.map((e) => e.category));
        this.barArrayData.push(data.map((e) => e.tokyo));
        this.barArrayData.push(data.map((e) => e.newYork));
        this.barArrayData.push(data.map((e) => e.london));
        this.barArrayData.push(data.map((e) => e.berlin));
        this.barColumns.forEach((e, i) => {
          this.barData.push({
            name: e,
            type: 'column',
            data: this.barArrayData.at(i),
          });
        });
        this.barOptions.series = this.barData;
        this.isRainDataLoading = false;
        this.RainTimelineArray = data;
        this.barDataSource = new MatTableDataSource<RainTimeline>(data);
      });
  }
  handleError(err: any, caught: any) {
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
  highCharts = Highcharts;
}
