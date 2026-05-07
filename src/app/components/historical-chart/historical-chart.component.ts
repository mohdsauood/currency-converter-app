import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { ChartDataPoint } from '../../models/currency.model';

interface SvgPoint {
    x: number;
    y: number;
    rate: number;
    month: string;
}

@Component({
    selector: 'app-historical-chart',
    templateUrl: './historical-chart.component.html',
    styleUrls: ['./historical-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricalChartComponent implements OnChanges {
    @Input() data: ChartDataPoint[] = [];
    @Input() fromCode = '';
    @Input() toCode = '';
    @Input() isLoading = false;

    // SVG viewBox constants
    readonly VW = 860;
    readonly VH = 360;
    readonly ML = 68;  // margin left (space for y-axis labels)
    readonly MR = 20;  // margin right
    readonly MT = 42;  // margin top
    readonly MB = 52;  // margin bottom

    get cW(): number { return this.VW - this.ML - this.MR; }
    get cH(): number { return this.VH - this.MT - this.MB; }

    points: SvgPoint[] = [];
    linePath = '';
    areaPath = '';
    yTicks: { y: number; label: string }[] = [];
    hoveredIndex: number | null = null;

    ngOnChanges(): void {
        if (this.data?.length) {
            this.compute();
        }
    }

    private compute(): void {
        const rates = this.data.map(d => d.rate);
        const dataMin = Math.min(...rates);
        const dataMax = Math.max(...rates);

        const ticks = this.niceTickValues(dataMin, dataMax, 5);
        const yMin = ticks[0];
        const yMax = ticks[ticks.length - 1];

        const toY = (v: number) => this.MT + this.cH - ((v - yMin) / (yMax - yMin)) * this.cH;
        const xStep = this.data.length > 1 ? this.cW / (this.data.length - 1) : this.cW;
        const toX = (i: number) => this.ML + i * xStep;

        this.points = this.data.map((d, i) => ({
            x: toX(i),
            y: toY(d.rate),
            rate: d.rate,
            month: d.month,
        }));

        this.linePath = this.points
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
            .join(' ');

        const bY = this.MT + this.cH;
        this.areaPath = `${this.linePath} L${this.points[this.points.length - 1].x.toFixed(1)},${bY} L${this.points[0].x.toFixed(1)},${bY} Z`;

        this.yTicks = ticks.map(v => ({ y: toY(v), label: v.toFixed(4) }));
    }

    private niceTickValues(min: number, max: number, count: number): number[] {
        const range = max - min || 0.1;
        const rawStep = range / (count - 1);
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const normalized = rawStep / magnitude;
        let step: number;
        if (normalized < 1.5) step = 1 * magnitude;
        else if (normalized < 3) step = 2 * magnitude;
        else if (normalized < 7) step = 5 * magnitude;
        else step = 10 * magnitude;

        const niceMin = Math.floor(min / step) * step;
        const ticks: number[] = [];
        for (let i = 0; i <= count + 1; i++) {
            const v = parseFloat((niceMin + i * step).toFixed(6));
            ticks.push(v);
            if (v >= max) break;
        }
        // ensure we have at least count ticks
        while (ticks.length < count) {
            ticks.push(parseFloat((ticks[ticks.length - 1] + step).toFixed(6)));
        }
        return ticks;
    }

    tooltipTransform(p: SvgPoint): string {
        const w = 148;
        const h = 52;
        const tx = p.x > this.VW / 2 ? p.x - w - 12 : p.x + 12;
        const ty = Math.max(p.y - h - 8, this.MT);
        return `translate(${tx.toFixed(1)},${ty.toFixed(1)})`;
    }

    onHover(i: number): void { this.hoveredIndex = i; }
    onLeave(): void { this.hoveredIndex = null; }
}
