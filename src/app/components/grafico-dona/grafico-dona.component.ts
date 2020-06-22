import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: [
  ]
})
export class GraficoDonaComponent implements OnInit {

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';

  @Input() grafico: {
    labels: string[],
    data: number[],
    type: string
  };
  // @Input() grafico: any;
  constructor() {

  }
  ngOnInit(): void {
    // console.log(this.grafico);
    // console.log(this.grafico.type);
    this.doughnutChartLabels = this.grafico.labels;
    this.doughnutChartData = this.grafico.data;
    this.doughnutChartType = this.grafico.type;
  }
}
