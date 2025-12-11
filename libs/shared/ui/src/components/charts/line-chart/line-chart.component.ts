import { AfterViewInit, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LineChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface LineChartOptions {
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  animationDuration?: number;
}

@Component({
  selector: 'tn-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class LineChartComponent implements AfterViewInit{
  data = input<LineChartData>({
    labels: [],
    datasets: [],
  });

  options = input<LineChartOptions>({
    height: 400,
    showLegend: true,
    showGrid: true,
    responsive: true,
    animationDuration: 750,
  });

  chartId = `line-chart-${Math.random().toString(36).substr(2, 9)}`;

  ngAfterViewInit() {
    this.renderChart();
  }

  private renderChart() {
    const canvas = document.getElementById(this.chartId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chartData = this.data();
    const chartOptions = this.options();

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = chartOptions.height || 400;

    // Draw line chart
    this.drawLineChart(ctx, chartData, chartOptions);

    // Redraw on resize
    window.addEventListener('resize', () => {
      canvas.width = canvas.offsetWidth;
      this.drawLineChart(ctx, chartData, chartOptions);
    });
  }

  private drawLineChart(
    ctx: CanvasRenderingContext2D,
    data: LineChartData,
    options: LineChartOptions
  ) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 60;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (options.showGrid) {
      this.drawGrid(ctx, padding, plotWidth, plotHeight, data.labels.length);
    }

    // Draw axes
    this.drawAxes(ctx, padding, plotWidth, plotHeight);

    // Draw data lines
    data.datasets.forEach((dataset, index) => {
      this.drawDataset(ctx, dataset, data.labels, padding, plotWidth, plotHeight);
    });

    // Draw legend
    if (options.showLegend && data.datasets.length > 0) {
      this.drawLegend(ctx, data.datasets, width);
    }

    // Draw labels
    this.drawLabels(ctx, data.labels, padding, plotWidth, plotHeight);
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    padding: number,
    width: number,
    height: number,
    labelCount: number
  ) {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const yStep = height / 5;
    for (let i = 0; i <= 5; i++) {
      const y = padding + i * yStep;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }

    // Vertical grid lines
    const xStep = width / (labelCount - 1 || 1);
    for (let i = 0; i < labelCount; i++) {
      const x = padding + i * xStep;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + height);
      ctx.stroke();
    }
  }

  private drawAxes(
    ctx: CanvasRenderingContext2D,
    padding: number,
    width: number,
    height: number
  ) {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + height);
    ctx.lineTo(padding + width, padding + height);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + height);
    ctx.stroke();
  }

  private drawDataset(
    ctx: CanvasRenderingContext2D,
    dataset: LineChartData['datasets'][0],
    labels: string[],
    padding: number,
    width: number,
    height: number
  ) {
    const dataPoints = dataset.data;
    const maxValue = Math.max(...dataPoints, 0);
    const minValue = Math.min(...dataPoints, 0);
    const range = maxValue - minValue || 1;

    const xStep = width / (dataPoints.length - 1 || 1);
    const yScale = height / range;

    // Draw line
    ctx.strokeStyle = dataset.borderColor || '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();

    dataPoints.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = padding + height - (value - minValue) * yScale;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = dataset.borderColor || '#667eea';
    dataPoints.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = padding + height - (value - minValue) * yScale;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private drawLegend(
    ctx: CanvasRenderingContext2D,
    datasets: LineChartData['datasets'],
    width: number
  ) {
    const startX = width - 250;
    const startY = 20;
    const itemHeight = 25;

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#374151';

    datasets.forEach((dataset, index) => {
      const y = startY + index * itemHeight;

      // Draw color box
      ctx.fillStyle = dataset.borderColor || '#667eea';
      ctx.fillRect(startX, y - 10, 15, 15);

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.fillText(dataset.label, startX + 25, y);
    });
  }

  private drawLabels(
    ctx: CanvasRenderingContext2D,
    labels: string[],
    padding: number,
    width: number,
    height: number
  ) {
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';

    const xStep = width / (labels.length - 1 || 1);

    labels.forEach((label, index) => {
      const x = padding + index * xStep;
      const y = padding + height + 25;
      ctx.fillText(label, x, y);
    });

    // Y axis labels
    ctx.textAlign = 'right';
    const yStep = height / 5;
    const dataMax = 100; // Configurabile

    for (let i = 0; i <= 5; i++) {
      const y = padding + (5 - i) * yStep;
      const value = Math.round((i / 5) * dataMax);
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
  }
}
