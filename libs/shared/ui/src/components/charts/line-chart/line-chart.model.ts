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
